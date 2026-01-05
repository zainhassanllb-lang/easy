const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // simulate ONLY if explicitly enabled
  const simulateEmail = process.env.EMAIL_SIMULATION === "true";
  if (simulateEmail) {
    console.log("\n--- EMAIL SIMULATION ---");
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log("------------------------\n");
    return { simulated: true };
  }

  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT || 465);

  // Prefer explicit EMAIL_SECURE, fallback to port 465
  const secure =
    typeof process.env.EMAIL_SECURE === "string"
      ? process.env.EMAIL_SECURE === "true"
      : port === 465;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    // timeouts (Render can be slow, so give a bit more)
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,

    // helps some hosts
    tls: {
      rejectUnauthorized: true,
    },
  });

  // Optional: verify only when debugging
  if (process.env.EMAIL_DEBUG === "true") {
    await transporter.verify();
    console.log("SMTP verified ✅");
  }

  const mailOptions = {
    from: `Easy Support <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.messageId);
  return info;
};

module.exports = sendEmail;
