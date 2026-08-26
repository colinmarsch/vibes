# Poker Math Lab

A free, no-sign-in poker training app for building fast pot-odds, draw-equity,
and call-or-fold decision skills.

## Training modes

### Pot odds

Randomized betting spots ask for the break-even equity required to call.

### Equity + decision

Card-and-board scenarios ask the player to calculate:

1. The pot odds, expressed as required equity
2. The number of clean outs, without revealing the draw type first
3. The exact chance of hitting the draw
4. Whether comparing those percentages makes a call or fold profitable

The integrated drill deliberately grades only **call** or **fold**. Choosing
whether to raise also requires assumptions about ranges and fold equity that
the displayed values do not provide.

## Difficulty

- **Easy:** round pot and bet sizes with one-card draw calculations
- **Standard:** more bet sizes and a mix of one- and two-card draws
- **Hard:** awkward bet sizes and overlapping combo-draw outs

All percentage answers use the same inclusive ±1 percentage-point tolerance.
Difficulty comes from the arithmetic and draw complexity, not looser grading.

## Formulas

When the displayed pot is `P` and the opponent bets `B`, calling costs `B`
and creates a final pot of `P + B + B`.

```text
required equity = B / (P + B + B)
```

For `O` clean outs:

```text
one card to come = O / 46
two cards to come = 1 - ((47 - O) / 47) * ((46 - O) / 46)
```

The simplified decision rule is:

```text
call when draw equity >= required equity; otherwise fold
```

## Other features

- Unlimited randomized questions across three difficulty levels
- Immediate, per-answer calculation feedback
- Round accuracy, current streak, and best streak tracking
- Device-local stats using `localStorage`
- Keyboard-friendly, accessible card labels, and responsive layouts
- No account, backend, dependencies, or paywall

## Run locally

Open `index.html` in a browser, or serve the folder with any static HTTP
server.

## Verify the logic

```bash
node --check logic.js
node --check app.js
node --test test/logic.test.js
```
