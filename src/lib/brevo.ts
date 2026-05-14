/**
 * Form submission service.
 * Posts to /api/contact — configure in your Vercel API route.
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
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server error: " + text.slice(0, 100));
    }

    if (!response.ok || !data.success) {
      throw new Error(data.error || data.message || "Failed to send message");
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
