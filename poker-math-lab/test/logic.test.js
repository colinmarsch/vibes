const test = require("node:test");
const assert = require("node:assert/strict");
const {
  calculateRequiredEquity,
  calculateDrawEquity,
  createQuestion,
  createEquityQuestion,
  isAnswerCorrect,
  parseCard,
  roundEquityForDisplay,
} = require("../logic.js");

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function straightState(cards) {
  const ranks = new Set(cards.map((card) => card.slice(0, -1)));
  const rankOrder = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
  const windows = [
    ["A", "2", "3", "4", "5"],
    ...Array.from({ length: 9 }, (_unused, index) => rankOrder.slice(index, index + 5)),
  ];
  const made = windows.some((window) => window.every((rank) => ranks.has(rank)));
  const outs = rankOrder.filter(
    (candidate) =>
      !ranks.has(candidate) &&
      windows.some((window) =>
        window.includes(candidate) && window.every((rank) => rank === candidate || ranks.has(rank))
      )
  );
  return { made, outs };
}

function maximumSuitCount(cards) {
  const counts = new Map();
  for (const card of cards) {
    const suit = card.slice(-1);
    counts.set(suit, (counts.get(suit) || 0) + 1);
  }
  return Math.max(...counts.values());
}

test("calculates required equity from the final pot after calling", () => {
  assert.equal(calculateRequiredEquity(100, 50), 25);
  assert.equal(calculateRequiredEquity(60, 30), 25);
  assert.ok(Math.abs(calculateRequiredEquity(100, 100) - 100 / 3) < 1e-10);
});

test("accepts answers inside the configured tolerance", () => {
  assert.equal(isAnswerCorrect(24.6, 25, 0.5), true);
  assert.equal(isAnswerCorrect(25.6, 25, 0.5), false);
  assert.equal(isAnswerCorrect(Number.NaN, 25, 0.5), false);
});

test("grades tolerance against the one-decimal value shown to the player", () => {
  const displayedEquity = roundEquityForDisplay(100 / 6);
  assert.equal(displayedEquity, 16.7);
  assert.equal(isAnswerCorrect(17.7, displayedEquity, 1), true);
  assert.equal(isAnswerCorrect(17.8, displayedEquity, 1), false);
});

test("includes exact decimal tolerance boundaries despite floating-point error", () => {
  assert.equal(isAnswerCorrect(17.7, 16.7, 1), true);
  assert.equal(isAnswerCorrect(17.7001, 16.7, 1), false);
});

test("uses the same one-point tolerance at every difficulty", () => {
  for (const difficulty of ["easy", "standard", "hard"]) {
    assert.equal(createQuestion(difficulty, () => 0).tolerance, 1);
    assert.equal(createEquityQuestion(difficulty, () => 0).tolerance, 1);
  }
});

test("creates deterministic valid pot-odds questions", () => {
  const question = createQuestion("easy", () => 0);
  assert.equal(question.pot, 40);
  assert.equal(question.bet, 10);
  assert.ok(Math.abs(question.equity - 100 / 6) < 1e-10);
});

test("calculates exact draw equity with one or two cards to come", () => {
  assert.ok(Math.abs(calculateDrawEquity(9, 1) - (9 / 46) * 100) < 1e-10);
  const expectedByRiver = (1 - (38 / 47) * (37 / 46)) * 100;
  assert.ok(Math.abs(calculateDrawEquity(9, 2) - expectedByRiver) < 1e-10);
  assert.equal(Number.isNaN(calculateDrawEquity(9, 3)), true);
});

