export const weatherSample = {
  location: "Nashik, Maharashtra",
  temperature: 29,
  feelsLike: 31,
  humidity: 62,
  rainChance: 20,
  wind: 12,
  uv: 6,
  condition: "Partly cloudy",
  forecast: [
    { day: "Today", icon: "sun", high: 31, low: 22, rain: 10 },
    { day: "Tue", icon: "cloud", high: 30, low: 21, rain: 20 },
    { day: "Wed", icon: "rain", high: 27, low: 20, rain: 75 },
    { day: "Thu", icon: "cloud", high: 28, low: 20, rain: 35 },
    { day: "Fri", icon: "sun", high: 32, low: 21, rain: 5 },
    { day: "Sat", icon: "sun", high: 33, low: 22, rain: 5 },
    { day: "Sun", icon: "cloud", high: 31, low: 22, rain: 15 }
  ],
  advisory:
    "Rain is likely on Wednesday. Hold off on spraying pesticides until the showers pass."
};

const marketLocations = [
  { market: "Lasalgaon", district: "Nashik", state: "Maharashtra" },
  { market: "Pune", district: "Pune", state: "Maharashtra" },
  { market: "Indore", district: "Indore", state: "Madhya Pradesh" },
  { market: "Agra", district: "Agra", state: "Uttar Pradesh" },
  { market: "Azadpur", district: "North Delhi", state: "Delhi" },
  { market: "Rajkot", district: "Rajkot", state: "Gujarat" },
  { market: "Karnal", district: "Karnal", state: "Haryana" },
  { market: "Kurnool", district: "Kurnool", state: "Andhra Pradesh" },
  { market: "Hubballi", district: "Dharwad", state: "Karnataka" },
  { market: "Jaipur", district: "Jaipur", state: "Rajasthan" },
  { market: "Bhopal", district: "Bhopal", state: "Madhya Pradesh" },
  { market: "Ludhiana", district: "Ludhiana", state: "Punjab" },
  { market: "Kolkata", district: "Kolkata", state: "West Bengal" },
  { market: "Nagpur", district: "Nagpur", state: "Maharashtra" },
  { market: "Erode", district: "Erode", state: "Tamil Nadu" },
  { market: "Thrissur", district: "Thrissur", state: "Kerala" },
  { market: "Bhubaneswar", district: "Khordha", state: "Odisha" },
  { market: "Guwahati", district: "Kamrup Metropolitan", state: "Assam" }
];

const sampleCommodities = [
  { crop: "Onion", variety: "Red", base: 2480, change: 4.8 },
  { crop: "Wheat", variety: "Lokwan", base: 2310, change: 1.6 },
  { crop: "Tomato", variety: "Hybrid", base: 3200, change: -2.1 },
  { crop: "Cotton", variety: "Medium staple", base: 7120, change: 2.3 },
  { crop: "Rice", variety: "Common", base: 2180, change: 0.7 },
  { crop: "Potato", variety: "Jyoti", base: 1540, change: -0.8 },
  { crop: "Soybean", variety: "Yellow", base: 4620, change: 1.2 },
  { crop: "Maize", variety: "Yellow", base: 2250, change: 0.9 },
  { crop: "Mustard", variety: "Black", base: 5480, change: 1.4 },
  { crop: "Groundnut", variety: "Bold", base: 6250, change: -0.5 },
  { crop: "Chana", variety: "Desi", base: 5820, change: 0.8 },
  { crop: "Tur", variety: "Red gram", base: 8900, change: 1.1 },
  { crop: "Bajra", variety: "Local", base: 2470, change: -0.3 },
  { crop: "Cabbage", variety: "Green", base: 1850, change: 2.1 },
  { crop: "Cauliflower", variety: "Local", base: 2650, change: -1.2 },
  { crop: "Chilli", variety: "Dry", base: 11800, change: 1.7 }
];

export const mandiSample = sampleCommodities.flatMap((commodity, cropIndex) =>
  marketLocations.map((location, marketIndex) => {
    const variation = Math.round(Math.sin((cropIndex + 1) * (marketIndex + 2)) * commodity.base * 0.13);
    const price = Math.max(300, commodity.base + variation);
    const drift = cropIndex % 2 === 0 ? 1 : -1;
    return {
      crop: commodity.crop,
      variety: commodity.variety,
      market: location.market,
      district: location.district,
      state: location.state,
      price,
      change: Math.round((commodity.change + Math.cos(marketIndex + cropIndex) * 0.8) * 10) / 10,
      unit: "quintal",
      history: Array.from({ length: 9 }, (_, day) =>
        Math.round(price * (0.93 + day * 0.008 + Math.sin(day + cropIndex) * 0.015 + drift * day * 0.0005))
      )
    };
  })
);

export const productsSample = [
  { name: "Certified wheat seeds", detail: "HD 2967 · 40 kg bag", price: 1850, tag: "Popular", color: "gold" },
  { name: "Neem-based bio-fertilizer", detail: "Organic · 5 litre pack", price: 690, tag: "Organic", color: "green" },
  { name: "Drip irrigation starter kit", detail: "For up to 1 acre", price: 4290, tag: "Save 12%", color: "blue" }
];
