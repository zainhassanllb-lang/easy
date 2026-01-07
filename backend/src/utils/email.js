const { Resend } = require("resend");

/**
 * Sends an email using the Resend service.
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message
 * @param {string} [options.html] - Optional HTML content
 */
const sendEmail = async (options) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    console.error("[EMAIL] Missing RESEND_API_KEY in environment variables");
    throw new Error("Email service is not configured (missing API key)");
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [options.email],
      subject: options.subject,
      text: options.message,
      html: options.html || undefined,
    });

    if (error) {
      console.error("[RESEND ERROR]", error);
      throw new Error(error.message || "Failed to send email via Resend");
    }

    return data;
  } catch (err) {
    console.error("[EMAIL ERROR]", err.message);
    throw err;
  }
};

module.exports = sendEmail;
