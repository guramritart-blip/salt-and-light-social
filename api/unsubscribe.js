export default async function handler(req, res) {
  const { email } = req.method === 'POST' ? req.body : req.query;

  if (!email) return res.status(400).json({ error: 'Email required' });

  const apiKey = process.env.BREVO_API_KEY;

  try {
    // Remove from list 5 and blacklist from all emails
    await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailBlacklisted: true,
        unlinkListIds: [5]
      }),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to unsubscribe' });
  }
}
