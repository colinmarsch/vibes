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


## Analytics setup

This site now includes Google Analytics 4 instrumentation for page views and basic usage events (filters, search, view toggle, outbound source clicks, and submission flow).

1. Open both `seattle-run-club-shuffle/index.html` and `seattle-run-club-shuffle/submit.html`.
2. Set `<meta name="ga-measurement-id" content="G-XXXXXXXXXX" />` to your GA4 Measurement ID.
3. Deploy the site.

Once configured, GA4 will capture:
- `page_view`
- `filter_day`
- `filter_focus`
- `search`
- `set_view`
- `open_club_source`
- `navigate_to_submit`
- `submit_form_started`
- `schedule_submitted`
