const STORAGE_KEY = "pot-odds-trainer-stats-v1";
const {
  createQuestion,
  createEquityQuestion,
  isAnswerCorrect,
  roundEquityForDisplay,
  formatMoney,
  parseCard,
} = window.PokerMathLogic;

const elements = {
  form: document.querySelector("#answer-form"),
  potOddsAnswer: document.querySelector("#pot-odds-answer"),
  potQuestionLegend: document.querySelector("#pot-question-legend"),
  outsAnswer: document.querySelector("#outs-answer"),
  handEquityAnswer: document.querySelector("#hand-equity-answer"),
  handEquityLegend: document.querySelector("#hand-equity-legend"),
  actionInputs: [...document.querySelectorAll('input[name="action"]')],
  equityQuestion: document.querySelector("#equity-question"),
  outsQuestion: document.querySelector("#outs-question"),
  actionQuestion: document.querySelector("#action-question"),
  submitButton: document.querySelector(".submit-button"),
  bet: document.querySelector("#bet-amount"),
  pot: document.querySelector("#pot-amount"),
  spotLabel: document.querySelector("#spot-label"),
  streetPill: document.querySelector("#street-pill"),
  handContext: document.querySelector("#hand-context"),
  heroCards: document.querySelector("#hero-cards"),
  boardGroup: document.querySelector("#board-group"),
  boardCards: document.querySelector("#board-cards"),
  villainGroup: document.querySelector("#villain-group"),
  villainCards: document.querySelector("#villain-cards"),
  feedback: document.querySelector("#feedback"),
  feedbackIcon: document.querySelector("#feedback-icon"),
  feedbackKicker: document.querySelector("#feedback-kicker"),
  feedbackTitle: document.querySelector("#feedback-title"),
  resultGrid: document.querySelector("#result-grid"),
  resultPotOdds: document.querySelector("#result-pot-odds"),
  resultPotStatus: document.querySelector("#result-pot-status"),
  resultHandCard: document.querySelector("#result-hand-card"),
  resultHandEquity: document.querySelector("#result-hand-equity"),
  resultHandLabel: document.querySelector("#result-hand-label"),
  resultHandStatus: document.querySelector("#result-hand-status"),
  resultOutsCard: document.querySelector("#result-outs-card"),
  resultDrawName: document.querySelector("#result-draw-name"),
  resultOuts: document.querySelector("#result-outs"),
  resultOutsStatus: document.querySelector("#result-outs-status"),
  resultActionCard: document.querySelector("#result-action-card"),
  resultAction: document.querySelector("#result-action"),
  resultActionStatus: document.querySelector("#result-action-status"),
  potCalculation: document.querySelector("#pot-calculation"),
  equityCalculation: document.querySelector("#equity-calculation"),
  decisionCalculation: document.querySelector("#decision-calculation"),
  answerHelp: document.querySelector("#answer-help"),
  next: document.querySelector("#next-question"),
  accuracy: document.querySelector("#accuracy-stat"),
  accuracyDetail: document.querySelector("#accuracy-detail"),
  streak: document.querySelector("#streak-stat"),
  best: document.querySelector("#best-stat"),
  reset: document.querySelector("#reset-stats"),
  modeButtons: [...document.querySelectorAll("[data-mode]")],
  difficultyButtons: [...document.querySelectorAll("[data-difficulty]")],
};

const state = {
  mode: "pot-odds",
  difficulty: "standard",
  question: null,
  answered: false,
  stats: loadStats(),
};

function loadStats() {
  const empty = { correct: 0, total: 0, streak: 0, best: 0 };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return empty;

    return {
      correct: Math.max(0, Number(saved.correct) || 0),
      total: Math.max(0, Number(saved.total) || 0),
      streak: Math.max(0, Number(saved.streak) || 0),
      best: Math.max(0, Number(saved.best) || 0),
    };
  } catch {
    return empty;
  }
}

function saveStats() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stats));
  } catch {
    // Practice should remain usable when storage is blocked or unavailable.
  }
}

