const test = require("node:test");
const assert = require("node:assert/strict");
const {
  calculateRequiredEquity,
  createQuestion,
  isAnswerCorrect,
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

test("creates deterministic valid questions", () => {
  const question = createQuestion("easy", () => 0);
  assert.equal(question.pot, 40);
  assert.equal(question.bet, 10);
  assert.ok(Math.abs(question.equity - 100 / 6) < 1e-10);
  assert.equal(question.tolerance, 1);
});
