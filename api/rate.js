const fetch = require('node-fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = 'https://www.crcb.com.cn/whpj.html';
    const html = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }).then(r => r.text());

    // 宽松匹配汇率行
    const reg = /<tr>[\s\S]*?<td>([\u4e00-\u9fa5A-Z]+)<\/td>[\s\S]*?<td>(\d+\.\d+)<\/td>[\s\S]*?<td>(\d+\.\d+)<\/td>[\s\S]*?<td>(\d+\.\d+)<\/td>[\s\S]*?<td>(\d+\.\d+)<\/td>/gi;

    const list = [];
    let match;
    while ((match = reg.exec(html)) !== null) {
      list.push({
        currency: match[1].trim(),
        spotBuy: match[2],
        spotSell: match[3],
        cashBuy: match[4],
        cashSell: match[5]
      });
    }

    return res.json({ success: true, data: list });
  } catch (err) {
    return res.json({ success: false, msg: err.message });
  }
};
