import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || GMAIL_USER;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return res.status(500).json({ error: 'Email credentials not configured' });
  }

  try {
    const { email, attributes } = req.body;
    const attrs = attributes || {};

    const source = attrs.SOURCE || 'Website';
    const name = attrs.FIRSTNAME || 'Unknown';
    const subject = attrs.SUBJECT
      ? `New Contact: ${attrs.SUBJECT}`
      : `New ${source} submission from ${name}`;

    const rows = Object.entries(attrs)
      .filter(([, val]) => val)
      .map(([key, val]) => `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">${key}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${val}</td></tr>`)
      .join('');

    const html = `
      <div style="font-family:'Space Grotesk',Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="margin-bottom:4px;">${source}</h2>
        <p style="color:#666;margin-top:0;">From: <strong>${name}</strong> (${email})</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">${rows}</table>
        <p style="margin-top:24px;color:#999;font-size:12px;">Sent via The Big Impact website</p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"The Big Impact" <${GMAIL_USER}>`,
      to: NOTIFY_EMAIL,
      subject,
      html,
      replyTo: email,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}