test("random equity questions contain valid cards and correct street-specific math", () => {
  const random = seededRandom(20260825);

  for (const difficulty of ["easy", "standard", "hard"]) {
    for (let index = 0; index < 500; index += 1) {
      const question = createEquityQuestion(difficulty, random);
      const cards = [...question.hero, ...(question.villain || []), ...question.board];

      assert.equal(question.hero.length, 2);
      assert.equal(new Set(cards).size, cards.length);
      assert.ok(cards.every((card) => /^[2-9TJQKA][hdcs]$/.test(card)));
      assert.equal(question.action, question.handEquity >= question.requiredEquity ? "call" : "fold");

      if (question.street === "Preflop") {
        assert.equal(question.board.length, 0);
        assert.equal(question.villain.length, 2);
        assert.equal(question.outs, null);
        assert.equal(question.cardsToCome, 5);
        assert.ok(question.handEquity > 0 && question.handEquity < 100);
      } else {
        assert.equal(question.villain, undefined);
        assert.equal(question.board.length, question.street === "Flop" ? 3 : 4);
        assert.equal(new Set(cards.map((card) => card.slice(0, -1))).size, cards.length);
        assert.ok([4, 8, 9, 15].includes(question.outs));
        assert.equal(question.cardsToCome, question.street === "Flop" ? 2 : 1);
        assert.equal(question.handEquity, calculateDrawEquity(question.outs, question.cardsToCome));

        const straight = straightState(cards);
        assert.equal(straight.made, false);
        if (question.drawName.includes("Open-ended") || question.drawName.includes("combo")) {
          assert.equal(straight.outs.length, 2);
        } else if (question.drawName.includes("Gutshot")) {
          assert.equal(straight.outs.length, 1);
        } else {
          assert.equal(straight.outs.length, 0);
        }

        if (question.drawName.toLowerCase().includes("flush")) {
          assert.equal(maximumSuitCount(cards), 4);
        } else {
          assert.ok(maximumSuitCount(cards) <= 2);
        }
      }
    }
  }
});

test("randomizes between preflop, three-card flops, and four-card turns at every difficulty", () => {
  for (const difficulty of ["easy", "standard", "hard"]) {
    const random = seededRandom(20260826);
    const boardSizes = new Set();

    for (let index = 0; index < 100; index += 1) {
      const question = createEquityQuestion(difficulty, random);
      boardSizes.add(question.board.length);
      assert.equal(question.street, { 0: "Preflop", 3: "Flop", 4: "Turn" }[question.board.length]);
    }

    assert.deepEqual(boardSizes, new Set([0, 3, 4]));
  }
});

test("review regression seeds preserve only the advertised draw", () => {
  const straightQuestion = createEquityQuestion("standard", seededRandom(19));
  const straightCards = [...straightQuestion.hero, ...straightQuestion.board];
  assert.equal(straightQuestion.outs, 8);
  assert.ok(maximumSuitCount(straightCards) <= 2);

  const flushQuestion = createEquityQuestion("easy", seededRandom(9));
  const flushCards = [...flushQuestion.hero, ...flushQuestion.board];
  assert.equal(flushQuestion.outs, 9);
  assert.equal(new Set(flushCards.map((card) => card.slice(0, -1))).size, flushCards.length);
});

test("equity hands are procedurally randomized instead of drawn from a preset list", () => {
  const random = seededRandom(42);
  const signatures = new Set();

  while (signatures.size < 250) {
    const question = createEquityQuestion("standard", random);
    if (question.street === "Preflop") continue;
    signatures.add([...question.hero, ...question.board].join("-"));
  }

  assert.equal(signatures.size, 250);
});

test("an injected random source makes generated equity questions reproducible", () => {
  assert.deepEqual(
    createEquityQuestion("hard", seededRandom(7)),
    createEquityQuestion("hard", seededRandom(7))
  );
});

test("can generate both call and fold decisions", () => {
  const random = seededRandom(99);
  const actions = new Set();
  for (let index = 0; index < 200; index += 1) {
    actions.add(createEquityQuestion("standard", random).action);
  }
  assert.deepEqual(actions, new Set(["call", "fold"]));
});

test("parses display and accessibility details for playing cards", () => {
  assert.deepEqual(parseCard("Ah"), {
    rank: "A",
    suit: "h",
    suitName: "hearts",
    suitSymbol: "♥",
    isRed: true,
  });
  assert.equal(parseCard("Tc").isRed, false);
});
