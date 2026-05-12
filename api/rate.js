const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // 全局跨域放行
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 每日自动更新中间价源
    const url = "https://api.exchangerate.host/latest?base=CNY";
    const raw = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const data = await raw.json();

    if (!data || !data.rates) {
      return res.json({ success: false });
    }

    // 要展示的币种
    const currList = [
      { code: "USD", name: "美元" },
      { code: "EUR", name: "欧元" },
      { code: "GBP", name: "英镑" },
      { code: "HKD", name: "港币" },
      { code: "JPY", name: "日元" },
      { code: "AUD", name: "澳元" },
      { code: "SGD", name: "新加坡元" }
    ];

    const result = [];
    currList.forEach(item => {
      const ratePerCny = data.rates[item.code];
      if (!ratePerCny) return;

      // 1外币兑人民币 中间价
      let mid = parseFloat((1 / ratePerCny).toFixed(4));
      // 规则：自动加减点差
      let cashBuy = (mid - 0.0200).toFixed(4);
      let cashSell = (mid + 0.0200).toFixed(4);

      result.push({
        code: item.code,
        name: item.name,
        mid: mid.toFixed(4),
        cashBuy,
        cashSell
      });
    });

    return res.json({ success: true, list: result });
  } catch (e) {
    return res.json({ success: false });
  }
};
