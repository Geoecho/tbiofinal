/**
 * Confirmation email stub.
 * EmailJS integration removed — not in use.
 */

interface ConfirmationEmailParams {
  to_email: string;
  to_name: string;
  event_title: string;
  event_date: string;
  event_venue: string;
}

export async function sendConfirmationEmail(_params: ConfirmationEmailParams) {
  // No-op: EmailJS template IDs removed
  return { success: true };
}
