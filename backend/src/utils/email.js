const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer (configured for Gmail by default).
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message
 * @param {string} [options.html] - Optional HTML content
 */
const sendEmail = async (options) => {
  // Config from env
  const config = {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  if (!config.auth.user || !config.auth.pass) {
    console.error('[EMAIL] Missing EMAIL_USER or EMAIL_PASS in environment variables');
    throw new Error('Email service is not configured (missing credentials)');
  }

  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: `"Easy App" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log('[EMAIL] Sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('[EMAIL ERROR]', err.message);
    throw err;
  }
};

module.exports = sendEmail;
