const NOTIFY_EMAIL = 'supermarket.netaville@gmail.com';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const BREVO_API_KEY = process.env.VITE_BREVO_API_KEY || process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    return res.status(500).json({ error: 'Brevo API key not configured' });
  }

  const headers = {
    'accept': 'application/json',
    'api-key': BREVO_API_KEY,
    'content-type': 'application/json',
  };

  try {
    const { email, attributes, listIds } = req.body;
    const attrs = attributes || {};

    // 1. Save contact to Brevo list
    const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        attributes: attrs,
        listIds: listIds || [2],
        updateEnabled: true,
      }),
    });

    if (!contactRes.ok) {
      const errorData = await contactRes.json();
      if (contactRes.status !== 400 || errorData.code !== 'duplicate_parameter') {
        return res.status(contactRes.status).json({ success: false, error: errorData.message });
      }
    }

    // 2. Send notification email to site owner
    const source = attrs.SOURCE || 'Website';
    const name = attrs.FIRSTNAME || 'Unknown';
    const subject = attrs.SUBJECT
      ? `New Contact: ${attrs.SUBJECT}`
      : `New ${source} submission from ${name}`;

    const rows = Object.entries(attrs)
      .map(([key, val]) => val ? `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">${key}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${val}</td></tr>` : '')
      .join('');

    const htmlContent = `
      <div style="font-family:'Space Grotesk',Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="margin-bottom:4px;">${source}</h2>
        <p style="color:#666;margin-top:0;">From: <strong>${name}</strong> (${email})</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          ${rows}
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px;">Sent via The Big Impact website</p>
      </div>
    `;

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sender: { name: 'The Big Impact', email: 'thebigimpactorg@gmail.com' },
        to: [{ email: NOTIFY_EMAIL }],
        subject,
        htmlContent,
        replyTo: { email, name },
      }),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Brevo API Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