function renderStats() {
  const { correct, total, streak, best } = state.stats;
  elements.accuracy.textContent = total ? `${Math.round((correct / total) * 100)}%` : "—";
  elements.accuracyDetail.textContent = total
    ? `${correct} of ${total} rounds perfect`
    : "No answers yet";
  elements.streak.textContent = streak;
  elements.best.textContent = best;
}

function renderCards(container, cards) {
  container.replaceChildren();

  cards.forEach((cardCode) => {
    const card = parseCard(cardCode);
    const cardElement = document.createElement("span");
    cardElement.className = `playing-card${card.isRed ? " playing-card--red" : ""}`;
    cardElement.setAttribute("aria-label", `${card.rank} of ${card.suitName}`);

    const rank = document.createElement("strong");
    rank.textContent = card.rank;
    const suit = document.createElement("span");
    suit.textContent = card.suitSymbol;
    suit.setAttribute("aria-hidden", "true");

    cardElement.append(rank, suit);
    container.append(cardElement);
  });
}

function setInputsDisabled(disabled) {
  elements.potOddsAnswer.disabled = disabled;
  elements.outsAnswer.disabled = disabled;
  elements.handEquityAnswer.disabled = disabled;
  elements.actionInputs.forEach((input) => {
    input.disabled = disabled;
  });
}

function focusInput(input) {
  input.focus({ preventScroll: true });
  input.scrollIntoView({ behavior: "smooth", block: "center" });
}

