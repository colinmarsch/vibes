# Pot Odds Trainer

A free, no-sign-in poker pot odds trainer. It generates unlimited betting spots and asks for the break-even equity required to call.

## Features

- Unlimited randomized questions across three difficulty levels
- Immediate calculation breakdown after every answer
- Accuracy, current streak, and best streak tracking
- Device-local stats using `localStorage`
- Keyboard-friendly and responsive for mobile practice
- No account, backend, dependencies, or paywall

## The calculation

When the displayed pot is `P` and the opponent bets `B`, calling costs `B` and creates a final pot of `P + B + B`.

```text
required equity = B / (P + B + B)
```

## Run locally

Open `index.html` in a browser, or serve the folder with any static HTTP server.

## Verify the logic

```bash
node --test test/logic.test.js
```
