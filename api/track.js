export default async function handler(req, res) {
  // Izinkan Shopify Ranu Tarde mengakses API ini
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request dari browser
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Menarik data resi, kurir, dan nomor HP (baru)
  const { courier, awb, number } = req.query;
  // API Key BinderByte Kakak
  const API_KEY = 'f75a8b1cb3fdf220fbcd5a426b5a1e420be8311b6c737af3290b1f940c1a19e9';

  if (!courier || !awb) {
    return res.status(400).json({ status: 400, message: 'Harap masukkan kurir dan resi' });
  }

  try {
    // Vercel menembak API BinderByte secara aman dari sisi Server
    let url = `https://api.binderbyte.com/v1/track?api_key=${API_KEY}&courier=${courier}&awb=${awb}`;
    
    // SUNTIKAN BARU: Tambahkan nomor HP jika kurir mewajibkannya (JNE)
    if (number) {
      url += `&number=${number}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    // Kembalikan datanya ke Shopify
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal terhubung ke BinderByte' });
  }
}
