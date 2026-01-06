// utils/sendEmail.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY in environment variables");
  }

  const from = process.env.RESEND_FROM; // must be verified domain sender
  if (!from) {
    throw new Error("Missing RESEND_FROM in environment variables");
  }

  const { data, error } = await resend.emails.send({
    from,
    to: [options.email],
    subject: options.subject,
    text: options.message,          // text version
    html: options.html || undefined // optional html
  });

  if (error) {
    throw new Error(error.message || "Resend error");
  }

  return data;
};

module.exports = sendEmail;
