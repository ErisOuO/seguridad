import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export async function sendVerificationCode(email, code) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Tu código de verificación',
    text: `Tu código es: ${code}\n\nExpira en 3 minutos.`
  };

  await transporter.sendMail(mailOptions);
}
