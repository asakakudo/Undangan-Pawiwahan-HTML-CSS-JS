export default async function handler(req, res) {
  const targetUrl = "https://script.google.com/macros/s/AKfycbxdgCu2KBJVvL6Hc1n8affHs9CsXp9uoLzPeNTzEBIdykEP2f9W6vcj0aqc4SnEBdyRHw/exec";

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined
    });

    const text = await response.text();
    console.log("Proxy response:", text); // 🔎 log isi respons

    try {
      const json = JSON.parse(text);
      res.status(200).json(json);
    } catch (err) {
      // kalau gagal parse, kirim text apa adanya
      res.status(200).send(text);
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
}
