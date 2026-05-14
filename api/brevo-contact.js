export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const BREVO_API_KEY = process.env.VITE_BREVO_API_KEY || process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    return res.status(500).json({ error: 'Brevo API key not configured' });
  }

  try {
    const { email, attributes, listIds } = req.body;

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: attributes || {},
        listIds: listIds || [2],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Contact already exists is still a success
      if (response.status === 400 && errorData.code === 'duplicate_parameter') {
        return res.status(200).json({ success: true, message: 'Already registered' });
      }
      return res.status(response.status).json({ success: false, error: errorData.message });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Brevo API Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
