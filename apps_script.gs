/**
 * Results store for "Trace the roads" (SSTA Workshop 3).
 * Set-up: open a new Google Sheet > Extensions > Apps Script, replace the code with this file, Save,
 * then Deploy > New deployment > type "Web app", Execute as: Me, Who has access: Anyone > Deploy.
 * Copy the web-app URL (ends in /exec) into config.js (ENDPOINT).
 * Each finished tracing adds one row: time, session, device id, attempt, lines and scores (JSON).
 * No names or e-mail addresses are collected.
 */
const SHEET = "results";

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(["time", "session", "device", "attempt", "plan"]); }
  return sh;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const plan = JSON.stringify(d.plan || []);
    if (plan.length > 45000) return ContentService.createTextOutput("too large");
    sheet_().appendRow([new Date(), String(d.session || "").slice(0, 40), String(d.id || "").slice(0, 20), Number(d.attempt) || 1, plan]);
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const session = (e.parameter.session || "workshop").slice(0, 40);
  const rows = sheet_().getDataRange().getValues().slice(1)
    .filter(r => r[1] === session)
    .map(r => { let plan = []; try { plan = JSON.parse(r[4]); } catch (err) {} return { t: r[0], id: r[2], attempt: r[3], plan: plan }; });
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}
