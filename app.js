async function checkStock() {
  const ticker = document.getElementById("tickerInput").value.toUpperCase();
  const result = document.getElementById("result");

  if (!ticker) {
    result.innerHTML = "Bitte Ticker eingeben.";
    return;
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d`;

  try {
    const data = await fetch(url).then(r => r.json());
    const candles = data.chart.result[0].indicators.quote[0];

    const close = candles.close;
    const high = candles.high;
    const low = candles.low;
    const volume = candles.volume;

    const last = close.length - 1;

    const body = Math.abs(close[last] - close[last - 1]);
    const range = high[last] - low[last];
    const bodyPercent = body / range;

    const volToday = volume[last];
    const volAvg = volume.slice(last - 10, last).reduce((a, b) => a + b) / 10;

    let status = "";

    if (bodyPercent < 0.15 && volToday < volAvg * 0.7) {
      status = "Tightness → mögliches Pivot";
    } else if (bodyPercent > 0.6 && close[last] < close[last - 1]) {
      status = "Trend beschädigt / Distribution";
    } else if (close[last] > high[last - 1]) {
      status = "Breakout → kaufbar";
    } else {
      status = "Kein Setup";
    }

    result.innerHTML = `
      <h3>${ticker}</h3>
      <p>Status: <strong>${status}</strong></p>
    `;
  } catch (e) {
    result.innerHTML = "Ticker nicht gefunden oder Fehler beim Laden.";
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
