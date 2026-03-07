import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { first_name, last_name, email, city, age_range, social } = req.body;

  if (!email) return res.status(400).json({ error: 'Email required' });

  const apiKey = process.env.BREVO_API_KEY;

  // 1. Add contact to Brevo list
  await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      attributes: { FIRSTNAME: first_name, LASTNAME: last_name, CITY: city, AGE_RANGE: age_range, SOCIAL: social },
      listIds: [5],
      updateEnabled: true,
    }),
  }).catch(() => {});

  // 2. Send welcome email
  const welcomeHtml = readFileSync(join(process.cwd(), 'newsletter-welcome.html'), 'utf8');
  const firstName = first_name || 'Friend';

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Salt & Light Social', email: 'guramrit.art@gmail.com' },
      to: [{ email, name: `${first_name || ''} ${last_name || ''}`.trim() }],
      subject: 'Welcome to Salt & Light Social 🌿',
      htmlContent: welcomeHtml,
    }),
  }).catch(() => {});

  return res.status(200).json({ ok: true });
}