function handleNumericInputEnter(event) {
  if (event.key !== "Enter" || state.answered) return;

  const isEquityMode = state.mode === "equity";
  const isPreflop = isEquityMode && state.question.street === "Preflop";
  let nextInput = null;

  if (isEquityMode && event.currentTarget === elements.potOddsAnswer) {
    nextInput = isPreflop ? elements.handEquityAnswer : elements.outsAnswer;
  } else if (event.currentTarget === elements.outsAnswer) {
    nextInput = elements.handEquityAnswer;
  }

  if (nextInput) {
    event.preventDefault();
    focusInput(nextInput);
    return;
  }

  if (isEquityMode && event.currentTarget === elements.handEquityAnswer) {
    event.preventDefault();
    elements.actionInputs[0].focus({ preventScroll: true });
    elements.actionQuestion.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function startQuestion() {
  const isEquityMode = state.mode === "equity";
  state.question = isEquityMode
    ? createEquityQuestion(state.difficulty)
    : createQuestion(state.difficulty);
  state.answered = false;
  const isPreflop = isEquityMode && state.question.street === "Preflop";

  elements.pot.textContent = formatMoney(state.question.pot);
  elements.bet.textContent = formatMoney(state.question.bet);
  elements.spotLabel.textContent = isEquityMode ? "Equity + decision drill" : "Pot odds drill";
  elements.handContext.hidden = !isEquityMode;
  elements.streetPill.hidden = !isEquityMode;
  elements.equityQuestion.hidden = !isEquityMode;
  elements.outsQuestion.hidden = !isEquityMode || isPreflop;
  elements.actionQuestion.hidden = !isEquityMode;
  elements.resultHandCard.hidden = !isEquityMode;
  elements.resultOutsCard.hidden = !isEquityMode || isPreflop;
  elements.resultActionCard.hidden = !isEquityMode;
  elements.equityCalculation.hidden = !isEquityMode;
  elements.decisionCalculation.hidden = !isEquityMode;
  elements.resultGrid.classList.toggle("result-grid--single", !isEquityMode);
  elements.resultGrid.classList.toggle("result-grid--preflop", isPreflop);
  elements.form.classList.toggle("answer-form--single", !isEquityMode);
  elements.form.classList.toggle("answer-form--preflop", isPreflop);
  elements.potQuestionLegend.textContent = isEquityMode
    ? "1. What equity do you need to call?"
    : "What equity do you need to call?";
  elements.potOddsAnswer.enterKeyHint = isEquityMode ? "next" : "done";
  elements.handEquityLegend.textContent = isPreflop
    ? "2. What is your preflop hand equity?"
    : "3. What is your chance to hit?";
  elements.actionQuestion.querySelector("legend").textContent = isPreflop
    ? "3. What is the profitable play?"
    : "4. What is the profitable play?";
  elements.resultHandLabel.textContent = isPreflop ? "Preflop equity" : "Draw equity";
  elements.answerHelp.textContent = isPreflop
    ? "Percentage answers within 1 point count as correct."
    : "Percentage answers within 1 point count as correct; outs must be exact.";

  if (isEquityMode) {
    elements.streetPill.textContent = state.question.street;
    renderCards(elements.heroCards, state.question.hero);
    renderCards(elements.boardCards, state.question.board);
    elements.boardGroup.hidden = isPreflop;
    elements.villainGroup.hidden = !isPreflop;
    renderCards(elements.villainCards, state.question.villain || []);
  }

  elements.potOddsAnswer.value = "";
  elements.outsAnswer.value = "";
  elements.handEquityAnswer.value = "";
  elements.actionInputs.forEach((input) => {
    input.checked = false;
  });
  setInputsDisabled(false);
  elements.submitButton.textContent = isEquityMode
    ? `Check all ${isPreflop ? "three" : "four"}`
    : "Check answer";
  elements.feedback.hidden = true;
  elements.potOddsAnswer.focus();
}

function readPercentage(input, message) {
  const answer = Number.parseFloat(input.value);
  if (!Number.isFinite(answer) || answer < 0 || answer > 100) {
    input.setCustomValidity(message);
    input.reportValidity();
    return null;
  }

  input.setCustomValidity("");
  return answer;
}

function readOuts() {
  const value = elements.outsAnswer.value.trim();
  const answer = Number(value);
  if (value === "" || !Number.isInteger(answer) || answer < 0 || answer > 46) {
    elements.outsAnswer.setCustomValidity("Enter a whole number of outs between 0 and 46.");
    elements.outsAnswer.reportValidity();
    return null;
  }

  elements.outsAnswer.setCustomValidity("");
  return answer;
}

function setResultStatus(element, correct) {
  element.textContent = correct ? "Correct" : "Needs work";
  element.classList.toggle("is-correct", correct);
  element.classList.toggle("is-incorrect", !correct);
}

function recordRound(correct) {
  state.stats.total += 1;

  if (correct) {
    state.stats.correct += 1;
    state.stats.streak += 1;
    state.stats.best = Math.max(state.stats.best, state.stats.streak);
  } else {
    state.stats.streak = 0;
  }

  saveStats();
  renderStats();
}

function submitAnswer() {
  if (state.answered) {
    startQuestion();
    return;
  }

  const potAnswer = readPercentage(
    elements.potOddsAnswer,
    "Enter a required equity percentage between 0 and 100."
  );
  if (potAnswer === null) return;

  const isEquityMode = state.mode === "equity";
  const isPreflop = isEquityMode && state.question.street === "Preflop";
  let handAnswer = null;
  let outsAnswer = null;
  let selectedAction = null;

  if (isEquityMode) {
    if (!isPreflop) {
      outsAnswer = readOuts();
      if (outsAnswer === null) return;
    }

    handAnswer = readPercentage(
      elements.handEquityAnswer,
      `Enter a ${isPreflop ? "hand" : "draw"} equity percentage between 0 and 100.`
    );
    if (handAnswer === null) return;

    selectedAction = elements.actionInputs.find((input) => input.checked)?.value;
    if (!selectedAction) {
      elements.actionInputs[0].setCustomValidity("Choose call or fold.");
      elements.actionInputs[0].reportValidity();
      return;
    }
    elements.actionInputs[0].setCustomValidity("");
  }

  const requiredEquity = state.question.requiredEquity ?? state.question.equity;
  const displayedPotOdds = roundEquityForDisplay(requiredEquity);
  const potCorrect = isAnswerCorrect(
    potAnswer,
    displayedPotOdds,
    state.question.tolerance
  );

  let handCorrect = true;
  let outsCorrect = true;
  let actionCorrect = true;
  let displayedHandEquity = null;

  if (isEquityMode) {
    outsCorrect = isPreflop || outsAnswer === state.question.outs;
    displayedHandEquity = roundEquityForDisplay(state.question.handEquity);
    handCorrect = isAnswerCorrect(
      handAnswer,
      displayedHandEquity,
      state.question.tolerance
    );
    actionCorrect = selectedAction === state.question.action;
  }

  const correct = potCorrect && outsCorrect && handCorrect && actionCorrect;
  const finalPot = state.question.pot + state.question.bet * 2;
  const roundedPotOdds = displayedPotOdds.toFixed(1).replace(".0", "");

  state.answered = true;
  recordRound(correct);
  setInputsDisabled(true);
  elements.submitButton.textContent = "Next question";

  elements.feedback.classList.toggle("feedback--incorrect", !correct);
  elements.feedbackIcon.textContent = correct ? "✓" : "×";
  elements.feedbackKicker.textContent = correct ? "Perfect round" : "Review the math";
  elements.feedbackTitle.textContent = isEquityMode
    ? correct
      ? `${state.question.action === "call" ? "Call" : "Fold"} is the profitable play.`
      : "Compare the two percentages."
    : `You need ${roundedPotOdds}% equity.`;

  elements.resultPotOdds.textContent = `${roundedPotOdds}%`;
  setResultStatus(elements.resultPotStatus, potCorrect);
  elements.potCalculation.textContent =
    `Pot odds: ${formatMoney(state.question.bet)} call ÷ ${formatMoney(finalPot)} final pot = ${roundedPotOdds}% required equity.`;

  if (isEquityMode) {
    const roundedHandEquity = displayedHandEquity.toFixed(1).replace(".0", "");
    const actionLabel = state.question.action === "call" ? "Call" : "Fold";
    const comparison = state.question.handEquity >= requiredEquity ? "higher than" : "lower than";

    elements.resultHandEquity.textContent = `${roundedHandEquity}%`;
    if (!isPreflop) {
      elements.resultDrawName.textContent = state.question.drawName;
      elements.resultOuts.textContent = `${state.question.outs} outs`;
      setResultStatus(elements.resultOutsStatus, outsCorrect);
    }
    elements.resultAction.textContent = actionLabel;
    setResultStatus(elements.resultHandStatus, handCorrect);
    setResultStatus(elements.resultActionStatus, actionCorrect);

    elements.equityCalculation.textContent = isPreflop
      ? `Preflop equity: ${roundedHandEquity}%. ${state.question.explanation}`
      : state.question.cardsToCome === 1
        ? `Draw equity: ${state.question.outs} outs ÷ 46 unseen cards = ${roundedHandEquity}%. ${state.question.explanation}`
        : `Draw equity: 1 − ((47 − ${state.question.outs}) ÷ 47 × (46 − ${state.question.outs}) ÷ 46) = ${roundedHandEquity}%. ${state.question.explanation}`;
    elements.decisionCalculation.textContent =
      `Decision: ${roundedHandEquity}% ${isPreflop ? "hand" : "draw"} equity is ${comparison} ${roundedPotOdds}% required equity, so ${actionLabel.toLowerCase()}.`;
  }

  elements.feedback.hidden = false;
  elements.next.focus();
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitAnswer();
});

elements.next.addEventListener("click", startQuestion);

[elements.potOddsAnswer, elements.outsAnswer, elements.handEquityAnswer].forEach((input) => {
  input.addEventListener("input", () => {
    input.setCustomValidity("");
  });
  input.addEventListener("keydown", handleNumericInputEnter);
  input.addEventListener("focus", () => input.select());
});

elements.actionInputs.forEach((input) => {
  input.addEventListener("change", () => {
    elements.actionInputs[0].setCustomValidity("");
  });
});

elements.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    elements.modeButtons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    startQuestion();
  });
});

elements.difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.difficulty = button.dataset.difficulty;
    elements.difficultyButtons.forEach((candidate) => {
      candidate.classList.toggle("is-active", candidate === button);
    });
    startQuestion();
  });
});

elements.reset.addEventListener("click", () => {
  state.stats = { correct: 0, total: 0, streak: 0, best: 0 };
  saveStats();
  renderStats();
});

elements.modeButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
});

renderStats();
startQuestion();
