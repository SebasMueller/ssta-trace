// Where results are sent and read. Paste the Google Apps Script web-app URL here (ends in /exec).
// Empty = the page still works, but nothing is collected.
const ENDPOINT = "";
// Results are grouped by session. Use ?s=<name> in the link to keep a rehearsal apart from the workshop.
const SESSION = (new URLSearchParams(location.search).get("s") || "workshop").replace(/[^\w-]/g, "").slice(0, 40) || "workshop";
