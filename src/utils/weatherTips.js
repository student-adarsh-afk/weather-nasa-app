export function getWeatherTip(current) {
  if (!current) return "Enjoy your day!";

  const t = Number(current.temperature);
  const desc = (current.description || "").toLowerCase();
  const precip = Number(current.precipitation || 0);
  const wind = Number(current.windSpeed || 0);

  // Severe/obvious conditions first
  if (desc.includes("thunder") || desc.includes("storm")) return "⚡ Stormy—stay indoors and keep devices charged, dear.";
  if (desc.includes("hail")) return "🧊 Hail possible—protect your ride and watch the skies.";
  if (desc.includes("snow")) return t <= -5 ? "❄️ Deep freeze—bundle up heavy, dear." : "❄️ Snowy—layer up and tread carefully.";
  if (desc.includes("sleet")) return "🌨️ Sleet—extra slippery underfoot.";
  if (desc.includes("fog") || desc.includes("mist") || desc.includes("haze")) return "🌫️ Low visibility—drive slow and keep lights on.";

  // Rain logic (use precip too)
  if (desc.includes("rain") || desc.includes("drizzle") || precip > 0.2) {
    if (precip > 5) return "🌧️ Heavy rain—carry an umbrella, dear, and wear waterproofs.";
    if (precip > 1) return "🌦️ Showers likely—umbrella recommended, dear.";
    return "☔ Light drizzle—pack a compact umbrella.";
  }

  // Clear/cloud coverage nuance by temperature
  const clearish = desc.includes("clear") || desc.includes("sun");
  const cloudy = desc.includes("cloud") || desc.includes("overcast");

  // Temperature bands
  if (t >= 40) return "🔥 Extreme heat—limit sun, hydrate nonstop, dear.";
  if (t >= 35) return "🥵 Very hot—seek shade, SPF on, and sip water often.";
  if (t >= 29) return clearish ? "😎 Sunny and warm—light layers and sunscreen." : "😎 Warm—stay cool and hydrated.";
  if (t >= 24) return clearish ? "🌞 Pleasant and bright—great day for a stroll." : "🙂 Mild and comfy—enjoy your day.";
  if (t >= 17) return clearish ? "🌤️ Pleasant—light jacket optional." : "🌥️ Mild—carry a light layer just in case.";
  if (t >= 11) return clearish ? "🌤️ Cool sunshine—grab a sweater, dear." : "☁️ Cool—wear a light jacket.";
  if (t >= 6)  return clearish ? "🌤️ Bright but chilly—layer up, dear." : "🌥️ Chilly—jacket recommended.";
  if (t >= 1)  return "🧥 Cold—coat, hat, and warm layers advised.";
  if (t >= -9) return "🥶 Very cold—bundle up well, dear.";
  return "🧊 Bitter cold—limit time outdoors and stay warm, dear.";

  // Wind advice (adds on top when nothing else matched)
  // If wind is strong and conditions not already handled, give a tip
  if (wind >= 12) return "💨 Windy—secure loose items and hold onto your hat!";
}
