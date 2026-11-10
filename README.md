# Trace the roads (SSTA Workshop 3)

Participants trace roads on a Sentinel-2 image and on a super-resolved image of two Metro Manila neighbourhoods, then see how many roads they found.
The presenter page shows everyone's results live.

- Participant page: `index.html`
- Presenter page: `results.html` (shows demo data until the results link is set)
- Add `?s=<name>` to both links to keep sessions apart, e.g. `?s=rehearsal`. The default session is `workshop`.

## Collecting results (Google Sheet, about 5 minutes)

1. Create a new Google Sheet.
2. Open Extensions > Apps Script, replace the code with `apps_script.gs`, and save.
3. Open Deploy > New deployment > type "Web app". Set Execute as: Me, Who has access: Anyone, then Deploy and authorise.
4. Paste the web-app URL (it ends in `/exec`) into `config.js` as `ENDPOINT`.

Only line coordinates, scores, a random device id and the time are stored. No names or e-mail addresses.

Credits: roads © OpenStreetMap contributors. Real images: Google satellite imagery, averaged to 2.5 m. Contains modified Copernicus Sentinel data 2025.
