/**
 * Brevo (formerly Sendinblue) API service
 * Calls the /api/brevo-contact serverless function to avoid CORS issues.
 */

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
}

export async function createBrevoContact(params: BrevoContactParams) {
  try {
    const response = await fetch('/api/brevo-contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        attributes: params.attributes,
        listIds: params.listIds || [2],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create contact");
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Brevo Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
