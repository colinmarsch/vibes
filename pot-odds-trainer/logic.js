(function attachPokerMathLogic(root) {
  const ANSWER_TOLERANCE = 1;

  const DIFFICULTIES = {
    easy: {
      pots: [40, 60, 80, 100, 120, 160, 200],
      betFractions: [0.25, 0.5, 0.75, 1],
      scenarioIds: ["turn-flush", "turn-straight"],
    },
    standard: {
      pots: [30, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250],
      betFractions: [0.25, 1 / 3, 0.4, 0.5, 2 / 3, 0.75, 1, 1.25],
      scenarioIds: ["flop-flush", "flop-straight", "turn-gutshot"],
    },
    hard: {
      pots: [37, 46, 58, 73, 86, 95, 113, 127, 145, 178, 225],
      betFractions: [0.28, 0.37, 0.43, 0.58, 0.68, 0.82, 0.93, 1.17, 1.38],
      scenarioIds: ["flop-combo-one", "flop-combo-two", "turn-combo"],
    },
  };

  const EQUITY_SCENARIOS = {
    "turn-flush": {
      street: "Turn",
      hero: ["Ah", "Kh"],
      board: ["Qh", "7h", "2c", "4s"],
      drawName: "Nut flush draw",
      outs: 9,
      explanation: "Nine hearts remain to complete your flush, with one card to come.",
    },
    "turn-straight": {
      street: "Turn",
      hero: ["8c", "7c"],
      board: ["6d", "9s", "Kh", "2d"],
      drawName: "Open-ended straight draw",
      outs: 8,
      explanation: "Any ten or five completes your straight: eight clean outs.",
    },
    "flop-flush": {
      street: "Flop",
      hero: ["Kc", "Qc"],
      board: ["Jc", "4c", "2d"],
      drawName: "King-high flush draw",
      outs: 9,
      explanation: "Nine clubs remain, and you have two chances to hit by the river.",
    },
    "flop-straight": {
      street: "Flop",
      hero: ["Ks", "Qd"],
      board: ["Jh", "Tc", "3s"],
      drawName: "Open-ended straight draw",
      outs: 8,
      explanation: "Any ace or nine completes your straight: eight clean outs with two cards to come.",
    },
    "turn-gutshot": {
      street: "Turn",
      hero: ["9d", "8s"],
      board: ["Qh", "Jc", "2s", "4d"],
      drawName: "Gutshot straight draw",
      outs: 4,
      explanation: "Only a ten completes your straight, leaving four clean outs with one card to come.",
    },
    "flop-combo-one": {
      street: "Flop",
      hero: ["9h", "8h"],
      board: ["Th", "7c", "2h"],
      drawName: "Straight and flush combo draw",
      outs: 15,
      explanation: "Nine hearts plus six non-heart sixes or jacks give you 15 unique outs.",
    },
    "flop-combo-two": {
      street: "Flop",
      hero: ["6s", "5s"],
      board: ["8s", "7d", "2s"],
      drawName: "Straight and flush combo draw",
      outs: 15,
      explanation: "Nine spades plus six non-spade fours or nines give you 15 unique outs.",
    },
    "turn-combo": {
      street: "Turn",
      hero: ["Qh", "Jh"],
      board: ["Th", "9c", "2h", "3s"],
      drawName: "Straight and flush combo draw",
      outs: 15,
      explanation: "Nine hearts plus six non-heart kings or eights give you 15 unique outs.",
    },
  };

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
    const pot = config.pots[Math.floor(random() * config.pots.length)];
    const fraction = config.betFractions[Math.floor(random() * config.betFractions.length)];
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
    const scenarioId = config.scenarioIds[Math.floor(random() * config.scenarioIds.length)];
    const scenario = EQUITY_SCENARIOS[scenarioId];
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

  function parseCard(card) {
    const suitNames = { h: "hearts", d: "diamonds", c: "clubs", s: "spades" };
    const suitSymbols = { h: "♥", d: "♦", c: "♣", s: "♠" };
    const suit = card.slice(-1);
    return {
      rank: card.slice(0, -1),
      suit,
      suitName: suitNames[suit],
      suitSymbol: suitSymbols[suit],
      isRed: suit === "h" || suit === "d",
    };
  }

  const api = {
    ANSWER_TOLERANCE,
    DIFFICULTIES,
    EQUITY_SCENARIOS,
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
