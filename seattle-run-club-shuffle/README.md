# Seattle Run Clubs (Static Site)

Static website directory for listing Seattle-area run clubs and weekly schedules.

## Local preview

```bash
python -m http.server 4173
# open http://localhost:4173/seattle-run-club-shuffle/
```

## GitHub Pages deployment

This repo includes `.github/workflows/deploy-seattle-run-club-shuffle.yml` which deploys this directory to GitHub Pages on push to `main`.

In repository settings, ensure:
- **Pages** source is set to **GitHub Actions**.
