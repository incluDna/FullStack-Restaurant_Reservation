function toMinutes(hhmm = "00:00") {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  if ([h, m].some(isNaN) || h < 0 || h > 23 || m < 0 || m > 59) {
    const err = new Error(
      "Invalid time format, expected HH:MM between 00:00–23:59",
    );
    err.statusCode = 400;
    throw err;
  }
  return h * 60 + m;
}
module.exports = { toMinutes };
