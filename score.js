// Shared by the tracing page and the results page. 600-px canvas = 500 m, so 1.2 px per m.
const TOL = 14.4, STEP = 3;   // a road counts as found when a line runs within 12 m of it
function densify(pts) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    if (i === 0) { out.push(pts[0]); continue; }
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / STEP));
    for (let k = 1; k <= n; k++) out.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
  }
  return out;
}
const inside = p => p[0] >= 0 && p[0] <= 600 && p[1] >= 0 && p[1] <= 600;
function grid(points) {
  const g = new Map();
  for (const p of points) { const k = `${Math.floor(p[0] / TOL)},${Math.floor(p[1] / TOL)}`; (g.get(k) || g.set(k, []).get(k)).push(p); }
  return g;
}
function near(g, p) {
  const cx = Math.floor(p[0] / TOL), cy = Math.floor(p[1] / TOL);
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++)
    for (const q of g.get(`${cx + dx},${cy + dy}`) || []) if (Math.hypot(p[0] - q[0], p[1] - q[1]) <= TOL) return true;
  return false;
}
function evaluate(area, strokes) {
  const user = strokes.flatMap(densify).filter(inside), ug = grid(user);
  const rg = grid(AREAS[area].roads.flatMap(r => densify(r.p)).filter(inside));
  let tot = 0, hit = 0; const segs = [];
  for (const r of AREAS[area].roads) {
    const d = densify(r.p);
    for (let i = 1; i < d.length; i++) {
      const m = [(d[i - 1][0] + d[i][0]) / 2, (d[i - 1][1] + d[i][1]) / 2];
      if (!inside(m)) continue;
      const ok = near(ug, m);
      segs.push([d[i - 1], d[i], ok, r.m]);
      if (r.m) { tot += 1; if (ok) hit += 1; }
    }
  }
  const onRoad = user.filter(p => near(rg, p)).length;
  return { recall: tot ? hit / tot : 0, precision: user.length ? onRoad / user.length : null, segs };
}
function polyline(c, pts, color, w) {
  if (!pts.length) return;
  c.strokeStyle = color; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) c.lineTo(p[0], p[1]);
  if (pts.length === 1) c.lineTo(pts[0][0] + .1, pts[0][1]);
  c.stroke();
}
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const pct = x => `${Math.round(100 * x)}%`;
