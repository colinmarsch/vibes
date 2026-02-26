# Seattle Run Clubs (Static Site)

Static website directory for listing Seattle-area run clubs and weekly schedules.

## Local preview

```bash
python -m http.server 4173
# open http://localhost:4173/seattle-run-club-shuffle/
```

## Google Analytics

This site includes Google Analytics (GA4) via the global site tag on `index.html`, `submit.html`, and `report.html`.

Before deploying, replace `G-REPLACE_WITH_MEASUREMENT_ID` in all three files with your GA4 Measurement ID (for example, `G-ABC123XYZ9`).

## GitHub Pages deployment

This repo includes `.github/workflows/deploy-seattle-run-club-shuffle.yml` which deploys this directory to GitHub Pages on push to `main`.

In repository settings, ensure:
- **Pages** source is set to **GitHub Actions**.
