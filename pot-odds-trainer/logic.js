(function attachPotOddsLogic(root) {
  const DIFFICULTIES = {
    easy: {
      pots: [40, 60, 80, 100, 120, 160, 200],
      betFractions: [0.25, 0.5, 0.75, 1],
      tolerance: 1,
    },
    standard: {
      pots: [30, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250],
      betFractions: [0.25, 1 / 3, 0.4, 0.5, 2 / 3, 0.75, 1, 1.25],
      tolerance: 1,
    },
    hard: {
      pots: [37, 46, 58, 73, 86, 95, 113, 127, 145, 178, 225],
      betFractions: [0.28, 0.37, 0.43, 0.58, 0.68, 0.82, 0.93, 1.17, 1.38],
      tolerance: 1,
    },
  };

  function calculateRequiredEquity(pot, bet) {
    return (bet / (pot + bet + bet)) * 100;
  }

  function createQuestion(difficulty = "standard", random = Math.random) {
    const config = DIFFICULTIES[difficulty] || DIFFICULTIES.standard;
    const pot = config.pots[Math.floor(random() * config.pots.length)];
    const fraction = config.betFractions[Math.floor(random() * config.betFractions.length)];
    const rounding = difficulty === "hard" ? 1 : 5;
    const bet = Math.max(rounding, Math.round((pot * fraction) / rounding) * rounding);

    return {
      pot,
      bet,
      equity: calculateRequiredEquity(pot, bet),
      tolerance: config.tolerance,
    };
  }

  function isAnswerCorrect(answer, equity, tolerance) {
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

  const api = {
    DIFFICULTIES,
    calculateRequiredEquity,
    createQuestion,
    isAnswerCorrect,
    roundEquityForDisplay,
    formatMoney,
  };

  root.PotOddsLogic = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
