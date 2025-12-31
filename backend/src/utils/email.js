const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // ✅ simulate ONLY if you explicitly enable it
    const simulateEmail = process.env.EMAIL_SIMULATION === 'true';

    if (simulateEmail) {
        console.log('\n--- EMAIL SIMULATION (Development) ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('--------------------------------------\n');
        return;
    }

    const transporterOptions = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
    };

    if ((process.env.EMAIL_HOST || '').includes('gmail.com')) {
        delete transporterOptions.host;
        delete transporterOptions.port;
        delete transporterOptions.secure;
        transporterOptions.service = 'gmail';
    }

    const transporter = nodemailer.createTransport(transporterOptions);

    // ✅ verify SMTP before sending (helps debug)
    await transporter.verify();
    console.log('SMTP verified ✅');

    const mailOptions = {
        from: `"Easy Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
};

module.exports = sendEmail;
