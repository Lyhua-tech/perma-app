import nodemailer from "nodemailer";

// 1. Create the transporter using the 'Gmail' service
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // SMTP Host
  port: 2525,
  auth: {
    user: "fc4bcef078b543",
    // ✅ Use an App Password generated from your Google Account settings
    pass: "eadbefcff4de4b",
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
