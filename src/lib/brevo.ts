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
  return new Promise<{ success: boolean; error?: string }>((resolve) => {
    try {
      const FORM_SUBMIT_EMAIL = "supermarket.netaville@gmail.com";
      
      // Create a hidden form element
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `https://formsubmit.co/${FORM_SUBMIT_EMAIL}`;
      form.style.display = "none";

      // FormSubmit specific options
      const options = {
        "_subject": params.subject || `New submission from ${params.name || params.email}`,
        "_replyto": params.email,
        "_template": "table",
        "_captcha": "false",
        // Redirect back to current page or a success page if you want
        "_next": window.location.href
      };

      // Add all options and params as input fields
      const allFields = { ...options, ...params };
      
      Object.entries(allFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
      
      // Since form.submit() triggers a page reload/redirect, 
      // we resolve immediately so the UI can show success or handle state
      resolve({ success: true });
    } catch (error) {
      console.error("Submission Error:", error);
      resolve({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
}

