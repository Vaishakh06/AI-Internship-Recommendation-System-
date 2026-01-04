import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to, link) {
  console.log("🔑 RESEND_API_KEY loaded:", !!process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "InternDesk <onboarding@resend.dev>", // ✅ MUST BE THIS
    to,
    subject: "Activate Your Account",
    html: `
      <h2>Welcome to InternDesk</h2>
      <p>Click below to verify your account:</p>
      <a href="${link}">Verify Account</a>
    `,
  });

  console.log("✅ Verification email sent to:", to);
}
