const test = require("node:test");
const assert = require("node:assert/strict");
const {
  EQUITY_SCENARIOS,
  calculateRequiredEquity,
  calculateDrawEquity,
  createQuestion,
  createEquityQuestion,
  isAnswerCorrect,
  parseCard,
  roundEquityForDisplay,
} = require("../logic.js");

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

test("creates deterministic valid questions", () => {
  const question = createQuestion("easy", () => 0);
  assert.equal(question.pot, 40);
  assert.equal(question.bet, 10);
  assert.ok(Math.abs(question.equity - 100 / 6) < 1e-10);
  assert.equal(question.tolerance, 1);
});

test("calculates exact draw equity with one or two cards to come", () => {
  assert.ok(Math.abs(calculateDrawEquity(9, 1) - (9 / 46) * 100) < 1e-10);

  const expectedByRiver = (1 - (38 / 47) * (37 / 46)) * 100;
  assert.ok(Math.abs(calculateDrawEquity(9, 2) - expectedByRiver) < 1e-10);
  assert.equal(Number.isNaN(calculateDrawEquity(9, 3)), true);
});

test("creates an equity question and recommends the mathematically profitable action", () => {
  const question = createEquityQuestion("standard", () => 0);

  assert.deepEqual(question.hero, ["Kc", "Qc"]);
  assert.deepEqual(question.board, ["Jc", "4c", "2d"]);
  assert.equal(question.outs, 9);
  assert.equal(question.cardsToCome, 2);
  assert.equal(question.action, "call");
  assert.ok(question.handEquity > question.requiredEquity);
});

test("describes the actual outs in the open-ended straight scenario", () => {
  const values = [0, 0, 0.4];
  const question = createEquityQuestion("standard", () => values.shift());

  assert.deepEqual(question.hero, ["Ks", "Qd"]);
  assert.match(question.explanation, /ace or nine/);
  assert.equal(question.outs, 8);
});

test("can generate fold decisions when draw equity is below the price", () => {
  const values = [0, 0.99, 0.99];
  const question = createEquityQuestion("standard", () => values.shift());

  assert.equal(question.drawName, "Gutshot straight draw");
  assert.equal(question.action, "fold");
  assert.ok(question.handEquity < question.requiredEquity);
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

test("keeps every curated scenario internally valid", () => {
  for (const scenario of Object.values(EQUITY_SCENARIOS)) {
    const cards = [...scenario.hero, ...scenario.board];
    assert.equal(new Set(cards).size, cards.length);
    assert.equal(scenario.board.length, scenario.street === "Flop" ? 3 : 4);
    assert.ok(scenario.outs > 0 && scenario.outs <= 15);
  }
});
