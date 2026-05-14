/**
 * Contact form service using FormSubmit.co
 */

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
    const FORM_SUBMIT_EMAIL = "supermarket.netaville@gmail.com";
    
    // Prepare data for FormSubmit.co
    const formData = new FormData();
    
    // FormSubmit specific options
    formData.append("_subject", params.subject || `New submission from ${params.name || params.email}`);
    formData.append("_replyto", params.email);
    formData.append("_template", "table");
    formData.append("_captcha", "false");

    // Add all other params as form fields
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(`https://formsubmit.co/ajax/${FORM_SUBMIT_EMAIL}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to send message");
    }

    return { success: true };
  } catch (error) {
    console.error("Submission Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

