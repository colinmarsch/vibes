const STORAGE_KEY = "pot-odds-trainer-stats-v1";
const { DIFFICULTIES, createQuestion, isAnswerCorrect, formatMoney } = window.PotOddsLogic;

const elements = {
  form: document.querySelector("#answer-form"),
  answer: document.querySelector("#answer"),
  bet: document.querySelector("#bet-amount"),
  pot: document.querySelector("#pot-amount"),
  feedback: document.querySelector("#feedback"),
  feedbackIcon: document.querySelector("#feedback-icon"),
  feedbackKicker: document.querySelector("#feedback-kicker"),
  feedbackTitle: document.querySelector("#feedback-title"),
  feedbackExplanation: document.querySelector("#feedback-explanation"),
  calcCall: document.querySelector("#calc-call"),
  calcFinalPot: document.querySelector("#calc-final-pot"),
  calcEquity: document.querySelector("#calc-equity"),
  next: document.querySelector("#next-question"),
  accuracy: document.querySelector("#accuracy-stat"),
  accuracyDetail: document.querySelector("#accuracy-detail"),
  streak: document.querySelector("#streak-stat"),
  best: document.querySelector("#best-stat"),
  reset: document.querySelector("#reset-stats"),
  tolerance: document.querySelector("#tolerance-copy"),
  difficultyButtons: [...document.querySelectorAll("[data-difficulty]")],
};

const state = {
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stats));
}

function renderStats() {
  const { correct, total, streak, best } = state.stats;
  elements.accuracy.textContent = total ? `${Math.round((correct / total) * 100)}%` : "—";
  elements.accuracyDetail.textContent = total
    ? `${correct} of ${total} correct`
    : "No answers yet";
  elements.streak.textContent = streak;
  elements.best.textContent = best;
}

function startQuestion() {
  state.question = createQuestion(state.difficulty);
  state.answered = false;

  elements.pot.textContent = formatMoney(state.question.pot);
  elements.bet.textContent = formatMoney(state.question.bet);
  elements.tolerance.textContent = state.question.tolerance.toFixed(1);
  elements.answer.value = "";
  elements.answer.disabled = false;
  elements.feedback.hidden = true;
  elements.form.querySelector("button").disabled = false;
  elements.answer.focus();
}

function submitAnswer() {
  if (state.answered) {
    startQuestion();
    return;
  }

  const answer = Number.parseFloat(elements.answer.value);
  if (!Number.isFinite(answer) || answer < 0 || answer > 100) {
    elements.answer.setCustomValidity("Enter a percentage between 0 and 100.");
    elements.answer.reportValidity();
    return;
  }

  elements.answer.setCustomValidity("");
  const { pot, bet, equity, tolerance } = state.question;
  const correct = isAnswerCorrect(answer, equity, tolerance);
  const finalPot = pot + bet + bet;
  const roundedEquity = equity.toFixed(1).replace(".0", "");

  state.answered = true;
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

  elements.answer.disabled = true;
  elements.form.querySelector("button").disabled = true;
  elements.feedback.classList.toggle("feedback--incorrect", !correct);
  elements.feedbackIcon.textContent = correct ? "✓" : "×";
  elements.feedbackKicker.textContent = correct ? "Correct" : "Not quite";
  elements.feedbackTitle.textContent = `You need ${roundedEquity}% equity.`;
  elements.calcCall.textContent = formatMoney(bet);
  elements.calcFinalPot.textContent = formatMoney(finalPot);
  elements.calcEquity.textContent = `${roundedEquity}%`;
  elements.feedbackExplanation.textContent = `${formatMoney(pot)} in the pot + ${formatMoney(
    bet
  )} bet + your ${formatMoney(bet)} call = ${formatMoney(finalPot)}. Your call is ${roundedEquity}% of that final pot.`;
  elements.feedback.hidden = false;
  elements.next.focus();
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitAnswer();
});

elements.next.addEventListener("click", startQuestion);

elements.answer.addEventListener("input", () => {
  elements.answer.setCustomValidity("");
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && state.answered) {
    event.preventDefault();
    startQuestion();
  }
});

renderStats();
startQuestion();
