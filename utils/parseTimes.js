function toMinutes(hhmm = "00:00") {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  if ([h, m].some(isNaN) || h < 0 || h > 23 || m < 0 || m > 59) {
    throw new Error("Invalid time");
  }
  return h * 60 + m;
}
module.exports = { toMinutes };
