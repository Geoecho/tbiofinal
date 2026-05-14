import https from 'https';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY;

  if (!WEB3FORMS_KEY) {
    console.error("WEB3FORMS_KEY is missing in environment variables");
    return res.status(500).json({ error: "WEB3FORMS_KEY not configured in Vercel" });
  }

  try {
    const body = req.body;
    console.log("Processing submission for:", body.email);

    const payload = JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: body.subject || `New submission from ${body.name || body.email}`,
      from_name: "The Big Impact Website",
      ...body,
    });

    const options = {
      hostname: 'api.web3forms.com',
      path: '/submit',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const result = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error("Invalid JSON response from Web3Forms"));
          }
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.write(payload);
      request.end();
    });

    if (!result.success) {
      console.error("Web3Forms Error:", result.message);
      return res.status(400).json({ success: false, error: result.message });
    }

    console.log("Submission successful");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact API Critical Error:", error.message);
    return res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
  }
}
