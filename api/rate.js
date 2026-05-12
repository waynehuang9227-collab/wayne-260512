const fetch = require('node-fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const url = 'https://www.crbank.com.cn/gr_grkh_khfw_bmfw/whpj.html';
    const html = await fetch(url).then(r => r.text());

    const reg = /<tr[^>]*>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<\/tr>/gi;
    const rates = [];
    let m;

    while ((m = reg.exec(html)) !== null) {
      rates.push({
        currency: m[1].trim(),
        spotBuy: m[2].trim(),
        spotSell: m[3].trim(),
        cashBuy: m[4].trim(),
        cashSell: m[5].trim(),
        time: m[6].trim()
      });
    }

    res.status(200).json({ success: true, data: rates });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};
