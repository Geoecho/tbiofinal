/**
 * Vercel serverless function — sends an event-registration confirmation
 * email to the attendee via Resend (https://resend.com) free tier.
 *
 * No npm dependencies: uses the built-in fetch + Resend REST API.
 *
 * Required env var (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY      Your Resend API key (re_...)
 * Optional env vars:
 *   RESEND_FROM_EMAIL   e.g. "The Big Impact <events@thebigimpact.mk>"
 *                       Must be on a domain verified in Resend. If unset,
 *                       falls back to Resend's onboarding sender (test only).
 *   RESEND_REPLY_TO     Reply-to address shown to the attendee.
 */

const escapeHtml = (value) =>
  String(value == null ? "" : value).replace(/[<>&"]/g, (ch) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[ch])
  );

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Email service is not configured." });
  }

  try {
    const { name, email, eventTitle, eventDate, eventVenue } = req.body || {};

    const validEmail =
      typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail || !name || !eventTitle) {
      return res.status(400).json({ error: "Missing or invalid fields." });
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "The Big Impact <onboarding@resend.dev>";

    const safeName = escapeHtml(name);
    const safeTitle = escapeHtml(eventTitle);
    const safeDate = escapeHtml(eventDate);
    const safeVenue = escapeHtml(eventVenue);

    const html = `
  <div style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e4e4e7;">
          <tr><td style="height:6px;background:#16a34a;"></td></tr>
          <tr><td style="padding:32px 32px 8px;">
            <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#16a34a;">You're registered</p>
            <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2;color:#18181b;">${safeTitle}</h1>
          </td></tr>
          <tr><td style="padding:16px 32px 0;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">
              Hi ${safeName}, your spot is confirmed. We can't wait to see you there!
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7;border-radius:4px;margin:8px 0 24px;">
              <tr><td style="padding:14px 16px;border-bottom:1px solid #f4f4f5;font-size:14px;color:#3f3f46;"><strong style="color:#18181b;">Event</strong>&nbsp;&nbsp;${safeTitle}</td></tr>
              <tr><td style="padding:14px 16px;border-bottom:1px solid #f4f4f5;font-size:14px;color:#3f3f46;"><strong style="color:#18181b;">Date</strong>&nbsp;&nbsp;${safeDate || "TBA"}</td></tr>
              <tr><td style="padding:14px 16px;font-size:14px;color:#3f3f46;"><strong style="color:#18181b;">Venue</strong>&nbsp;&nbsp;${safeVenue || "TBA"}</td></tr>
            </table>
            <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#71717a;">
              Entry is free with limited seats. If you can no longer attend, simply reply to this email so we can free up your spot.
            </p>
          </td></tr>
          <tr><td style="padding:24px 32px 32px;border-top:1px solid #f4f4f5;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#a1a1aa;">The Big Impact Organisation</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;

    const payload = {
      from: fromEmail,
      to: [email],
      subject: `You're registered: ${eventTitle}`,
      html,
    };
    if (process.env.RESEND_REPLY_TO) payload.reply_to = process.env.RESEND_REPLY_TO;

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error("Resend API error:", resp.status, detail);
      return res.status(502).json({ error: "Failed to send confirmation email." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("send-confirmation error:", err);
    return res.status(500).json({ error: "Internal error." });
  }
}
