// api/saweria.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const body = await new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
  });

  let data;
  try {
    data = JSON.parse(body);
  } catch (e) {
    console.error('Invalid JSON:', body);
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { customer_name, amount } = data;

  if (!customer_name || !amount) {
    return res.status(400).json({ error: 'Missing customer_name or amount' });
  }

  // Kirim ke Roblox Open Cloud
  try {
    const response = await fetch(
      `https://apis.roblox.com/messaging-service/v1/universes/${process.env.ROBLOX_UNIVERSE_ID}/topics/donation`,
      {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ROBLOX_OPEN_CLOUD_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: JSON.stringify({
            name: customer_name.trim() || 'Donatur',
            amount: `Rp${Number(amount).toLocaleString('id-ID')}`,
          }),
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Roblox API error:', errText);
      return res.status(500).json({ error: 'Roblox API failed', details: errText });
    }

    console.log(`✅ Donation: ${customer_name} - Rp${amount}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
