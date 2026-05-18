/**
 * Form submission service using Web3Forms (client-side).
 * Web3Forms access keys are designed to be used in the browser.
 */

const WEB3FORMS_KEY = "d03002a6-ba1d-492a-98b3-487dab111d6c";

export interface ContactFormParams {
  email: string;
  subject?: string;
  message?: string;
  name?: string;
  source?: string;
  [key: string]: any;
}

export async function submitToFormSubmit(params: ContactFormParams) {
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: params.subject || `New submission from ${params.name || params.email}`,
        from_name: "The Big Impact Website",
        botcheck: "",
        ...params,
      }),
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
