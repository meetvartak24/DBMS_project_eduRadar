export const points = (n) =>
  n >= 90 ? 10 : n >= 80 ? 9 : n >= 70 ? 8 : n >= 60 ? 7 : n >= 50 ? 6 : n >= 40 ? 5 : 0;
export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
export const gpa = (rs) =>
  rs.length
    ? (
        rs.reduce((a, r) => a + points(Number(r.mse) + Number(r.ese)) * r.credits, 0) /
        rs.reduce((a, r) => a + r.credits, 0)
      ).toFixed(2)
    : '—';
