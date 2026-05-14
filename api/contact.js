export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY;

  if (!WEB3FORMS_KEY) {
    return res.status(500).json({ error: "WEB3FORMS_KEY not configured" });
  }

  try {
    const body = req.body;

    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: body.subject || `New submission from ${body.name || body.email}`,
      from_name: "The Big Impact Website",
      ...body,
    };

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ success: false, error: data.message });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact API Error:", error);
    return res.status(500).json({ success: false, error: "Failed to send message" });
  }
}
