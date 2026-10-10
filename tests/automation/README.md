# Automation Testing Notes

Playwright browser automation is best verified by actually running it against
a live backend (it is an integration script, not a unit-testable module in
the traditional sense). Manual acceptance procedure:

1. `cd backend && npm run dev`
2. `cd automation && python scraper.py`
3. Confirm terminal output shows: PLAYWRIGHT -> INGESTION -> SUCCESS -> MATCH ENGINE -> RISK ENGINE -> ACTION ENGINE -> SSE
4. Confirm `GET http://localhost:4000/api/alerts` includes the new RASFF-2026-4102 alert.
5. Re-run `python scraper.py` a second time and confirm the API returns `"duplicate": true`
   instead of creating a second impact assessment (AC: duplicate detection).

If you want an automated (non-visual) check of the extraction logic itself,
add a small pytest that loads `mock_regulatory_portal.html` with
BeautifulSoup/lxml and asserts the `data-new="true"` card's attributes match
the expected hero-scenario values — intentionally left out of this PoC to
keep the automation layer lightweight, per docs/business-rules.md ("what we
would not add yet").
