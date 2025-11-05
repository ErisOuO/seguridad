import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: import.meta.env.VITE_GMAIL_USER,
    pass: import.meta.env.VITE_GMAIL_APP_PASSWORD
  }
});

export async function sendVerificationCode(email, code) {
  const mailOptions = {
    from: import.meta.env.VITE_GMAIL_USER,
    to: email,
    subject: 'Código de verificación - Tu acceso seguro',
    text: `Tu código de verificación es: ${code}\n\nEste código expirará en 3 minutos.`
  };

  await transporter.sendMail(mailOptions);
}
