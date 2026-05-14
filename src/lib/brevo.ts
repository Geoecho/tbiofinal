/**
 * Brevo (formerly Sendinblue) API service
 * Using the Contact API to create/update contacts or transactional emails.
 */

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3';

export interface BrevoContactParams {
  email: string;
  attributes: {
    FIRSTNAME?: string;
    LASTNAME?: string;
    ROLE?: string;
    NOTES?: string;
    SUBJECT?: string;
    MESSAGE?: string;
    SOURCE?: string;
  };
  listIds?: number[];
  updateEnabled?: boolean;
}

export async function createBrevoContact(params: BrevoContactParams) {
  if (!BREVO_API_KEY) {
    console.warn("Brevo API key is missing. Email submission will not work.");
    return { success: false, error: "API Key missing" };
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        attributes: params.attributes,
        listIds: params.listIds || [2], // Default list ID, should be configured in Brevo
        updateEnabled: params.updateEnabled ?? true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // If contact already exists and updateEnabled is true, Brevo might still return an error depending on the endpoint
      if (response.status === 400 && errorData.code === 'duplicate_parameter') {
         return { success: true, message: "Already registered" };
      }
      throw new Error(errorData.message || "Failed to create contact");
    }

    return { success: true };
  } catch (error) {
    console.error("Brevo Error:", error);
    return { success: false, error };
  }
}

/**
 * Alternative: Send transactional email if the user prefers email notifications
 */
export async function sendBrevoEmail(params: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}) {
  if (!BREVO_API_KEY) {
    console.warn("Brevo API key is missing. Email submission will not work.");
    return { success: false, error: "API Key missing" };
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: "The Big Impact", email: "hbristik@gmail.com" },
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
        replyTo: params.replyTo,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    return { success: true };
  } catch (error) {
    console.error("Brevo SMTP Error:", error);
    return { success: false, error };
  }
}
