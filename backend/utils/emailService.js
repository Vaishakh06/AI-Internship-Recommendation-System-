import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to, link) {
    try {
        console.log("🔑 RESEND_API_KEY loaded:", !!process.env.RESEND_API_KEY);

        const response = await resend.emails.send({
            from: "InternDesk <onboarding@resend.dev>",
            to: [to], // ✅ MUST be array
            subject: "Activate Your Account",
            html: `
        <h2>Welcome to InternDesk</h2>
        <p>Click below to verify your account:</p>
        <a href="${link}">Verify Account</a>
      `,
        });

        console.log("✅ Resend response:", response);
        return true;
    } catch (error) {
        console.error("❌ Resend email failed:", error);
        return false;
    }
}
