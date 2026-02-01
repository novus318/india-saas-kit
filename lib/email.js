import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export const sendEmail = async (to, subject, html) => {
    try {
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to,
            subject,
            html,
        });
        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
};
