import https from "https";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY;

  if (!WEB3FORMS_KEY) {
    console.error("WEB3FORMS_KEY is missing");
    return res.status(500).json({ success: false, error: "Server misconfigured" });
  }

  try {
    const body = req.body;

    const payload = JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: body.subject || `New submission from ${body.name || body.email}`,
      from_name: "The Big Impact Website",
      ...body,
    });

    const data = await new Promise((resolve, reject) => {
      const request = https.request(
        {
          hostname: "api.web3forms.com",
          path: "/submit",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Content-Length": Buffer.byteLength(payload),
          },
        },
        (response) => {
          let body = "";
          response.on("data", (chunk) => (body += chunk));
          response.on("end", () => {
            try {
              resolve(JSON.parse(body));
            } catch {
              reject(new Error("Invalid response from Web3Forms"));
            }
          });
        }
      );
      request.on("error", reject);
      request.write(payload);
      request.end();
    });

    if (!data.success) {
      return res.status(400).json({ success: false, error: data.message });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact API Error:", error);
    return res.status(500).json({ success: false, error: "Failed to send message" });
  }
}
