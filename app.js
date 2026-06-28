async function checkStock() {
  const ticker = document.getElementById("tickerInput").value.toUpperCase();
  const result = document.getElementById("result");

  if (!ticker) {
    result.innerHTML = "Bitte Ticker eingeben.";
    return;
  }

  // FMP API – 1‑Day Candles
  const url = `https://financialmodelingprep.com/api/v3/historical-chart/1day/${ticker}?apikey=APIKEY`;

  try {
    const data = await fetch(url).then(r => r.json());

    if (!Array.isArray(data) || data.length < 2) {
      result.innerHTML = "Ticker nicht gefunden oder keine Daten.";
      return;
    }

    // FMP liefert ein Array: [0] = heute, [1] = gestern
    const today = data[0];
    const yesterday = data[1];

    const closeToday = today.close;
    const closeYesterday = yesterday.close;

    const highToday = today.high;
    const lowToday = today.low;

    const volumeToday = today.volume;

    // Durchschnittsvolumen der letzten 10 Kerzen
    const volAvg = data.slice(0, 10).reduce((sum, c) => sum + c.volume, 0) / 10;

    // Body & Range
    const body = Math.abs(closeToday - closeYesterday);
    const range = highToday - lowToday;
    const bodyPercent = body / range;

    let status = "";

    if (bodyPercent < 0.15 && volumeToday < volAvg * 0.7) {
      status = "Tightness → mögliches Pivot";
    } else if (bodyPercent > 0.6 && closeToday < closeYesterday) {
      status = "Trend beschädigt / Distribution";
    } else if (closeToday > yesterday.high) {
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

// Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/qulla-pwa/service-worker.js");
}
