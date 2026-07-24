import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, pickup, destination, details } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }

  const route = pickup && destination
    ? `${pickup} → ${destination}`
    : pickup || destination || 'Not specified';

  const body = [
    `New enquiry from the website`,
    ``,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email || 'Not provided'}`,
    `Route: ${route}`,
    `Details: ${details || 'Not specified'}`,
  ].join('\n');

  try {
    await resend.emails.send({
      from: 'RCC Website <onboarding@resend.dev>',
      to: 'rajatcarrying@gmail.com',
      reply_to: email || undefined,
      subject: `New Enquiry from ${name}`,
      text: body,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email.' });
  }
}
