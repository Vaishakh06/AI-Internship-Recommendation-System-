import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to, link) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: "Activate Your Account",
    html: `<a href="${link}">Click here to verify your account</a>`,
  });
}
