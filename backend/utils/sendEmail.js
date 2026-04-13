const nodeMailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const sendGridApiKey = process.env.SENDGRID_API_KEY;
const sendGridFrom = process.env.SENDGRID_MAIL;

if (sendGridApiKey && typeof sendGridApiKey === 'string') {
    sgMail.setApiKey(sendGridApiKey);
}

const sendEmail = async (options) => {
    if (sendGridApiKey && sendGridApiKey.startsWith('SG.') && sendGridFrom) {
        const msg = {
            to: options.email,
            from: sendGridFrom,
            templateId: options.templateId,
            dynamic_template_data: options.data,
        };

        try {
            await sgMail.send(msg);
            console.log('Email sent via SendGrid');
            return;
        } catch (error) {
            console.error('SendGrid email error:', error?.message || error);
            throw error;
        }
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_MAIL;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
        const transporter = nodeMailer.createTransport({
            host: smtpHost,
            port: Number(smtpPort),
            secure: smtpPort === '465' || smtpPort === '587',
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const mailOptions = {
            from: smtpUser,
            to: options.email,
            subject: options.subject || 'Notification',
            html: options.message,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent via SMTP');
            return;
        } catch (error) {
            console.error('SMTP email error:', error?.message || error);
            throw error;
        }
    }

    throw new Error('No email provider configured. Set valid SENDGRID_API_KEY and SENDGRID_MAIL, or configure SMTP_HOST, SMTP_PORT, SMTP_MAIL, and SMTP_PASSWORD.');
};

module.exports = sendEmail;