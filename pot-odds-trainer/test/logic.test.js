const test = require("node:test");
const assert = require("node:assert/strict");
const {
  calculateRequiredEquity,
  createQuestion,
  isAnswerCorrect,
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

test("creates deterministic valid questions", () => {
  const question = createQuestion("easy", () => 0);
  assert.equal(question.pot, 40);
  assert.equal(question.bet, 10);
  assert.ok(Math.abs(question.equity - 100 / 6) < 1e-10);
  assert.equal(question.tolerance, 1);
});
