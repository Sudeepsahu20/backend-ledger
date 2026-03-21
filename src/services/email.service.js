//create me a nodemailer code to send email to user when they register
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, username) {
  const subject = 'Welcome to Backend Ledger!';
  const text = `Hi ${username},\n\nThank you for registering at Backend Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hi ${username},</p><p>Thank you for registering at <strong>Backend Ledger</strong>. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`
    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, username, transactionDetails) {
  const subject = 'Transaction Alert from Backend Ledger';
  const text = `Hi ${username},\n\nA new transaction has been made on your account. Here are the details:\n\n${transactionDetails}\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hi ${username},</p><p>A new transaction has been made on your account. Here are the details:</p><pre>${transactionDetails}</pre><p>Best regards,<br>The Backend Ledger Team</p>`;
    await sendEmail(userEmail, subject, text, html);
}

export { 
    sendRegistrationEmail,
    sendTransactionEmail
} 
