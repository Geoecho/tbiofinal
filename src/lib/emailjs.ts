/**
 * EmailJS integration for sending confirmation emails to registrants.
 * Public keys are designed to be used client-side.
 */

const EMAILJS_PUBLIC_KEY = "PgtA49dQZa3upBayO";
const EMAILJS_SERVICE_ID = "service_2v5mrvs";
const EMAILJS_TEMPLATE_ID = "template_wequ04s";

interface ConfirmationEmailParams {
  to_email: string;
  to_name: string;
  event_title: string;
  event_date: string;
  event_venue: string;
}

export async function sendConfirmationEmail(params: ConfirmationEmailParams) {
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          email: params.to_email,
          to_email: params.to_email,
          name: params.to_name,
          to_name: params.to_name,
          title: params.event_title,
          event_title: params.event_title,
          event_date: params.event_date,
          event_venue: params.event_venue,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed to send confirmation email");
    }

    return { success: true };
  } catch (error) {
    console.error("EmailJS Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
