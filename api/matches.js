export default async function handler(req, res) {
  const { tab } = req.query;

  const today = new Date().toISOString().split("T")[0];
  const shift = (d, days) => {
    const dt = new Date(d);
    dt.setDate(dt.getDate() + days);
    return dt.toISOString().split("T")[0];
  };

  const endpoints = {
    live:     "matches?status=LIVE",
    today:    "matches?dateFrom=" + today + "&dateTo=" + today,
    upcoming: "matches?dateFrom=" + today + "&dateTo=" + shift(today, 7),
    results:  "matches?dateFrom=" + shift(today, -7) + "&dateTo=" + today + "&status=FINISHED",
  };

  const url = "https://api.football-data.org/v4/" + (endpoints[tab] || endpoints.live);

  try {
    const response = await fetch(url, {
      headers: { "X-Auth-Token": "cd387d0f3bcb44268a14bda3cc1f0b95" }
    });
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
