import nodemailer from "nodemailer";

// 1. Create the transporter using the 'Gmail' service
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // SMTP Host
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_ACCOUNT,
    // ✅ Use an App Password generated from your Google Account settings
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

// 2. Define a function to send the email
export const sendMail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: "perma-app@gmail.com",
    to,
    subject,
    text,
  });
};
