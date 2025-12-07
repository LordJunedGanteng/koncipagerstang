  // === Kirim ke Roblox Open Cloud ===
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
      console.error('Roblox API error:', await response.text());
      return res.status(500).json({ error: 'Roblox API failed' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
