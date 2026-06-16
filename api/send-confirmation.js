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
  <div style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0a0a0a;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f4f4f5;">You're in! Your spot for ${safeTitle} is confirmed.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;background:#ffffff;border:1px solid #e4e4e7;">
          <tr><td style="height:6px;background:#e73e4c;line-height:6px;font-size:0;">&nbsp;</td></tr>

          <tr><td style="padding:30px 36px 0;">
            <p style="margin:0;font-size:12px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#0a0a0a;">The&nbsp;Big&nbsp;Impact</p>
          </td></tr>

          <tr><td style="padding:26px 36px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="width:46px;height:46px;background:#e73e4c;text-align:center;vertical-align:middle;font-size:24px;line-height:46px;color:#ffffff;">&#10003;</td>
            </tr></table>
            <p style="margin:22px 0 0;font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e73e4c;">Registration confirmed</p>
            <h1 style="margin:6px 0 0;font-size:42px;line-height:1;font-weight:800;letter-spacing:-1px;text-transform:uppercase;color:#0a0a0a;">You're in!</h1>
          </td></tr>

          <tr><td style="padding:20px 36px 0;">
            <p style="margin:0;font-size:16px;line-height:1.6;color:#3f3f46;">
              Hi ${safeName}, your spot for <strong style="color:#0a0a0a;">${safeTitle}</strong> is locked in. We can't wait to see you there.
            </p>
          </td></tr>

          <tr><td style="padding:24px 36px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7;border-left:3px solid #e73e4c;">
              <tr><td style="padding:16px 20px;border-bottom:1px solid #f0f0f0;">
                <p style="margin:0 0 3px;font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#9a9a9a;">Event</p>
                <p style="margin:0;font-size:15px;font-weight:700;color:#0a0a0a;">${safeTitle}</p>
              </td></tr>
              <tr><td style="padding:16px 20px;border-bottom:1px solid #f0f0f0;">
                <p style="margin:0 0 3px;font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#9a9a9a;">Date</p>
                <p style="margin:0;font-size:15px;font-weight:700;color:#0a0a0a;">${safeDate || "To be announced"}</p>
              </td></tr>
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 3px;font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#9a9a9a;">Venue</p>
                <p style="margin:0;font-size:15px;font-weight:700;color:#0a0a0a;">${safeVenue || "To be announced"}</p>
              </td></tr>
            </table>
          </td></tr>

          <tr><td style="padding:24px 36px 0;">
            <p style="margin:0;font-size:13px;line-height:1.7;color:#71717a;">
              Entry is free with limited seats. If your plans change, just reply to this email so we can offer your spot to someone else.
            </p>
          </td></tr>

          <tr><td style="padding:28px 36px 0;"><div style="height:1px;background:#e4e4e7;font-size:0;line-height:0;">&nbsp;</div></td></tr>

          <tr><td style="padding:18px 36px 32px;">
            <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">The Big Impact Organisation</p>
            <p style="margin:7px 0 0;font-size:11px;line-height:1.6;color:#c4c4c4;">Empowering young people through mentorship, storytelling &amp; community.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;

    const text = [
      "YOU'RE IN!",
      "",
      `Hi ${name}, your spot for ${eventTitle} is confirmed. We can't wait to see you there.`,
      "",
      `Event:  ${eventTitle}`,
      `Date:   ${eventDate || "To be announced"}`,
      `Venue:  ${eventVenue || "To be announced"}`,
      "",
      "Entry is free with limited seats. If your plans change, just reply to this email so we can offer your spot to someone else.",
      "",
      "— The Big Impact Organisation",
    ].join("\n");

    const payload = {
      from: fromEmail,
      to: [email],
      subject: `You're in! ${eventTitle}`,
      html,
      text,
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
