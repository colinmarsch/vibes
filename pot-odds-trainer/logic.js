(function attachPokerMathLogic(root) {
  const ANSWER_TOLERANCE = 1;
  const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
  const SUITS = ["h", "d", "c", "s"];
  const SUIT_NAMES = { h: "hearts", d: "diamonds", c: "clubs", s: "spades" };

  const DIFFICULTIES = {
    easy: {
      pots: [40, 60, 80, 100, 120, 160, 200],
      betFractions: [0.25, 0.5, 0.75, 1],
      drawTypes: [
        { kind: "flush", street: "Turn" },
        { kind: "open-ended", street: "Turn" },
      ],
    },
    standard: {
      pots: [30, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250],
      betFractions: [0.25, 1 / 3, 0.4, 0.5, 2 / 3, 0.75, 1, 1.25],
      drawTypes: [
        { kind: "flush", street: "Flop" },
        { kind: "open-ended", street: "Flop" },
        { kind: "gutshot", street: "Turn" },
      ],
    },
    hard: {
      pots: [37, 46, 58, 73, 86, 95, 113, 127, 145, 178, 225],
      betFractions: [0.28, 0.37, 0.43, 0.58, 0.68, 0.82, 0.93, 1.17, 1.38],
      drawTypes: [
        { kind: "combo", street: "Flop" },
        { kind: "combo", street: "Turn" },
      ],
    },
  };

  function randomIndex(length, random) {
    return Math.min(length - 1, Math.floor(random() * length));
  }

  function randomItem(items, random) {
    return items[randomIndex(items.length, random)];
  }

  function shuffle(items, random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = randomIndex(index + 1, random);
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function card(rank, suit) {
    return `${rank}${suit}`;
  }

  function takeRandomCard(usedCards, random, predicate = () => true) {
    const candidates = [];
    for (const rank of RANKS) {
      for (const suit of SUITS) {
        const candidate = card(rank, suit);
        if (!usedCards.has(candidate) && predicate(rank, suit)) candidates.push(candidate);
      }
    }

    const selected = randomItem(candidates, random);
    usedCards.add(selected);
    return selected;
  }

  function rankLabel(rank) {
    return { T: "ten", J: "jack", Q: "queen", K: "king", A: "ace" }[rank] || rank;
  }

  function createFlushDraw(street, random) {
    const suit = randomItem(SUITS, random);
    const suitedRanks = shuffle(RANKS, random).slice(0, 4);
    const hero = suitedRanks.slice(0, 2).map((rank) => card(rank, suit));
    const board = suitedRanks.slice(2).map((rank) => card(rank, suit));
    const usedCards = new Set([...hero, ...board]);
    const fillerCount = street === "Flop" ? 1 : 2;

    for (let index = 0; index < fillerCount; index += 1) {
      board.push(takeRandomCard(usedCards, random, (_rank, candidateSuit) => candidateSuit !== suit));
    }

    const highRank = hero.reduce(
      (highest, rankCard) =>
        RANKS.indexOf(rankCard.slice(0, -1)) > RANKS.indexOf(highest)
          ? rankCard.slice(0, -1)
          : highest,
      "2"
    );
    const chances = street === "Flop" ? "two chances to hit by the river" : "one card to come";

    return {
      street,
      hero,
      board: shuffle(board, random),
      drawName: highRank === "A" ? "Nut flush draw" : `${rankLabel(highRank)}-high flush draw`,
      outs: 9,
      explanation: `Nine ${SUIT_NAMES[suit]} remain to complete your flush, with ${chances}.`,
    };
  }

  function createStraightRanks(kind, random) {
    if (kind === "open-ended" || kind === "combo") {
      const start = 1 + randomIndex(8, random);
      return {
        madeRanks: RANKS.slice(start, start + 4),
        outRanks: [RANKS[start - 1], RANKS[start + 4]],
      };
    }

    const start = randomIndex(9, random);
    const straightRanks = RANKS.slice(start, start + 5);
    const missingIndex = 1 + randomIndex(3, random);
    return {
      madeRanks: straightRanks.filter((_rank, index) => index !== missingIndex),
      outRanks: [straightRanks[missingIndex]],
    };
  }

  function createStraightDraw(kind, street, random) {
    const { madeRanks, outRanks } = createStraightRanks(kind, random);
    const dealtRanks = shuffle(madeRanks, random);
    const usedCards = new Set();
    const hero = dealtRanks.slice(0, 2).map((rank) => takeRandomCard(usedCards, random, (candidateRank) => candidateRank === rank));
    const board = dealtRanks.slice(2).map((rank) => takeRandomCard(usedCards, random, (candidateRank) => candidateRank === rank));
    const fillerCount = street === "Flop" ? 1 : 2;

    for (let index = 0; index < fillerCount; index += 1) {
      board.push(takeRandomCard(usedCards, random, (rank) => !outRanks.includes(rank)));
    }

    const outs = kind === "gutshot" ? 4 : 8;
    const outDescription = outRanks.map(rankLabel).join(" or ");
    const chances = street === "Flop" ? "two cards to come" : "one card to come";

    return {
      street,
      hero,
      board: shuffle(board, random),
      drawName: kind === "gutshot" ? "Gutshot straight draw" : "Open-ended straight draw",
      outs,
      explanation: `${outDescription[0].toUpperCase()}${outDescription.slice(1)} completes your straight: ${outs} clean outs with ${chances}.`,
    };
  }

  function createComboDraw(street, random) {
    const { madeRanks, outRanks } = createStraightRanks("combo", random);
    const dealtRanks = shuffle(madeRanks, random);
    const flushSuit = randomItem(SUITS, random);
    const otherSuits = SUITS.filter((suit) => suit !== flushSuit);
    const hero = dealtRanks.slice(0, 2).map((rank) => card(rank, flushSuit));
    const board = [
      card(dealtRanks[2], flushSuit),
      card(dealtRanks[3], randomItem(otherSuits, random)),
    ];
    const usedCards = new Set([...hero, ...board]);

    board.push(takeRandomCard(
      usedCards,
      random,
      (rank, suit) => suit === flushSuit && !madeRanks.includes(rank) && !outRanks.includes(rank)
    ));

    if (street === "Turn") {
      board.push(takeRandomCard(
        usedCards,
        random,
        (rank, suit) => suit !== flushSuit && !outRanks.includes(rank)
      ));
    }

    const outDescription = outRanks.map(rankLabel).join(" or ");
    return {
      street,
      hero,
      board: shuffle(board, random),
      drawName: "Straight and flush combo draw",
      outs: 15,
      explanation: `Nine ${SUIT_NAMES[flushSuit]} plus six non-${SUIT_NAMES[flushSuit]} ${outDescription}s give you 15 unique outs.`,
    };
  }

  function createEquityScenario(drawType, random) {
    if (drawType.kind === "flush") return createFlushDraw(drawType.street, random);
    if (drawType.kind === "combo") return createComboDraw(drawType.street, random);
    return createStraightDraw(drawType.kind, drawType.street, random);
  }

  function calculateRequiredEquity(pot, bet) {
    return (bet / (pot + bet + bet)) * 100;
  }

  function calculateDrawEquity(outs, cardsToCome) {
    if (!Number.isInteger(outs) || outs < 0 || outs > 46) return Number.NaN;
    if (cardsToCome === 1) return (outs / 46) * 100;
    if (cardsToCome === 2) {
      return (1 - ((47 - outs) / 47) * ((46 - outs) / 46)) * 100;
    }
    return Number.NaN;
  }

  function createBet(difficulty, random) {
    const config = DIFFICULTIES[difficulty] || DIFFICULTIES.standard;
    const pot = randomItem(config.pots, random);
    const fraction = randomItem(config.betFractions, random);
    const rounding = difficulty === "hard" ? 1 : 5;
    const bet = Math.max(rounding, Math.round((pot * fraction) / rounding) * rounding);
    return { pot, bet };
  }

  function createQuestion(difficulty = "standard", random = Math.random) {
    const { pot, bet } = createBet(difficulty, random);
    return {
      pot,
      bet,
      equity: calculateRequiredEquity(pot, bet),
      tolerance: ANSWER_TOLERANCE,
    };
  }

  function createEquityQuestion(difficulty = "standard", random = Math.random) {
    const config = DIFFICULTIES[difficulty] || DIFFICULTIES.standard;
    const { pot, bet } = createBet(difficulty, random);
    const drawType = randomItem(config.drawTypes, random);
    const scenario = createEquityScenario(drawType, random);
    const cardsToCome = scenario.street === "Flop" ? 2 : 1;
    const requiredEquity = calculateRequiredEquity(pot, bet);
    const handEquity = calculateDrawEquity(scenario.outs, cardsToCome);

    return {
      ...scenario,
      pot,
      bet,
      cardsToCome,
      requiredEquity,
      handEquity,
      action: handEquity >= requiredEquity ? "call" : "fold",
      tolerance: ANSWER_TOLERANCE,
    };
  }

  function isAnswerCorrect(answer, equity, tolerance = ANSWER_TOLERANCE) {
    if (!Number.isFinite(answer)) return false;

    const roundingAllowance =
      Number.EPSILON * Math.max(Math.abs(answer), Math.abs(equity), 1) * 4;

    return Math.abs(answer - equity) <= tolerance + roundingAllowance;
  }

  function roundEquityForDisplay(equity) {
    return Number(equity.toFixed(1));
  }

  function formatMoney(amount) {
    return `$${amount.toLocaleString("en-US")}`;
  }

  function parseCard(cardCode) {
    const suitSymbols = { h: "♥", d: "♦", c: "♣", s: "♠" };
    const suit = cardCode.slice(-1);
    return {
      rank: cardCode.slice(0, -1),
      suit,
      suitName: SUIT_NAMES[suit],
      suitSymbol: suitSymbols[suit],
      isRed: suit === "h" || suit === "d",
    };
  }

  const api = {
    ANSWER_TOLERANCE,
    DIFFICULTIES,
    RANKS,
    SUITS,
    calculateRequiredEquity,
    calculateDrawEquity,
    createQuestion,
    createEquityQuestion,
    isAnswerCorrect,
    roundEquityForDisplay,
    formatMoney,
    parseCard,
  };

  root.PokerMathLogic = api;
  root.PotOddsLogic = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
