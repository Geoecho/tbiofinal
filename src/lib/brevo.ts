/**
 * Form submission service using Web3Forms.
 * Get your free access key at https://web3forms.com/#start
 * Enter your email (supermarket.netaville@gmail.com), confirm it,
 * then paste the key below.
 */

// ⚠️ PASTE YOUR WEB3FORMS ACCESS KEY HERE
const WEB3FORMS_KEY = "YOUR_ACCESS_KEY_HERE";

export interface ContactFormParams {
  email: string;
  subject?: string;
  message?: string;
  name?: string;
  role?: string;
  notes?: string;
  source?: string;
  [key: string]: any;
}

export async function submitToFormSubmit(params: ContactFormParams) {
  try {
    const payload: Record<string, string> = {
      access_key: WEB3FORMS_KEY,
      subject: params.subject || `New submission from ${params.name || params.email}`,
      from_name: "The Big Impact Website",
    };

    // Add all params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload[key] = value.toString();
      }
    });

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to send message");
    }

    return { success: true };
  } catch (error) {
    console.error("Submission Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
