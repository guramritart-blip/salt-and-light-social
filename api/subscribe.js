export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { first_name, last_name, email, city, age_range, social } = req.body;

  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: first_name, LASTNAME: last_name, CITY: city, AGE_RANGE: age_range, SOCIAL: social },
        listIds: [5],
        updateEnabled: true,
      }),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
