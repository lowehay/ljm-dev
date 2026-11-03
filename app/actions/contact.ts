"use server";

import { site } from "../site";

export type ContactState = {
  status: "idle" | "sent" | "error";
  message: string;
  // Sent back on errors so the form can refill what the visitor typed
  values?: { name: string; email: string; message: string };
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Emails a message from the contact form to site.email through Resend (https://resend.com).
// Needs RESEND_API_KEY. Until the sending domain is verified in Resend, the default sender only
// delivers to the address the Resend account was created with, so sign up with site.email.
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Hidden field that people never see; bots that fill every input get a fake success
  if (formData.get("website")) return { status: "sent", message: "Thanks! I'll get back to you soon." };

  if (!values.name || values.name.length > 100) {
    return { status: "error", message: "Please enter your name.", values };
  }
  if (!EMAIL_PATTERN.test(values.email) || values.email.length > 200) {
    return { status: "error", message: "Please enter a valid email so I can reply.", values };
  }
  if (values.message.length < 10 || values.message.length > 5000) {
    return { status: "error", message: "Your message should be between 10 and 5,000 characters.", values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "error", message: `The form isn't set up yet. Please email ${site.email} instead.`, values };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
        to: [site.email],
        reply_to: values.email,
        // Line breaks are stripped so the name can't add lines to the subject
        subject: `Portfolio message from ${values.name.replace(/[\r\n]+/g, " ")}`,
        text: `${values.message}\n\n— ${values.name} <${values.email}>`,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  } catch (error) {
    console.error("Contact form failed to send", error);
    return { status: "error", message: `Something went wrong sending that. Please email ${site.email} instead.`, values };
  }

  return { status: "sent", message: "Thanks! Your message is on its way, and I'll get back to you soon." };
}
