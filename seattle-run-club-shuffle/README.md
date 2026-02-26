# Seattle Run Clubs (Static Site)

Static website directory for listing Seattle-area run clubs and weekly schedules.

## Local preview

```bash
python -m http.server 4173
# open http://localhost:4173/seattle-run-club-shuffle/
```

## CI checks

This repo includes `.github/workflows/check-seattle-run-club-shuffle.yml` which runs on pull requests and verifies the static site bundle can be created and key JavaScript files parse successfully.

## GitHub Pages deployment

This repo includes `.github/workflows/deploy-seattle-run-club-shuffle.yml` which deploys this directory to GitHub Pages on push to `main`.

In repository settings, ensure:
- **Pages** source is set to **GitHub Actions**.
