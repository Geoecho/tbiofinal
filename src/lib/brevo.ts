/**
 * Contact form service.
 * Calls the /api/contact serverless function which sends email via Nodemailer.
 */

export interface ContactFormParams {
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
}

export async function createBrevoContact(params: ContactFormParams) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        attributes: params.attributes,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send message");
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Contact Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
