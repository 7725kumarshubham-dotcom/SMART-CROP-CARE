"use client";

import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, AudioLines, Bell, BookOpen,
  Bug, CalendarDays, Check, ChevronDown, Cloud, CloudRain, Droplets, ExternalLink,
  FileText, FlaskConical, Globe2, Heart, Leaf, MapPin, Menu, Mic, Minus, Moon, Package,
  Plus, Search, Send, ShoppingBag, Sprout, Sun, ThermometerSun, TrendingDown,
  TrendingUp, Upload, UserRound, Volume2, Wind, X
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { indianStates } from "@/lib/india-locations";

type Tab = "dashboard" | "doctor" | "soil" | "market" | "efficiency" | "shop";
type Language = "English" | "Hindi" | "Marathi";
type Theme = "light" | "dark";
type ForecastDay = { day: string; icon: string; high: number; low: number; rain: number };
type Weather = {
  location: string; temperature: number; feelsLike: number; humidity: number;
  rainChance: number; wind: number; uv: number; condition: string;
  forecast: ForecastDay[]; advisory: string; source?: string;
};
type MarketRecord = {
  crop: string; variety: string; market: string; state: string; price: number;
  district?: string; change: number; unit: string; history: number[]; recordedAt?: string;
};
type MarketOptions = {
  states: string[];
  crops: string[];
  districts: string[];
  mandis: { district: string; market: string }[];
};
type Diagnosis = {
  disease: string; confidence: number; severity: string; symptoms: string;
  organic: string; chemical: string; prevention: string; note: string; source?: string;
};
type LocationResult = {
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
};
type NearbyLab = {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  mapUrl: string;
  directionsUrl: string;
  source: string;
};
type CropGuide = {
  crop: string;
  season: string;
  soil: string;
  duration: string;
  image: string;
  imageAlt: string;
};

const cropGuides: CropGuide[] = [
  {
    crop: "Wheat",
    season: "Rabi · Oct–Dec",
    soil: "Well-drained loam",
    duration: "110–140 days",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Wide green fields beneath a bright sky"
  },
  {
    crop: "Rice",
    season: "Kharif · Jun–Aug",
    soil: "Clay or alluvial soil",
    duration: "120–150 days",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Green crop rows growing in a rural field"
  },
  {
    crop: "Onion",
    season: "Rabi · Oct–Dec",
    soil: "Loose, well-drained loam",
    duration: "100–120 days",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Freshly harvested onions"
  }
];

const navItems: { id: Tab; label: string; icon: typeof Leaf }[] = [
  { id: "dashboard", label: "Dashboard", icon: Activity },
  { id: "doctor", label: "Crop doctor", icon: Bug },
  { id: "soil", label: "Soil testing", icon: FlaskConical },
  { id: "market", label: "Mandi prices", icon: TrendingUp },
  { id: "efficiency", label: "Farm planner", icon: Sprout },
  { id: "shop", label: "Farm shop", icon: ShoppingBag }
];

const translations: Record<Language, Record<string, string>> = {
  English: {},
  Hindi: {
    Dashboard: "डैशबोर्ड", "Crop doctor": "फसल डॉक्टर", "Soil testing": "मिट्टी जांच",
    "Mandi prices": "मंडी भाव", "Farm planner": "खेत योजना", "Farm shop": "कृषि दुकान",
    "Your farm, in good hands": "आपका खेत, हमारी देखभाल", "YOUR FARM": "आपका खेत",
    "Here for your farm": "आपके खेत के लिए", "Talk to our agronomist assistant whenever you need a hand.": "कृषि सलाह के लिए हमारे सहायक से कभी भी बात करें।",
    "Ask a question": "सवाल पूछें", "Choose language": "भाषा चुनें",
    "Good morning,": "सुप्रभात,", "Here's what's happening on your farm today.": "आज आपके खेत में क्या हो रहा है, जानें।",
    "My farm": "मेरा खेत", "Good day to check your crop rows.": "फसल की कतारें देखने के लिए अच्छा दिन है।",
    "Humidity": "नमी", "Rain chance": "बारिश की संभावना", "Wind": "हवा",
    "YOUR DAILY BRIEF": "आज की जानकारी", "Farm weather, in a minute": "एक मिनट में मौसम की जानकारी",
    "Listen to briefing": "जानकारी सुनें", "Pause briefing": "रोकें", "Resume briefing": "फिर सुनें", "Replay": "दोबारा सुनें",
    "7-day forecast": "7 दिन का मौसम", "Plan field work around the weather": "मौसम के अनुसार खेत के काम की योजना बनाएं",
    "Choose farm": "खेत चुनें", "Use my location": "मेरी लोकेशन उपयोग करें",
    "Field tip:": "खेत की सलाह:", "Your farm at a glance": "आपके खेत की एक झलक",
    "A quick look at your fields": "आपके खेतों की संक्षिप्त जानकारी", "Cultivated area": "खेती का क्षेत्र",
    "Main crop": "मुख्य फसल", "Next field task": "अगला खेत का काम", "Tomorrow": "कल",
    "Walk the field and check soil moisture before irrigation.": "सिंचाई से पहले खेत में जाकर मिट्टी की नमी जांचें।",
    "Today's mandi snapshot": "आज के मंडी भाव", "Latest sample modal prices · ₹ per quintal": "नमूना मंडी भाव · ₹ प्रति क्विंटल",
    "All prices": "सभी भाव", "Quick actions": "जल्दी करें", "Tools for your next field visit": "अगली खेत यात्रा के लिए साधन",
    "Scan a crop problem": "फसल की समस्या जांचें", "Get a quick plant health check": "फसल के स्वास्थ्य की तुरंत जांच करें",
    "Book a soil test": "मिट्टी जांच बुक करें", "Find a nearby testing lab": "पास की जांच प्रयोगशाला खोजें",
    "Plan fertilizer use": "खाद का उपयोग तय करें", "Estimate amounts for your fields": "अपने खेत के लिए मात्रा जानें",
    "Select a language": "भाषा चुनें", "Light mode": "लाइट मोड", "Dark mode": "डार्क मोड",
    "Your farm": "आपका खेत", "Local weather": "स्थानीय मौसम", "Saved forecast": "सहेजा गया पूर्वानुमान",
    "Weather loading": "मौसम लोड हो रहा है", "Search crops, markets...": "फसलें, मंडियां खोजें...",
    "Search crops and markets": "फसलें और मंडियां खोजें", "Search": "खोजें", "Weather": "मौसम",
    "Notifications": "सूचनाएं", "Edit farm profile": "खेत की जानकारी संपादित करें",
    "Welcome back": "वापसी पर स्वागत है", "Your farm overview, crop recommendations, and market insights in one place.": "आपके खेत की जानकारी, फसल सुझाव और बाजार भाव एक ही जगह।",
    "Practical insights for your farm": "आपके खेत के लिए उपयोगी जानकारी",
    "Grow Smarter. Sell Better.": "समझदारी से उगाएं। बेहतर बेचें।",
    "Your intelligent companion for healthier crops, smarter farming decisions, and better market opportunities.": "स्वस्थ फसलों, बेहतर खेती के फैसलों और अच्छे बाजार अवसरों के लिए आपका भरोसेमंद साथी।",
    "Explore crop insights": "फसल सुझाव देखें", "Check market prices": "बाजार भाव देखें",
    "SEASONAL GUIDE": "मौसमी मार्गदर्शिका", "Crop ideas to explore": "जानने योग्य फसलें",
    "General growing guides, not a soil diagnosis": "सामान्य खेती मार्गदर्शन, मिट्टी की जांच नहीं",
    "SAMPLE": "नमूना", "LIVE": "लाइव", "market price": "बाजार भाव", "per quintal": "प्रति क्विंटल",
    "Open mandi insights for available prices": "उपलब्ध भावों के लिए मंडी जानकारी खोलें",
    "Weather conditions": "मौसम की स्थिति", "Screening result ready": "फसल जांच का परिणाम तैयार",
    "No crop scans yet": "अभी तक फसल की जांच नहीं हुई", "Screening aid · not a confirmed diagnosis": "प्रारंभिक जांच · पुष्टि किया हुआ निदान नहीं",
    "Scan a plant to check for possible issues": "संभावित समस्याओं के लिए पौधे की जांच करें",
    "EXPLORE YOUR OPTIONS": "अपने विकल्प देखें", "Seasonal crop guide": "मौसमी फसल मार्गदर्शिका",
    "Starting points for planning. Confirm local suitability with your soil report or KVK.": "योजना के लिए शुरुआती सुझाव। स्थानीय उपयुक्तता की पुष्टि मिट्टी रिपोर्ट या कृषि विज्ञान केंद्र से करें।",
    "General guidance · not personalized": "सामान्य सलाह · व्यक्तिगत नहीं", "Soil guide": "मिट्टी का सुझाव",
    "Growing duration": "उगने की अवधि", "Indicative mandi modal price · ₹/quintal": "अनुमानित मंडी भाव · ₹/क्विंटल",
    "sample data": "नमूना डेटा", "live data": "लाइव डेटा", "No price available for this crop": "इस फसल का भाव उपलब्ध नहीं",
    "Ask about": "पूछें:", "Your Smart Farming Assistant": "आपका स्मार्ट कृषि सहायक",
    "Get guidance on crop selection, soil health, pest management, irrigation, and market opportunities.": "फसल चयन, मिट्टी के स्वास्थ्य, कीट प्रबंधन, सिंचाई और बाजार के अवसरों पर सलाह पाएं।",
    "Which crop is suitable for my soil?": "मेरी मिट्टी के लिए कौन सी फसल उपयुक्त है?",
    "How can I identify crop diseases?": "मैं फसल के रोगों की पहचान कैसे करूं?",
    "Which mandi offers a better price?": "किस मंडी में बेहतर भाव मिलता है?",
    "When should I irrigate my crops?": "मुझे फसलों की सिंचाई कब करनी चाहिए?",
    "Ask about your farm...": "अपने खेत के बारे में पूछें...", "Ask the farming assistant": "कृषि सहायक से पूछें",
    "Answers are general information. Confirm important decisions with local agricultural experts.": "उत्तर सामान्य जानकारी हैं। महत्वपूर्ण फैसलों की पुष्टि स्थानीय कृषि विशेषज्ञ से करें।",
    "PLANT HEALTH": "पौधों का स्वास्थ्य", "A closer look can help": "ध्यान से जांचना मददगार है",
    "Upload a clear leaf photo for an AI screening. Results are a starting point, not a confirmed diagnosis.": "एआई जांच के लिए पत्ती की साफ तस्वीर अपलोड करें। परिणाम शुरुआती संकेत हैं, पुष्टि किया हुआ निदान नहीं।",
    "Open crop doctor": "फसल डॉक्टर खोलें", "Feels like": "महसूस हो रहा है",
    "Checking today's forecast and field conditions...": "आज का मौसम और खेत की स्थिति जांची जा रही है...",
    "Check the latest forecast before field work.": "खेत में काम से पहले ताजा मौसम पूर्वानुमान देखें।",
    "Sample modal prices": "नमूना मंडी भाव", "Live modal prices": "लाइव मंडी भाव",
    "today": "आज", "Basket": "टोकरी", "Ask an agronomist": "कृषि विशेषज्ञ से पूछें",
    "Open AI farm assistant": "एआई कृषि सहायक खोलें", "Farm assistant": "कृषि सहायक",
    "Agriculture information, made simple": "खेती की जानकारी, आसान भाषा में", "Close assistant": "सहायक बंद करें",
    "Thinking...": "सोच रहा है...", "Speak your question": "अपना सवाल बोलें", "Send question": "सवाल भेजें",
    "Ask about your crops...": "अपनी फसलों के बारे में पूछें...",
    "Open navigation": "नेविगेशन खोलें", "Close menu": "मेनू बंद करें",
    "Rabi · Oct–Dec": "रबी · अक्टूबर–दिसंबर", "Kharif · Jun–Aug": "खरीफ · जून–अगस्त",
    "Well-drained loam": "अच्छी जल-निकासी वाली दोमट मिट्टी", "Clay or alluvial soil": "चिकनी या जलोढ़ मिट्टी",
    "Loose, well-drained loam": "भुरभुरी, अच्छी जल-निकासी वाली दोमट मिट्टी",
    "110–140 days": "110–140 दिन", "120–150 days": "120–150 दिन", "100–120 days": "100–120 दिन",
    "Today": "आज", "Sun": "रवि", "Mon": "सोम", "Tue": "मंगल", "Wed": "बुध", "Thu": "गुरु", "Fri": "शुक्र",
    "Clear sky": "साफ आसमान", "Partly cloudy": "आंशिक बादल", "Overcast": "बादल छाए हुए",
    "Fog": "कोहरा", "Drizzle or rain": "बूंदाबांदी या बारिश", "Rain showers": "बारिश की बौछारें",
    "Thunderstorms": "आंधी-तूफान", "Snow": "बर्फबारी", "Snow showers": "बर्फ की बौछारें",
    "Current conditions": "वर्तमान मौसम", "Loading weather": "मौसम लोड हो रहा है",
    "Conditions look mostly dry. Check soil moisture before your next irrigation.": "मौसम अधिकतर सूखा है। अगली सिंचाई से पहले मिट्टी की नमी जांचें।",
    "Rain is likely on": "इस दिन बारिश की संभावना है:",
    "Avoid spraying pesticides before or during the showers.": "बारिश से पहले या बारिश के दौरान कीटनाशक का छिड़काव न करें।",
    "Ask": "पूछें",
    "What should I consider before growing {crop} near {location}?": "{location} के पास {crop} उगाने से पहले मुझे किन बातों पर विचार करना चाहिए?",
    Wheat: "गेहूं", Rice: "धान", Onion: "प्याज", Cotton: "कपास", Tomato: "टमाटर", Potato: "आलू",
    rain: "बारिश",
    "AI crop health doctor": "एआई फसल स्वास्थ्य डॉक्टर",
    "Take a clear photo of a leaf or affected plant. We'll help you understand what might be happening.": "पत्ती या प्रभावित पौधे की साफ तस्वीर लें। इससे संभावित समस्या समझने में मदद मिलेगी।",
    "What crop are you checking?": "आप किस फसल की जांच कर रहे हैं?",
    "Upload or take a photo": "तस्वीर अपलोड करें या लें",
    "Drop an image here, or browse · JPG, PNG or WebP · up to 10 MB": "तस्वीर यहां छोड़ें या चुनें · JPG, PNG या WebP · अधिकतम 10 MB",
    "Checking your crop...": "आपकी फसल की जांच हो रही है...", "Check crop health": "फसल का स्वास्थ्य जांचें",
    "Your photo is used only to provide this result. This tool is a screening aid, not a confirmed diagnosis.": "आपकी तस्वीर का उपयोग केवल यह परिणाम देने के लिए होगा। यह प्रारंभिक जांच है, पुष्टि किया हुआ निदान नहीं।",
    "Your crop check will appear here": "फसल जांच का परिणाम यहां दिखेगा",
    "Upload a clear photo in natural light. Try to include both healthy and affected leaves.": "प्राकृतिक रोशनी में साफ तस्वीर अपलोड करें। स्वस्थ और प्रभावित दोनों पत्तियों को शामिल करें।",
    "Clear, close-up photo": "साफ, पास से ली गई तस्वीर", "Good natural light": "अच्छी प्राकृतिक रोशनी",
    "One plant at a time": "एक बार में एक पौधा", "concern": "संबंधी चिंता",
    "Sample screening": "नमूना जांच", "confidence": "विश्वास स्तर", "What to look for": "क्या देखें",
    "Gentle first steps": "शुरुआती सुरक्षित उपाय", "Chemical treatment": "रासायनिक उपचार", "Prevention": "बचाव",
    "Choose a nearby lab and a time that works for you.": "पास की प्रयोगशाला और अपनी सुविधा का समय चुनें।",
    "Request confirmed": "अनुरोध की पुष्टि हुई", "Demo request created": "डेमो अनुरोध बनाया गया",
    "Your appointment is saved. Show this token at the lab or mention it when arranging pickup.": "आपकी बुकिंग सहेजी गई है। प्रयोगशाला में यह टोकन दिखाएं या नमूना लेने की व्यवस्था करते समय बताएं।",
    "This demo token is not saved yet. Connect a database to keep appointment records.": "यह डेमो टोकन अभी सहेजा नहीं गया है। बुकिंग रिकॉर्ड रखने के लिए डेटाबेस जोड़ें।",
    "Your appointment token": "आपका अपॉइंटमेंट टोकन", "Book another test": "एक और जांच बुक करें",
    "Mobile number": "मोबाइल नंबर", "Crop to test": "जांच की फसल", "Preferred date": "पसंदीदा तारीख",
    "Time slot": "समय स्लॉट", "How would you like to test?": "आप जांच कैसे करवाना चाहेंगे?",
    "Visit the lab": "प्रयोगशाला जाएं", "Bring your soil sample": "मिट्टी का नमूना साथ लाएं",
    "Sample pickup": "नमूना लेने आएं", "Lab will confirm availability": "प्रयोगशाला उपलब्धता की पुष्टि करेगी",
    "Soil testing lab": "मिट्टी जांच प्रयोगशाला", "Choose a nearby lab or enter a lab name": "पास की प्रयोगशाला चुनें या नाम दर्ज करें",
    "Enter a soil testing lab name": "मिट्टी जांच प्रयोगशाला का नाम दर्ज करें",
    "Request appointment": "अपॉइंटमेंट का अनुरोध करें", "Nearby soil labs": "पास की मिट्टी जांच प्रयोगशालाएं",
    "Refresh": "रीफ्रेश करें", "OpenStreetMap nearby-place results · ordered by distance": "OpenStreetMap के पास के स्थान · दूरी के अनुसार",
    "Looking for agriculture and soil-testing facilities near your farm...": "आपके खेत के पास कृषि और मिट्टी जांच केंद्र खोजे जा रहे हैं...",
    "No soil-testing facilities were listed nearby.": "पास में मिट्टी जांच केंद्र सूचीबद्ध नहीं हैं।",
    "Address not listed": "पता उपलब्ध नहीं", "Select for booking": "बुकिंग के लिए चुनें",
    "Map": "नक्शा", "Directions": "दिशा-निर्देश", "Search soil labs on Google Maps": "Google Maps पर मिट्टी जांच केंद्र खोजें",
    "Why test your soil?": "मिट्टी की जांच क्यों करें?",
    "Listings come from OpenStreetMap and may be incomplete or unverified. Call the facility to confirm soil testing services and availability.": "सूचियां OpenStreetMap से हैं और अधूरी या अपुष्ट हो सकती हैं। मिट्टी जांच सेवा और उपलब्धता की पुष्टि के लिए केंद्र को कॉल करें।",
    "A soil test measures pH and nutrients so you can make informed fertilizer choices and avoid unnecessary inputs. Ask the lab for a soil health card with your results.": "मिट्टी की जांच से pH और पोषक तत्वों का पता चलता है, जिससे आप सही खाद चुन सकते हैं और अनावश्यक खर्च से बच सकते हैं। परिणामों के साथ प्रयोगशाला से मृदा स्वास्थ्य कार्ड मांगें।",
    "km away": "किमी दूर", "Lab search radius": "प्रयोगशाला खोजने की दूरी",
    "Close farm profile": "खेत की जानकारी बंद करें",
    "Mandi market insights": "मंडी बाजार जानकारी", "Search mandi prices for multiple crops across India.": "भारत भर की कई फसलों के मंडी भाव खोजें।",
    "Find crop prices": "फसल के भाव खोजें", "Filter by commodity and mandi location. Leave blank to browse all available records.": "फसल और मंडी स्थान से छांटें। सभी उपलब्ध रिकॉर्ड देखने के लिए खाली छोड़ें।",
    "State": "राज्य", "All states": "सभी राज्य", "Crop": "फसल", "All crops": "सभी फसलें",
    "District": "जिला", "All districts": "सभी जिले", "Select a state first": "पहले राज्य चुनें",
    "Mandi": "मंडी", "All mandis in district": "जिले की सभी मंडियां", "All mandis in state": "राज्य की सभी मंडियां",
    "Search all fields": "सभी फ़ील्ड में खोजें", "Crop, variety, location...": "फसल, किस्म, स्थान...",
    "Loading available crops, districts, and mandis...": "उपलब्ध फसलें, जिले और मंडियां लोड हो रही हैं...",
    "Clear all filters": "सभी फ़िल्टर हटाएं", "Price trend": "भाव का रुझान",
    "Recent mandi modal price · ₹ per quintal": "हाल का मंडी भाव · ₹ प्रति क्विंटल",
    "Choose crop and mandi for price trend": "भाव का रुझान देखने के लिए फसल और मंडी चुनें",
    "Modal price": "मॉडल भाव", "Today's change": "आज का बदलाव", "Price history is not available for this record.": "इस रिकॉर्ड के लिए भाव का इतिहास उपलब्ध नहीं है।",
    "Markets on this page": "इस पृष्ठ के बाजार", "Select any crop and mandi for the chart": "चार्ट के लिए कोई भी फसल और मंडी चुनें",
    "No matching mandi records.": "मिलते-जुलते मंडी रिकॉर्ड नहीं मिले।",
    "Plan with your field in mind": "अपने खेत को ध्यान में रखकर योजना बनाएं",
    "Estimate inputs, check the forecast, and keep practical field notes together.": "कृषि सामग्री का अनुमान लगाएं, मौसम देखें और खेत के जरूरी नोट साथ रखें।",
    "Field input calculator": "खेत सामग्री कैलकुलेटर", "Estimate amounts from your own per-acre recommendation.": "प्रति एकड़ अपनी सिफारिश के अनुसार मात्रा का अनुमान लगाएं।",
    "Farm area": "खेत का क्षेत्रफल", "acres": "एकड़", "acre": "एकड़", "Fertilizer recommendation per acre (kg)": "प्रति एकड़ उर्वरक की सिफारिश (किलो)",
    "Reduce fertilizer rate": "उर्वरक की मात्रा घटाएं", "Increase fertilizer rate": "उर्वरक की मात्रा बढ़ाएं",
    "Input type": "कृषि सामग्री का प्रकार", "NPK fertilizer": "एनपीके उर्वरक",
    "Compost / organic manure": "कम्पोस्ट / जैविक खाद", "Seed quantity": "बीज की मात्रा",
    "Estimated quantity for your farm": "आपके खेत के लिए अनुमानित मात्रा",
    "Based on": "आधार", "kg / acre": "किलो / एकड़",
    "Use the rate recommended for your crop and soil test. This calculator estimates total quantity only; it does not replace agronomic advice.": "अपनी फसल और मिट्टी जांच के अनुसार सुझाई गई मात्रा लें। यह कैलकुलेटर केवल कुल मात्रा बताता है; कृषि विशेषज्ञ की सलाह का विकल्प नहीं है।",
    "Plan around the forecast": "मौसम के अनुसार योजना बनाएं", "A few simple reminders for your fields.": "आपके खेत के लिए कुछ आसान सुझाव।",
    "Check rain before spraying": "छिड़काव से पहले बारिश जांचें", "Rain can wash treatments off leaves. Follow the product label.": "बारिश से पत्तियों पर छिड़का पदार्थ धुल सकता है। उत्पाद के निर्देश पढ़ें।",
    "Check soil moisture": "मिट्टी की नमी जांचें", "Avoid watering if the soil is still moist below the surface.": "अगर सतह के नीचे मिट्टी नम है, तो पानी देने से बचें।",
    "Keep a field record": "खेत का रिकॉर्ड रखें", "Note what you used and when to plan your next crop cycle.": "अगली फसल की योजना के लिए उपयोग की गई चीजें और तारीख लिखें।",
    "Field efficiency checklist": "खेत दक्षता सूची", "A practical starting point, not a farm score.": "काम शुरू करने के लिए उपयोगी सूची, खेत का स्कोर नहीं।",
    "Soil test completed for this season": "इस मौसम के लिए मिट्टी जांच पूरी हुई",
    "Irrigation checked against rainfall": "बारिश के अनुसार सिंचाई जांची गई",
    "Input amounts recorded by field": "खेत के अनुसार सामग्री की मात्रा दर्ज की गई",
    "Crop rotation planned after harvest": "कटाई के बाद फसल चक्र की योजना बनाई गई",
    "For your next growing season": "आने वाले फसल मौसम के लिए", "Farm essentials": "खेती के जरूरी सामान",
    "Browse a small demo catalog of common farm supplies.": "खेती की आम जरूरतों की छोटी डेमो सूची देखें।",
    "Certified wheat seeds": "प्रमाणित गेहूं के बीज", "Neem-based bio-fertilizer": "नीम आधारित जैव उर्वरक",
    "Drip irrigation starter kit": "ड्रिप सिंचाई शुरुआती किट", "Popular": "लोकप्रिय",
    "Organic": "जैविक", "Save 12%": "12% बचाएं", "Add to basket": "टोकरी में जोड़ें",
    "Community buying is coming soon": "सामूहिक खरीद जल्द आ रही है",
    "Group orders and local supplier listings will be available here.": "समूह ऑर्डर और स्थानीय विक्रेताओं की सूची यहां उपलब्ध होगी।",
    "Your farm details": "आपके खेत की जानकारी", "Choose your state, district and village to get local weather.": "स्थानीय मौसम पाने के लिए अपना राज्य, जिला और गांव चुनें।",
    "Your name": "आपका नाम", "State / union territory": "राज्य / केंद्र शासित प्रदेश",
    "Type a district or nearby town": "जिला या पास के शहर का नाम लिखें",
    "Searching districts...": "जिले खोजे जा रहे हैं...", "near": "के पास",
    "Selected district:": "चुना गया जिला:", "Village / town": "गांव / शहर", "(optional)": "(वैकल्पिक)",
    "Type your village or town": "अपने गांव या शहर का नाम लिखें",
    "Searching villages and towns...": "गांव और शहर खोजे जा रहे हैं...",
    "Select a district first": "पहले जिला चुनें", "Weather coordinates selected for": "मौसम के लिए स्थान चुना गया:",
    "Farm size (acres)": "खेत का आकार (एकड़)",
    "Save my farm": "मेरे खेत की जानकारी सहेजें",
    "Locations are searched from a global geocoding directory. You can update these details anytime.": "स्थान वैश्विक भौगोलिक निर्देशिका से खोजे जाते हैं। आप यह जानकारी कभी भी बदल सकते हैं।",
    "Click or drop to change": "बदलने के लिए क्लिक करें या तस्वीर छोड़ें",
    "Close-up of healthy green crop leaves": "स्वस्थ हरी फसल की पत्तियों का नजदीकी दृश्य",
    "Selected crop leaf preview": "चुनी गई फसल की पत्ती का पूर्वावलोकन",
    "Gemini AI screening": "Gemini एआई जांच", "Crop image submitted for screening": "जांच के लिए भेजी गई फसल की तस्वीर",
    "Soil testing and lab services": "मिट्टी जांच और प्रयोगशाला सेवाएं",
    "10-digit mobile number": "10 अंकों का मोबाइल नंबर",
    "Refresh nearby labs": "पास की प्रयोगशालाओं को रीफ्रेश करें",
    "Map listings may be incomplete. Search a wider area or check the map for local government and university labs.": "नक्शे की सूची अधूरी हो सकती है। बड़े क्षेत्र में खोजें या स्थानीय सरकारी और विश्वविद्यालय प्रयोगशालाओं का नक्शा देखें।",
    "Expanded sample data": "विस्तृत नमूना डेटा", "Data.gov.in live": "Data.gov.in लाइव",
    "results": "परिणाम", "Mandi rates across India": "भारत भर के मंडी भाव",
    "records": "रिकॉर्ड", "These are sample prices for demonstration, not live mandi quotes. Add Data.gov.in API credentials to see official records. The sample directory covers 16 crops across 18 markets and states.": "ये प्रदर्शन के लिए नमूना भाव हैं, लाइव मंडी भाव नहीं। आधिकारिक रिकॉर्ड देखने के लिए Data.gov.in API क्रेडेंशियल जोड़ें। नमूना सूची में 18 बाजारों और राज्यों की 16 फसलें हैं।",
    "Crop & variety": "फसल और किस्म", "Change": "बदलाव", "Loading mandi rates...": "मंडी भाव लोड हो रहे हैं...",
    "No mandi records match these filters. Try clearing a filter or selecting another crop.": "इन फ़िल्टर से कोई मंडी रिकॉर्ड नहीं मिला। फ़िल्टर हटाएं या दूसरी फसल चुनें।",
    "Page": "पृष्ठ", "of": "में से", "Previous": "पिछला", "Next": "अगला",
    "Select a state to narrow the crop, district, and mandi options.": "फसल, जिले और मंडी के विकल्प सीमित करने के लिए राज्य चुनें।",
    "Crop and district options for {state}; mandis follow the selected district.": "{state} के लिए फसल और जिला विकल्प; मंडियां चुने गए जिले के अनुसार हैं।",
    "9:00 am – 11:00 am": "सुबह 9:00 – 11:00", "11:00 am – 1:00 pm": "सुबह 11:00 – दोपहर 1:00",
    "2:00 pm – 4:00 pm": "दोपहर 2:00 – 4:00", "e.g. Ravi Patil": "जैसे, रवि पाटिल",
    "For up to 1 acre": "1 एकड़ तक", "HD 2967 · 40 kg bag": "HD 2967 · 40 किलो का बैग",
    "Organic · 5 litre pack": "जैविक · 5 लीटर पैक",
    kg: "किलो", "per acre": "प्रति एकड़", "Market outlook": "बाजार का रुझान",
    "WATCH THE MARKET": "बाजार पर नजर रखें",
    "{crop} prices are up recently in {market}. Compare nearby markets and storage costs before deciding when to sell.": "{market} में हाल में {crop} के भाव बढ़े हैं। बेचने का समय तय करने से पहले पास की मंडियों और भंडारण लागत की तुलना करें।",
    "{crop} prices are moving gradually. Check arrivals and local prices again before making a sale decision.": "{crop} के भाव में धीरे-धीरे बदलाव हो रहा है। बिक्री का फैसला करने से पहले आवक और स्थानीय भाव फिर जांचें।",
    "This is a simple trend summary, not a guaranteed forecast. Prices can change quickly and vary by quality and market.": "यह केवल रुझान का सार है, पक्का पूर्वानुमान नहीं। भाव जल्दी बदल सकते हैं और गुणवत्ता व मंडी के अनुसार अलग हो सकते हैं।",
    "Showing": "दिखाए जा रहे हैं",
    "Voice input isn't available in this browser. You can type your question instead.": "इस ब्राउज़र में आवाज से सवाल पूछना उपलब्ध नहीं है। आप सवाल टाइप कर सकते हैं।",
    "I couldn't hear that clearly. Please try again.": "आपकी आवाज स्पष्ट सुनाई नहीं दी। कृपया फिर से कोशिश करें।"
  },
  Marathi: {
    Dashboard: "डॅशबोर्ड", "Crop doctor": "पीक डॉक्टर", "Soil testing": "माती परीक्षण",
    "Mandi prices": "बाजारभाव", "Farm planner": "शेती नियोजन", "Farm shop": "शेती दुकान",
    "Your farm, in good hands": "तुमच्या शेतीची योग्य काळजी", "YOUR FARM": "तुमची शेती",
    "Here for your farm": "तुमच्या शेतीसाठी", "Talk to our agronomist assistant whenever you need a hand.": "शेतीविषयक मदतीसाठी आमच्या सहाय्यकाशी कधीही बोला.",
    "Ask a question": "प्रश्न विचारा", "Choose language": "भाषा निवडा",
    "Good morning,": "शुभ सकाळ,", "Here's what's happening on your farm today.": "आज तुमच्या शेतात काय सुरू आहे ते पहा.",
    "My farm": "माझे शेत", "Good day to check your crop rows.": "पिकांच्या ओळी तपासण्यासाठी आजचा दिवस चांगला आहे.",
    "Humidity": "आर्द्रता", "Rain chance": "पावसाची शक्यता", "Wind": "वारा",
    "YOUR DAILY BRIEF": "आजची माहिती", "Farm weather, in a minute": "एका मिनिटात शेती हवामान",
    "Listen to briefing": "माहिती ऐका", "Pause briefing": "थांबवा", "Resume briefing": "पुन्हा ऐका", "Replay": "पुन्हा ऐका",
    "7-day forecast": "७ दिवसांचा अंदाज", "Plan field work around the weather": "हवामानानुसार शेतकामाचे नियोजन करा",
    "Choose farm": "शेत निवडा", "Use my location": "माझे स्थान वापरा",
    "Field tip:": "शेत सल्ला:", "Your farm at a glance": "तुमच्या शेतीची झलक",
    "A quick look at your fields": "तुमच्या शेतांची थोडक्यात माहिती", "Cultivated area": "लागवडीचे क्षेत्र",
    "Main crop": "मुख्य पीक", "Next field task": "पुढील शेतकाम", "Tomorrow": "उद्या",
    "Walk the field and check soil moisture before irrigation.": "सिंचनापूर्वी शेतात फेरफटका मारून जमिनीतील ओलावा तपासा.",
    "Today's mandi snapshot": "आजचे बाजारभाव", "Latest sample modal prices · ₹ per quintal": "नमुना बाजारभाव · ₹ प्रति क्विंटल",
    "All prices": "सर्व भाव", "Quick actions": "जलद कृती", "Tools for your next field visit": "पुढील शेतभेटीसाठी साधने",
    "Scan a crop problem": "पिकाची समस्या तपासा", "Get a quick plant health check": "पिकाच्या आरोग्याची त्वरित तपासणी करा",
    "Book a soil test": "माती परीक्षण बुक करा", "Find a nearby testing lab": "जवळची परीक्षण प्रयोगशाळा शोधा",
    "Plan fertilizer use": "खत वापराचे नियोजन", "Estimate amounts for your fields": "तुमच्या शेतासाठी योग्य मात्रा जाणून घ्या",
    "Select a language": "भाषा निवडा", "Light mode": "लाइट मोड", "Dark mode": "डार्क मोड",
    "Your farm": "तुमची शेती", "Local weather": "स्थानिक हवामान", "Saved forecast": "जतन केलेला अंदाज",
    "Weather loading": "हवामान लोड होत आहे", "Search crops, markets...": "पिके, बाजार शोधा...",
    "Search crops and markets": "पिके आणि बाजार शोधा", "Search": "शोधा", "Weather": "हवामान",
    "Notifications": "सूचना", "Edit farm profile": "शेतीची माहिती संपादित करा",
    "Welcome back": "पुन्हा स्वागत आहे", "Your farm overview, crop recommendations, and market insights in one place.": "तुमच्या शेतीची माहिती, पीक शिफारसी आणि बाजारभाव एकाच ठिकाणी.",
    "Practical insights for your farm": "तुमच्या शेतीसाठी उपयुक्त माहिती",
    "Grow Smarter. Sell Better.": "स्मार्ट शेती करा. चांगले विक्री करा.",
    "Your intelligent companion for healthier crops, smarter farming decisions, and better market opportunities.": "निरोगी पिके, योग्य शेती निर्णय आणि चांगल्या बाजार संधींसाठी तुमचा विश्वासू साथीदार.",
    "Explore crop insights": "पीक मार्गदर्शन पहा", "Check market prices": "बाजारभाव तपासा",
    "SEASONAL GUIDE": "हंगामी मार्गदर्शक", "Crop ideas to explore": "पाहण्यासारखी पिके",
    "General growing guides, not a soil diagnosis": "सामान्य शेती मार्गदर्शन, माती परीक्षण नाही",
    "SAMPLE": "नमुना", "LIVE": "थेट", "market price": "बाजारभाव", "per quintal": "प्रति क्विंटल",
    "Open mandi insights for available prices": "उपलब्ध भावांसाठी बाजार माहिती उघडा",
    "Weather conditions": "हवामानाची स्थिती", "Screening result ready": "पीक तपासणीचा निकाल तयार",
    "No crop scans yet": "अद्याप पीक तपासणी नाही", "Screening aid · not a confirmed diagnosis": "प्राथमिक तपासणी · निश्चित निदान नाही",
    "Scan a plant to check for possible issues": "संभाव्य समस्यांसाठी रोप तपासा",
    "EXPLORE YOUR OPTIONS": "तुमचे पर्याय पहा", "Seasonal crop guide": "हंगामी पीक मार्गदर्शक",
    "Starting points for planning. Confirm local suitability with your soil report or KVK.": "नियोजनासाठी सुरुवातीचे मार्गदर्शन. माती अहवाल किंवा कृषी विज्ञान केंद्राकडून स्थानिक उपयुक्तता तपासा.",
    "General guidance · not personalized": "सामान्य मार्गदर्शन · वैयक्तिक नाही", "Soil guide": "माती मार्गदर्शन",
    "Growing duration": "वाढीचा कालावधी", "Indicative mandi modal price · ₹/quintal": "अंदाजित बाजारभाव · ₹/क्विंटल",
    "sample data": "नमुना माहिती", "live data": "थेट माहिती", "No price available for this crop": "या पिकाचा भाव उपलब्ध नाही",
    "Ask about": "याबद्दल विचारा:", "Your Smart Farming Assistant": "तुमचा स्मार्ट शेती सहाय्यक",
    "Get guidance on crop selection, soil health, pest management, irrigation, and market opportunities.": "पीक निवड, मातीचे आरोग्य, कीड व्यवस्थापन, सिंचन आणि बाजार संधींबाबत मार्गदर्शन मिळवा.",
    "Which crop is suitable for my soil?": "माझ्या जमिनीसाठी कोणते पीक योग्य आहे?",
    "How can I identify crop diseases?": "मी पिकांचे रोग कसे ओळखू शकतो?",
    "Which mandi offers a better price?": "कोणत्या बाजारात चांगला भाव मिळतो?",
    "When should I irrigate my crops?": "मी पिकांना पाणी कधी द्यावे?",
    "Ask about your farm...": "तुमच्या शेतीबद्दल विचारा...", "Ask the farming assistant": "शेती सहाय्यकाला विचारा",
    "Answers are general information. Confirm important decisions with local agricultural experts.": "उत्तरे सामान्य माहिती आहेत. महत्त्वाचे निर्णय स्थानिक कृषी तज्ज्ञांकडून तपासून घ्या.",
    "PLANT HEALTH": "पीक आरोग्य", "A closer look can help": "जवळून तपासल्यास मदत होईल",
    "Upload a clear leaf photo for an AI screening. Results are a starting point, not a confirmed diagnosis.": "एआय तपासणीसाठी पानाचा स्पष्ट फोटो अपलोड करा. निकाल प्राथमिक संकेत आहेत, निश्चित निदान नाही.",
    "Open crop doctor": "पीक डॉक्टर उघडा", "Feels like": "जाणवते",
    "Checking today's forecast and field conditions...": "आजचा हवामान अंदाज आणि शेताची स्थिती तपासत आहे...",
    "Check the latest forecast before field work.": "शेतात काम करण्यापूर्वी ताजा हवामान अंदाज तपासा.",
    "Sample modal prices": "नमुना बाजारभाव", "Live modal prices": "थेट बाजारभाव",
    "today": "आज", "Basket": "टोपली", "Ask an agronomist": "कृषी तज्ज्ञांना विचारा",
    "Open AI farm assistant": "एआय शेती सहाय्यक उघडा", "Farm assistant": "शेती सहाय्यक",
    "Agriculture information, made simple": "शेतीविषयक माहिती, सोप्या भाषेत", "Close assistant": "सहाय्यक बंद करा",
    "Thinking...": "विचार करत आहे...", "Speak your question": "तुमचा प्रश्न बोला", "Send question": "प्रश्न पाठवा",
    "Ask about your crops...": "तुमच्या पिकांबद्दल विचारा...",
    "Open navigation": "नेव्हिगेशन उघडा", "Close menu": "मेनू बंद करा",
    "Rabi · Oct–Dec": "रब्बी · ऑक्टोबर–डिसेंबर", "Kharif · Jun–Aug": "खरीप · जून–ऑगस्ट",
    "Well-drained loam": "चांगला निचरा होणारी पोयट्याची माती", "Clay or alluvial soil": "चिकणमाती किंवा गाळाची माती",
    "Loose, well-drained loam": "भुसभुशीत, चांगला निचरा होणारी पोयट्याची माती",
    "110–140 days": "110–140 दिवस", "120–150 days": "120–150 दिवस", "100–120 days": "100–120 दिवस",
    "Today": "आज", "Sun": "रवि", "Mon": "सोम", "Tue": "मंगळ", "Wed": "बुध", "Thu": "गुरु", "Fri": "शुक्र",
    "Clear sky": "निरभ्र आकाश", "Partly cloudy": "अंशतः ढगाळ", "Overcast": "ढगाळ",
    "Fog": "धुके", "Drizzle or rain": "रिमझिम किंवा पाऊस", "Rain showers": "पावसाच्या सरी",
    "Thunderstorms": "वादळी पाऊस", "Snow": "हिमवृष्टी", "Snow showers": "हिमवृष्टीच्या सरी",
    "Current conditions": "सध्याची स्थिती", "Loading weather": "हवामान लोड होत आहे",
    "Conditions look mostly dry. Check soil moisture before your next irrigation.": "हवामान बहुतेक कोरडे आहे. पुढील सिंचनापूर्वी जमिनीतील ओलावा तपासा.",
    "Rain is likely on": "या दिवशी पावसाची शक्यता आहे:",
    "Avoid spraying pesticides before or during the showers.": "पावसापूर्वी किंवा पाऊस सुरू असताना कीटकनाशकांची फवारणी करू नका.",
    "Ask": "विचारा",
    "What should I consider before growing {crop} near {location}?": "{location} जवळ {crop} लावण्यापूर्वी मी कोणत्या गोष्टींचा विचार करावा?",
    Wheat: "गहू", Rice: "भात", Onion: "कांदा", Cotton: "कापूस", Tomato: "टोमॅटो", Potato: "बटाटा",
    rain: "पाऊस",
    "AI crop health doctor": "एआय पीक आरोग्य डॉक्टर",
    "Take a clear photo of a leaf or affected plant. We'll help you understand what might be happening.": "पानाचा किंवा बाधित रोपाचा स्पष्ट फोटो घ्या. संभाव्य समस्या समजून घेण्यास आम्ही मदत करू.",
    "What crop are you checking?": "तुम्ही कोणते पीक तपासत आहात?",
    "Upload or take a photo": "फोटो अपलोड करा किंवा काढा",
    "Drop an image here, or browse · JPG, PNG or WebP · up to 10 MB": "प्रतिमा येथे टाका किंवा निवडा · JPG, PNG किंवा WebP · कमाल 10 MB",
    "Checking your crop...": "तुमचे पीक तपासत आहे...", "Check crop health": "पीक आरोग्य तपासा",
    "Your photo is used only to provide this result. This tool is a screening aid, not a confirmed diagnosis.": "तुमचा फोटो फक्त हा निकाल देण्यासाठी वापरला जातो. हे प्राथमिक परीक्षण आहे, निश्चित निदान नाही.",
    "Your crop check will appear here": "पीक तपासणीचा निकाल येथे दिसेल",
    "Upload a clear photo in natural light. Try to include both healthy and affected leaves.": "नैसर्गिक प्रकाशात स्पष्ट फोटो अपलोड करा. निरोगी आणि बाधित दोन्ही पाने समाविष्ट करा.",
    "Clear, close-up photo": "स्पष्ट, जवळून घेतलेला फोटो", "Good natural light": "चांगला नैसर्गिक प्रकाश",
    "One plant at a time": "एका वेळी एक रोप", "concern": "संबंधित चिंता",
    "Sample screening": "नमुना परीक्षण", "confidence": "विश्वास पातळी", "What to look for": "काय पाहावे",
    "Gentle first steps": "सुरक्षित प्राथमिक उपाय", "Chemical treatment": "रासायनिक उपचार", "Prevention": "प्रतिबंध",
    "Choose a nearby lab and a time that works for you.": "जवळची प्रयोगशाळा आणि तुम्हाला सोयीची वेळ निवडा.",
    "Request confirmed": "विनंतीची पुष्टी झाली", "Demo request created": "डेमो विनंती तयार झाली",
    "Your appointment is saved. Show this token at the lab or mention it when arranging pickup.": "तुमची भेट जतन झाली आहे. प्रयोगशाळेत हा टोकन दाखवा किंवा नमुना घेण्याची व्यवस्था करताना सांगा.",
    "This demo token is not saved yet. Connect a database to keep appointment records.": "हा डेमो टोकन अद्याप जतन झालेला नाही. भेटींची नोंद ठेवण्यासाठी डेटाबेस जोडा.",
    "Your appointment token": "तुमचा भेट टोकन", "Book another test": "दुसरी तपासणी बुक करा",
    "Mobile number": "मोबाइल क्रमांक", "Crop to test": "तपासणीचे पीक", "Preferred date": "पसंतीची तारीख",
    "Time slot": "वेळ", "How would you like to test?": "तुम्हाला तपासणी कशी करायची आहे?",
    "Visit the lab": "प्रयोगशाळेला भेट द्या", "Bring your soil sample": "मातीचा नमुना आणा",
    "Sample pickup": "नमुना घेऊन जाणे", "Lab will confirm availability": "प्रयोगशाळा उपलब्धतेची पुष्टी करेल",
    "Soil testing lab": "माती परीक्षण प्रयोगशाळा", "Choose a nearby lab or enter a lab name": "जवळची प्रयोगशाळा निवडा किंवा नाव भरा",
    "Enter a soil testing lab name": "माती परीक्षण प्रयोगशाळेचे नाव भरा",
    "Request appointment": "भेटीची विनंती करा", "Nearby soil labs": "जवळच्या माती परीक्षण प्रयोगशाळा",
    "Refresh": "रीफ्रेश करा", "OpenStreetMap nearby-place results · ordered by distance": "OpenStreetMap वरील जवळची ठिकाणे · अंतरानुसार",
    "Looking for agriculture and soil-testing facilities near your farm...": "तुमच्या शेताजवळ कृषी आणि माती परीक्षण केंद्रे शोधत आहे...",
    "No soil-testing facilities were listed nearby.": "जवळ माती परीक्षण केंद्रांची नोंद आढळली नाही.",
    "Address not listed": "पत्ता दिलेला नाही", "Select for booking": "बुकिंगसाठी निवडा",
    "Map": "नकाशा", "Directions": "मार्गदर्शन", "Search soil labs on Google Maps": "Google Maps वर माती परीक्षण केंद्रे शोधा",
    "Why test your soil?": "माती परीक्षण का करावे?",
    "Listings come from OpenStreetMap and may be incomplete or unverified. Call the facility to confirm soil testing services and availability.": "याद्या OpenStreetMap मधून घेतल्या आहेत आणि अपूर्ण किंवा अप्रमाणित असू शकतात. माती परीक्षण सेवा आणि उपलब्धतेची खात्री करण्यासाठी केंद्राला फोन करा.",
    "A soil test measures pH and nutrients so you can make informed fertilizer choices and avoid unnecessary inputs. Ask the lab for a soil health card with your results.": "माती परीक्षणामुळे pH आणि पोषकद्रव्ये समजतात. त्यामुळे योग्य खत निवडता येते आणि अनावश्यक खर्च टाळता येतो. निकालांसह प्रयोगशाळेकडून मृदा आरोग्य पत्रिका मागा.",
    "km away": "किमी अंतरावर", "Lab search radius": "प्रयोगशाळा शोधण्याचे अंतर",
    "Close farm profile": "शेतीची माहिती बंद करा",
    "Mandi market insights": "मंडी बाजार माहिती", "Search mandi prices for multiple crops across India.": "भारतभरातील विविध पिकांचे बाजारभाव शोधा.",
    "Find crop prices": "पिकांचे भाव शोधा", "Filter by commodity and mandi location. Leave blank to browse all available records.": "पीक आणि मंडी ठिकाणानुसार फिल्टर करा. सर्व नोंदी पाहण्यासाठी रिकामे ठेवा.",
    "State": "राज्य", "All states": "सर्व राज्ये", "Crop": "पीक", "All crops": "सर्व पिके",
    "All districts": "सर्व जिल्हे", "Select a state first": "प्रथम राज्य निवडा",
    "Mandi": "मंडी", "All mandis in district": "जिल्ह्यातील सर्व मंड्या", "All mandis in state": "राज्यातील सर्व मंड्या",
    "Search all fields": "सर्व क्षेत्रांत शोधा", "Crop, variety, location...": "पीक, जात, ठिकाण...",
    "Loading available crops, districts, and mandis...": "उपलब्ध पिके, जिल्हे आणि मंड्या लोड होत आहेत...",
    "Clear all filters": "सर्व फिल्टर काढा", "Price trend": "भावाचा कल",
    "Recent mandi modal price · ₹ per quintal": "अलीकडील मंडी भाव · ₹ प्रति क्विंटल",
    "Choose crop and mandi for price trend": "भावाचा कल पाहण्यासाठी पीक आणि मंडी निवडा",
    "Modal price": "प्रचलित भाव", "Today's change": "आजचा बदल", "Price history is not available for this record.": "या नोंदीसाठी भावाचा इतिहास उपलब्ध नाही.",
    "Markets on this page": "या पृष्ठावरील बाजार", "Select any crop and mandi for the chart": "आलेखासाठी कोणतेही पीक आणि मंडी निवडा",
    "No matching mandi records.": "जुळणाऱ्या मंडी नोंदी आढळल्या नाहीत.",
    "Plan with your field in mind": "शेताचा विचार करून नियोजन करा",
    "Estimate inputs, check the forecast, and keep practical field notes together.": "निविष्ठांचा अंदाज घ्या, हवामान तपासा आणि शेताच्या नोंदी एकत्र ठेवा.",
    "Field input calculator": "शेत निविष्ठा कॅल्क्युलेटर", "Estimate amounts from your own per-acre recommendation.": "तुमच्या प्रति एकर शिफारसीनुसार प्रमाणाचा अंदाज घ्या.",
    "Farm area": "शेताचे क्षेत्रफळ", "acres": "एकर", "acre": "एकर", "Fertilizer recommendation per acre (kg)": "प्रति एकर खताची शिफारस (किलो)",
    "Reduce fertilizer rate": "खताचे प्रमाण कमी करा", "Increase fertilizer rate": "खताचे प्रमाण वाढवा",
    "Input type": "निविष्ठेचा प्रकार", "NPK fertilizer": "एनपीके खत",
    "Compost / organic manure": "कंपोस्ट / सेंद्रिय खत", "Seed quantity": "बियाण्यांचे प्रमाण",
    "Estimated quantity for your farm": "तुमच्या शेतासाठी अंदाजित प्रमाण",
    "Based on": "आधारित", "kg / acre": "किलो / एकर",
    "Use the rate recommended for your crop and soil test. This calculator estimates total quantity only; it does not replace agronomic advice.": "तुमच्या पीक आणि माती परीक्षणानुसार शिफारस केलेले प्रमाण वापरा. हे साधन फक्त एकूण प्रमाण मोजते; कृषी तज्ज्ञांच्या सल्ल्याचा पर्याय नाही.",
    "Plan around the forecast": "हवामानानुसार नियोजन करा", "A few simple reminders for your fields.": "तुमच्या शेतासाठी काही सोप्या सूचना.",
    "Check rain before spraying": "फवारणीपूर्वी पाऊस तपासा", "Rain can wash treatments off leaves. Follow the product label.": "पावसामुळे पानांवरील औषध धुऊन जाऊ शकते. उत्पादनावरील सूचना पाळा.",
    "Check soil moisture": "जमिनीतील ओलावा तपासा", "Avoid watering if the soil is still moist below the surface.": "पृष्ठभागाखाली माती ओलसर असल्यास पाणी देणे टाळा.",
    "Keep a field record": "शेताची नोंद ठेवा", "Note what you used and when to plan your next crop cycle.": "पुढील पीक चक्राचे नियोजन करण्यासाठी वापरलेली सामग्री आणि तारीख नोंदवा.",
    "Field efficiency checklist": "शेती कार्यक्षमता तपासणीसूची", "A practical starting point, not a farm score.": "काम सुरू करण्यासाठी उपयुक्त सूची, शेतीचा गुण नाही.",
    "Soil test completed for this season": "या हंगामासाठी माती परीक्षण पूर्ण",
    "Irrigation checked against rainfall": "पावसाच्या अंदाजानुसार सिंचन तपासले",
    "Input amounts recorded by field": "शेतानुसार निविष्ठांचे प्रमाण नोंदवले",
    "Crop rotation planned after harvest": "कापणीनंतर पीक फेरपालटाचे नियोजन",
    "For your next growing season": "पुढील हंगामासाठी", "Farm essentials": "शेतीसाठी आवश्यक वस्तू",
    "Browse a small demo catalog of common farm supplies.": "शेतीच्या सामान्य वस्तूंची छोटी डेमो सूची पहा.",
    "Certified wheat seeds": "प्रमाणित गव्हाचे बियाणे", "Neem-based bio-fertilizer": "कडुनिंबावर आधारित जैवखत",
    "Drip irrigation starter kit": "ठिबक सिंचन प्रारंभिक संच", "Popular": "लोकप्रिय",
    "Organic": "सेंद्रिय", "Save 12%": "12% बचत", "Add to basket": "टोपलीत जोडा",
    "Community buying is coming soon": "सामूहिक खरेदी लवकरच येत आहे",
    "Group orders and local supplier listings will be available here.": "गट ऑर्डर आणि स्थानिक पुरवठादारांची यादी येथे उपलब्ध होईल.",
    "Your farm details": "तुमच्या शेतीची माहिती", "Choose your state, district and village to get local weather.": "स्थानिक हवामानासाठी राज्य, जिल्हा आणि गाव निवडा.",
    "Your name": "तुमचे नाव", "State / union territory": "राज्य / केंद्रशासित प्रदेश",
    "Type a district or nearby town": "जिल्हा किंवा जवळचे शहर टाइप करा",
    "Searching districts...": "जिल्हे शोधत आहे...", "near": "जवळ",
    "Selected district:": "निवडलेला जिल्हा:", "Village / town": "गाव / शहर", "(optional)": "(ऐच्छिक)",
    "Type your village or town": "तुमचे गाव किंवा शहर टाइप करा",
    "Searching villages and towns...": "गावे आणि शहरे शोधत आहे...",
    "Select a district first": "प्रथम जिल्हा निवडा", "Weather coordinates selected for": "हवामानासाठी ठिकाण निवडले:",
    "Farm size (acres)": "शेताचा आकार (एकर)",
    "Save my farm": "माझ्या शेतीची माहिती जतन करा",
    "Locations are searched from a global geocoding directory. You can update these details anytime.": "ठिकाणे जागतिक जिओकोडिंग निर्देशिकेतून शोधली जातात. ही माहिती कधीही बदलू शकता.",
    "Click or drop to change": "बदलण्यासाठी क्लिक करा किंवा फोटो टाका",
    "Close-up of healthy green crop leaves": "निरोगी हिरव्या पिकाच्या पानांचे जवळचे दृश्य",
    "Selected crop leaf preview": "निवडलेल्या पिकाच्या पानाचे पूर्वावलोकन",
    "Gemini AI screening": "Gemini एआय परीक्षण", "Crop image submitted for screening": "तपासणीसाठी पाठवलेला पिकाचा फोटो",
    "Soil testing and lab services": "माती परीक्षण आणि प्रयोगशाळा सेवा",
    "10-digit mobile number": "10 अंकी मोबाइल क्रमांक",
    "Refresh nearby labs": "जवळच्या प्रयोगशाळा रीफ्रेश करा",
    "Map listings may be incomplete. Search a wider area or check the map for local government and university labs.": "नकाशावरील यादी अपूर्ण असू शकते. मोठ्या क्षेत्रात शोधा किंवा स्थानिक सरकारी आणि विद्यापीठ प्रयोगशाळा नकाशावर तपासा.",
    "Expanded sample data": "विस्तारित नमुना माहिती", "Data.gov.in live": "Data.gov.in थेट",
    "results": "निकाल", "Mandi rates across India": "भारतभरातील मंडी भाव",
    "records": "नोंदी", "These are sample prices for demonstration, not live mandi quotes. Add Data.gov.in API credentials to see official records. The sample directory covers 16 crops across 18 markets and states.": "हे प्रात्यक्षिकासाठी नमुना भाव आहेत, थेट मंडी भाव नाहीत. अधिकृत नोंदी पाहण्यासाठी Data.gov.in API क्रेडेन्शियल्स जोडा. नमुना यादीत 18 बाजार आणि राज्यांतील 16 पिके आहेत.",
    "Crop & variety": "पीक आणि जात", "Change": "बदल", "Loading mandi rates...": "मंडी भाव लोड होत आहेत...",
    "No mandi records match these filters. Try clearing a filter or selecting another crop.": "या फिल्टरशी जुळणाऱ्या मंडी नोंदी नाहीत. फिल्टर काढा किंवा दुसरे पीक निवडा.",
    "Page": "पृष्ठ", "of": "पैकी", "Previous": "मागील", "Next": "पुढील",
    "Select a state to narrow the crop, district, and mandi options.": "पीक, जिल्हा आणि मंडीचे पर्याय मर्यादित करण्यासाठी राज्य निवडा.",
    "Crop and district options for {state}; mandis follow the selected district.": "{state} साठी पीक आणि जिल्हा पर्याय; मंड्या निवडलेल्या जिल्ह्यानुसार आहेत.",
    "9:00 am – 11:00 am": "सकाळी 9:00 – 11:00", "11:00 am – 1:00 pm": "सकाळी 11:00 – दुपारी 1:00",
    "2:00 pm – 4:00 pm": "दुपारी 2:00 – 4:00", "e.g. Ravi Patil": "उदा. रवी पाटील",
    "For up to 1 acre": "1 एकरपर्यंत", "HD 2967 · 40 kg bag": "HD 2967 · 40 किलोची पिशवी",
    "Organic · 5 litre pack": "सेंद्रिय · 5 लिटर पॅक",
    kg: "किलो", "per acre": "प्रति एकर", "Market outlook": "बाजाराचा कल",
    "WATCH THE MARKET": "बाजारावर लक्ष ठेवा",
    "{crop} prices are up recently in {market}. Compare nearby markets and storage costs before deciding when to sell.": "{market} येथे अलीकडे {crop} चे भाव वाढले आहेत. विक्रीची वेळ ठरवण्यापूर्वी जवळचे बाजार आणि साठवण खर्च तपासा.",
    "{crop} prices are moving gradually. Check arrivals and local prices again before making a sale decision.": "{crop} चे भाव हळूहळू बदलत आहेत. विक्रीचा निर्णय घेण्यापूर्वी आवक आणि स्थानिक भाव पुन्हा तपासा.",
    "This is a simple trend summary, not a guaranteed forecast. Prices can change quickly and vary by quality and market.": "हा फक्त कलाचा सारांश आहे, खात्रीशीर अंदाज नाही. भाव लवकर बदलू शकतात आणि गुणवत्ता व बाजारानुसार वेगळे असू शकतात.",
    "Showing": "दाखवत आहे",
    "Voice input isn't available in this browser. You can type your question instead.": "या ब्राउझरमध्ये आवाजाद्वारे प्रश्न विचारता येत नाही. तुम्ही प्रश्न टाइप करू शकता.",
    "I couldn't hear that clearly. Please try again.": "तुमचा आवाज स्पष्ट ऐकू आला नाही. कृपया पुन्हा प्रयत्न करा."
  }
};

const crops = ["Wheat", "Rice", "Cotton", "Tomato", "Potato", "Onion"];
const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;
const marketKey = (record: MarketRecord) =>
  [record.crop, record.market, record.state, record.district ?? ""].join("|").toLowerCase();

function WeatherIcon({ kind, size = 20 }: { kind: string; size?: number }) {
  if (kind === "rain") return <CloudRain size={size} />;
  if (kind === "cloud") return <Cloud size={size} />;
  return <Sun size={size} />;
}

function CropPhoto({ guide }: { guide: CropGuide }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="crop-photo h-40 overflow-hidden bg-[#EAF2E6]">
      {failed ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-[#3F8554]" role="img" aria-label={guide.imageAlt}>
          <Sprout size={30} />
          <span className="text-xs font-semibold">{guide.crop}</span>
        </div>
      ) : (
        <img
          src={guide.image}
          alt={guide.imageAlt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function SectionPhoto({
  src,
  alt,
  className,
  imageClassName,
  fallback
}: {
  src: string;
  alt: string;
  className: string;
  imageClassName?: string;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={className}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center bg-[#EAF2E6]">{fallback}</div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={imageClassName ?? "h-full w-full object-cover"}
        />
      )}
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherError, setWeatherError] = useState("");
  const [marketRecords, setMarketRecords] = useState<MarketRecord[]>([]);
  const [marketSource, setMarketSource] = useState("sample");
  const [marketSearch, setMarketSearch] = useState("");
  const [marketFilterCrop, setMarketFilterCrop] = useState("");
  const [marketFilterState, setMarketFilterState] = useState("");
  const [marketFilterDistrict, setMarketFilterDistrict] = useState("");
  const [marketFilterMarket, setMarketFilterMarket] = useState("");
  const [marketPage, setMarketPage] = useState(0);
  const marketLimit = 50;
  const [marketTotal, setMarketTotal] = useState(0);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState("");
  const [marketFocus, setMarketFocus] = useState("");
  const [marketOptions, setMarketOptions] = useState<MarketOptions>({
    states: [],
    crops: [],
    districts: [],
    mandis: []
  });
  const [marketOptionsLoading, setMarketOptionsLoading] = useState(false);
  const [marketOptionsError, setMarketOptionsError] = useState("");
  const [farmerName, setFarmerName] = useState("Ravi");
  const [farmSize, setFarmSize] = useState(4);
  const [farmLocation, setFarmLocation] = useState("Nashik, Maharashtra");
  const [farmCoordinates, setFarmCoordinates] = useState({ lat: 19.99727, lon: 73.79096 });
  const [primaryCrop, setPrimaryCrop] = useState("Onion");
  const [language, setLanguage] = useState<Language>("English");
  const [theme, setTheme] = useState<Theme>("light");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardName, setOnboardName] = useState("Ravi");
  const [onboardSize, setOnboardSize] = useState("4");
  const [onboardCrop, setOnboardCrop] = useState("Wheat");
  const [onboardState, setOnboardState] = useState("Maharashtra");
  const [districtInput, setDistrictInput] = useState("Nashik");
  const [selectedDistrict, setSelectedDistrict] = useState("Nashik");
  const [selectedDistrictPlace, setSelectedDistrictPlace] = useState<LocationResult | null>({
    name: "Nashik",
    district: "Nashik",
    state: "Maharashtra",
    latitude: 19.99727,
    longitude: 73.79096
  });
  const [districtResults, setDistrictResults] = useState<LocationResult[]>([]);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [villageInput, setVillageInput] = useState("Nashik");
  const [selectedVillage, setSelectedVillage] = useState<LocationResult | null>({
    name: "Nashik",
    district: "Nashik",
    state: "Maharashtra",
    latitude: 19.99727,
    longitude: 73.79096
  });
  const [villageResults, setVillageResults] = useState<LocationResult[]>([]);
  const [villageLoading, setVillageLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechPaused, setSpeechPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageData, setImageData] = useState("");
  const [imageName, setImageName] = useState("");
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [diagnosisError, setDiagnosisError] = useState("");
  const [diagnosing, setDiagnosing] = useState(false);
  const [booking, setBooking] = useState({ name: "", phone: "", crop: "Wheat", visitType: "lab", date: "", slot: "09:00-11:00", lab: "" });
  const [bookingToken, setBookingToken] = useState("");
  const [bookingPersisted, setBookingPersisted] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [nearbyLabs, setNearbyLabs] = useState<NearbyLab[]>([]);
  const [labsLoading, setLabsLoading] = useState(false);
  const [labsError, setLabsError] = useState("");
  const [labRadius, setLabRadius] = useState(25000);
  const [acres, setAcres] = useState(4);
  const [fertilizerRate, setFertilizerRate] = useState(45);
  const [cartCount, setCartCount] = useState(0);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [uploadFocused, setUploadFocused] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Namaste! I'm your farm assistant. Ask me about crops, weather, or growing practices." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const marketRecord = marketRecords.find((record) => marketKey(record) === marketFocus) ?? marketRecords[0];

  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem("kisan-care-language");
      const savedTheme = window.localStorage.getItem("kisan-care-theme");
      if (savedLanguage === "Hindi" || savedLanguage === "Marathi" || savedLanguage === "English") setLanguage(savedLanguage);
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    } catch (error) {
      console.error("Display preferences could not be loaded:", error);
    } finally {
      setPreferencesLoaded(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language === "Hindi" ? "hi" : language === "Marathi" ? "mr" : "en";
    if (!preferencesLoaded) return;
    try {
      window.localStorage.setItem("kisan-care-language", language);
      window.localStorage.setItem("kisan-care-theme", theme);
    } catch (error) {
      console.error("Display preferences could not be saved:", error);
    }
  }, [language, theme, preferencesLoaded]);

  useEffect(() => {
    const welcome = language === "Hindi"
      ? "नमस्ते! मैं आपका कृषि सहायक हूँ। फसल, मौसम या खेती के बारे में पूछें।"
      : language === "Marathi"
        ? "नमस्कार! मी तुमचा शेती सहाय्यक आहे. पिके, हवामान किंवा शेतीविषयी विचारा."
        : "Namaste! I'm your farm assistant. Ask me about crops, weather, or growing practices.";
    setChatMessages((messages) =>
      messages.length === 1 && messages[0].role === "assistant"
        ? [{ role: "assistant", text: welcome }]
        : messages
    );
  }, [language]);

  useEffect(() => {
    let savedCoordinates: { lat: number; lon: number; location?: string } | undefined;
    try {
      const stored = window.localStorage.getItem("kisan-care-profile");
      if (stored) {
        const profile = JSON.parse(stored) as {
          name?: string; acres?: number; location?: string; crop?: string;
          state?: string; district?: string; village?: string; lat?: number; lon?: number;
        };
        if (profile.name) setFarmerName(profile.name);
        if (profile.acres) setFarmSize(profile.acres);
        if (profile.location) setFarmLocation(profile.location);
        if (profile.crop) setPrimaryCrop(profile.crop);
        if (profile.state && indianStates.includes(profile.state as (typeof indianStates)[number])) {
          setOnboardState(profile.state);
        }
        if (profile.district) {
          setDistrictInput(profile.district);
          setSelectedDistrict(profile.district);
          setSelectedDistrictPlace({
            name: profile.district,
            district: profile.district,
            state: profile.state ?? "",
            latitude: profile.lat ?? 19.99727,
            longitude: profile.lon ?? 73.79096
          });
        }
        if (profile.village) {
          setVillageInput(profile.village);
          setSelectedVillage({
            name: profile.village,
            district: profile.district ?? "",
            state: profile.state ?? "",
            latitude: profile.lat ?? 19.99727,
            longitude: profile.lon ?? 73.79096
          });
        }
        if (typeof profile.lat === "number" && typeof profile.lon === "number") {
          savedCoordinates = { lat: profile.lat, lon: profile.lon, location: profile.location };
          setFarmCoordinates({ lat: profile.lat, lon: profile.lon });
        }
      } else {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Farmer profile could not be loaded:", error);
    }
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
          console.error("Offline support could not be registered:", error);
        });
      } else {
        navigator.serviceWorker.getRegistrations().then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister()))
        ).catch((error: unknown) => {
          console.error("Development service worker could not be removed:", error);
        });
        caches.delete("kisan-care-shell-v1").catch((error: unknown) => {
          console.error("Development offline cache could not be removed:", error);
        });
      }
    }
    void loadWeather(savedCoordinates);
    void loadMarkets();
  }, []);

  useEffect(() => {
    const query = districtInput.trim();
    if (query.length < 2 || query.toLowerCase() === selectedDistrict.toLowerCase()) {
      setDistrictResults([]);
      return;
    }
    let active = true;
    const timer = window.setTimeout(async () => {
      setDistrictLoading(true);
      try {
        const response = await fetch(`/api/locations?q=${encodeURIComponent(query)}&state=${encodeURIComponent(onboardState)}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "District search failed.");
        if (active) setDistrictResults(result.results as LocationResult[]);
      } catch (error) {
        if (active) {
          console.error(error);
          setLocationError(error instanceof Error ? error.message : "District search failed.");
        }
      } finally {
        if (active) setDistrictLoading(false);
      }
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [districtInput, onboardState, selectedDistrict]);

  useEffect(() => {
    const query = villageInput.trim();
    if (!selectedDistrict || query.length < 2 || selectedVillage?.name.toLowerCase() === query.toLowerCase()) {
      setVillageResults([]);
      return;
    }
    let active = true;
    const timer = window.setTimeout(async () => {
      setVillageLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          state: onboardState,
          district: selectedDistrict
        });
        const response = await fetch(`/api/locations?${params.toString()}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Village search failed.");
        if (active) setVillageResults(result.results as LocationResult[]);
      } catch (error) {
        if (active) {
          console.error(error);
          setLocationError(error instanceof Error ? error.message : "Village search failed.");
        }
      } finally {
        if (active) setVillageLoading(false);
      }
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [villageInput, onboardState, selectedDistrict, selectedVillage]);

  useEffect(() => {
    if (tab !== "soil") return;
    const controller = new AbortController();
    void loadNearbyLabs(farmCoordinates, labRadius, controller.signal);
    return () => controller.abort();
  }, [tab, farmCoordinates.lat, farmCoordinates.lon, labRadius]);

  async function loadWeather(coords?: { lat: number; lon: number; location?: string }) {
    setWeatherError("");
    try {
      const search = new URLSearchParams();
      if (coords) {
        search.set("lat", String(coords.lat));
        search.set("lon", String(coords.lon));
        if (coords.location) search.set("location", coords.location);
      }
      const query = search.size ? `?${search.toString()}` : "";
      const response = await fetch(`/api/weather${query}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Weather information could not be loaded.");
      setWeather(result as Weather);
      window.localStorage.setItem("kisan-care-weather", JSON.stringify(result));
    } catch (error) {
      const savedWeather = window.localStorage.getItem("kisan-care-weather");
      if (savedWeather) {
        try {
          setWeather(JSON.parse(savedWeather) as Weather);
          setWeatherError("Live weather is unavailable; showing your last saved forecast.");
          return;
        } catch (storageError) {
          console.error("Saved weather could not be loaded:", storageError);
        }
      }
      setWeatherError(error instanceof Error ? error.message : "Weather information could not be loaded.");
    }
  }

  async function loadMarkets(
    filters: { crop?: string; state?: string; district?: string; market?: string; search?: string; offset?: number; signal?: AbortSignal } = {}
  ) {
    setMarketLoading(true);
    setMarketError("");
    try {
      const params = new URLSearchParams({
        limit: String(marketLimit),
        offset: String(filters.offset ?? 0)
      });
      if (filters.crop) params.set("crop", filters.crop);
      if (filters.state) params.set("state", filters.state);
      if (filters.district) params.set("district", filters.district);
      if (filters.market) params.set("market", filters.market);
      if (filters.search) params.set("search", filters.search);
      const response = await fetch(`/api/mandi?${params.toString()}`, { signal: filters.signal });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Market prices could not be loaded.");
      setMarketRecords(result.records as MarketRecord[]);
      setMarketSource(result.source);
      setMarketTotal(result.total as number);
      const records = result.records as MarketRecord[];
      setMarketFocus((current) =>
        records.some((record) => marketKey(record) === current)
          ? current
          : records[0]
            ? marketKey(records[0])
            : ""
      );
    } catch (error) {
      if (filters.signal?.aborted) return;
      setMarketError(error instanceof Error ? error.message : "Market prices could not be loaded.");
    } finally {
      if (!filters.signal?.aborted) setMarketLoading(false);
    }
  }

  useEffect(() => {
    if (tab !== "market") return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void loadMarkets({
        crop: marketFilterCrop,
        state: marketFilterState,
        district: marketFilterDistrict,
        market: marketFilterMarket,
        search: marketSearch,
        offset: marketPage * marketLimit,
        signal: controller.signal
      });
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [tab, marketFilterCrop, marketFilterState, marketFilterDistrict, marketFilterMarket, marketSearch, marketPage]);

  useEffect(() => {
    if (tab !== "market") return;
    const controller = new AbortController();
    let active = true;
    const timer = window.setTimeout(async () => {
      setMarketOptionsLoading(true);
      setMarketOptionsError("");
      try {
        const params = new URLSearchParams();
        if (marketFilterState) params.set("state", marketFilterState);
        const query = params.size ? `?${params.toString()}` : "";
        const response = await fetch(`/api/mandi/options${query}`, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Market filter options could not be loaded.");
        if (active) setMarketOptions(result as MarketOptions);
      } catch (error) {
        if (active && !controller.signal.aborted) {
          setMarketOptionsError(error instanceof Error ? error.message : "Market filter options could not be loaded.");
        }
      } finally {
        if (active && !controller.signal.aborted) setMarketOptionsLoading(false);
      }
    }, 150);
    return () => {
      active = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [tab, marketFilterState]);

  async function loadNearbyLabs(
    coords: { lat: number; lon: number },
    radius: number,
    signal?: AbortSignal
  ) {
    setLabsLoading(true);
    setLabsError("");
    try {
      const params = new URLSearchParams({
        lat: String(coords.lat),
        lon: String(coords.lon),
        radius: String(radius)
      });
      const response = await fetch(`/api/labs?${params.toString()}`, { signal });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Nearby labs could not be loaded.");
      setNearbyLabs(result.results as NearbyLab[]);
    } catch (error) {
      if (signal?.aborted) return;
      setLabsError(error instanceof Error ? error.message : "Nearby labs could not be loaded.");
    } finally {
      if (!signal?.aborted) setLabsLoading(false);
    }
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedDistrict) {
      setLocationError("Search for and select a district before saving your farm.");
      return;
    }
    if (villageInput.trim() && !selectedVillage) {
      setLocationError("Select a village or town from the search results, or clear the village field.");
      return;
    }
    const coordinates = selectedVillage ?? selectedDistrictPlace ?? {
      name: selectedDistrict,
      district: selectedDistrict,
      state: onboardState,
      latitude: farmCoordinates.lat,
      longitude: farmCoordinates.lon
    };
    const village = villageInput.trim() || "";
    const profile = {
      name: onboardName.trim() || farmerName,
      location: [village, selectedDistrict, onboardState].filter(Boolean).filter((item, index, items) =>
        items.findIndex((candidate) => candidate.toLowerCase() === item.toLowerCase()) === index
      ).join(", "),
      acres: Math.max(0.1, Number(onboardSize) || 1),
      crop: onboardCrop,
      state: onboardState,
      district: selectedDistrict,
      village,
      lat: coordinates.latitude,
      lon: coordinates.longitude
    };
    window.localStorage.setItem("kisan-care-profile", JSON.stringify(profile));
    setFarmerName(profile.name);
    setFarmLocation(profile.location);
    setFarmSize(profile.acres);
    setPrimaryCrop(profile.crop);
    setFarmCoordinates({ lat: profile.lat, lon: profile.lon });
    setLocationError("");
    setShowOnboarding(false);
    void loadWeather({ lat: profile.lat, lon: profile.lon, location: profile.location });
  }

  function openFarmProfile() {
    setOnboardName(farmerName);
    setOnboardSize(String(farmSize));
    setOnboardCrop(primaryCrop);
    setLocationError("");
    setShowOnboarding(true);
  }

  function selectDistrict(place: LocationResult) {
    const district = place.district || place.name;
    setSelectedDistrict(district);
    setSelectedDistrictPlace(place);
    setDistrictInput(district);
    setDistrictResults([]);
    setVillageInput("");
    setSelectedVillage(null);
    setLocationError("");
  }

  function selectVillage(place: LocationResult) {
    setVillageInput(place.name);
    setSelectedVillage(place);
    setVillageResults([]);
    setLocationError("");
  }

  function startBriefing() {
    if (!weather || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const greeting = language === "Hindi" ? "सुप्रभात" : language === "Marathi" ? "शुभ सकाळ" : "Good morning";
    const weatherLine = language === "Hindi"
      ? `${weather.location} में तापमान ${weather.temperature} डिग्री है`
      : language === "Marathi"
        ? `${weather.location} येथे तापमान ${weather.temperature} अंश आहे`
        : `In ${weather.location}, it is ${weather.temperature} degrees`;
    const text = `${greeting}. ${weatherLine}. ${weather.condition}. ${weather.advisory}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-IN";
    utterance.onend = () => { setIsSpeaking(false); setSpeechPaused(false); };
    utterance.onerror = () => { setIsSpeaking(false); setSpeechPaused(false); };
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setSpeechPaused(false);
  }

  function toggleBriefing() {
    if (!("speechSynthesis" in window)) return;
    if (speechPaused) {
      window.speechSynthesis.resume();
      setSpeechPaused(false);
    } else if (isSpeaking) {
      window.speechSynthesis.pause();
      setSpeechPaused(true);
    } else {
      startBriefing();
    }
  }

  function loadCropImage(file?: File) {
    setDiagnosis(null);
    setDiagnosisError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setDiagnosisError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setDiagnosisError("Image must be smaller than 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageData(reader.result);
        setImageName(file.name);
      }
    };
    reader.onerror = () => setDiagnosisError("We couldn't read that image. Please try another.");
    reader.readAsDataURL(file);
  }

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    loadCropImage(event.target.files?.[0]);
    event.target.value = "";
  }

  async function runDiagnosis() {
    if (!imageData) {
      setDiagnosisError("Add a clear photo of the affected plant first.");
      return;
    }
    setDiagnosing(true);
    setDiagnosisError("");
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, crop: primaryCrop })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The crop scan failed.");
      setDiagnosis(result as Diagnosis);
    } catch (error) {
      setDiagnosisError(error instanceof Error ? error.message : "The crop scan failed.");
    } finally {
      setDiagnosing(false);
    }
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingError("");
    setBookingToken("");
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Booking could not be completed.");
      setBookingToken(result.token);
      setBookingPersisted(result.persisted === true);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Booking could not be completed.");
    }
  }

  async function sendQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = question.trim();
    if (!text || chatLoading) return;
    setChatMessages((messages) => [...messages, { role: "user", text }]);
    setQuestion("");
    setChatLoading(true);
    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, language })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Assistant is unavailable.");
      setChatMessages((messages) => [...messages, { role: "assistant", text: result.answer }]);
    } catch (error) {
      setChatMessages((messages) => [...messages, { role: "assistant", text: error instanceof Error ? error.message : "Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  }

  function startVoiceInput() {
    type Recognition = { lang: string; onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onerror: () => void; start: () => void };
    const browserWindow = window as Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const SpeechRecognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setChatMessages((messages) => [...messages, { role: "assistant", text: "Voice input isn't available in this browser. You can type your question instead." }]);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-IN";
    recognition.onresult = (event) => setQuestion(event.results[0][0].transcript);
    recognition.onerror = () => setChatMessages((messages) => [...messages, { role: "assistant", text: "I couldn't hear that clearly. Please try again." }]);
    recognition.start();
  }

  const filteredRecords = useMemo(
    () => marketRecords,
    [marketRecords]
  );
  const marketSnapshot = useMemo(
    () => Array.from(new Map(marketRecords.map((record) => [record.crop.toLowerCase(), record])).values()).slice(0, 4),
    [marketRecords]
  );
  const availableMandis = useMemo(
    () => marketOptions.mandis
      .filter((item) => !marketFilterDistrict || item.district.toLowerCase() === marketFilterDistrict.toLowerCase())
      .map((item) => item.market)
      .filter((market, index, markets) => markets.findIndex((value) => value.toLowerCase() === market.toLowerCase()) === index),
    [marketOptions.mandis, marketFilterDistrict]
  );
  const uniqueDistrictResults = useMemo(
    () => Array.from(new Map(districtResults.map((place) => [place.district || place.name, place])).values()),
    [districtResults]
  );

  const chartData = (marketRecord?.history ?? []).map((price, index) => ({
    day: ["1 Oct", "4 Oct", "7 Oct", "10 Oct", "13 Oct", "16 Oct", "19 Oct", "22 Oct", "Today"][index] ?? `Day ${index + 1}`,
    price
  }));
  const t = (label: string) =>
    translations[language][label] ??
    translations[language][label.charAt(0).toUpperCase() + label.slice(1)] ??
    label;
  const cropQuestion = (crop: string) =>
    t("What should I consider before growing {crop} near {location}?")
      .replace("{crop}", t(crop))
      .replace("{location}", farmLocation);
  const weatherAdvisory = (message?: string) => {
    const advisory = message ?? "Checking today's forecast and field conditions...";
    const rainMessage = advisory.match(
      /^Rain is likely on (.+)\. Avoid spraying pesticides before or during the showers\.$/
    );
    if (rainMessage) {
      return `${t("Rain is likely on")} ${t(rainMessage[1])}. ${t("Avoid spraying pesticides before or during the showers.")}`;
    }
    return t(advisory);
  };
  const navLabel = (label: string) => t(label);
  const primaryCropMarketRecord = marketRecords.find(
    (record) => record.crop.toLowerCase() === primaryCrop.toLowerCase()
  );

  return (
    <div className="app-shell min-h-screen bg-[#F7F8F2] text-[#202B24]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-[#e9eee9] bg-white px-5 py-6 transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-9 flex items-center gap-3 px-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF2E6] text-[#245C3A]"><Sprout size={25} /></div>
          <div><div className="font-bold tracking-tight text-[#202B24]">Smart Crop Care</div><div className="mt-0.5 text-[11px] text-[#718076]">Kisan Care 360</div></div>
          <button onClick={() => setMenuOpen(false)} className="ml-auto rounded-lg p-2 text-slate-500 lg:hidden" aria-label="Close menu"><X size={19} /></button>
        </div>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a1aaa4]">{t("YOUR FARM")}</p>
        <nav className="space-y-1" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setTab(id); setMenuOpen(false); }} className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition ${tab === id ? "bg-[#eaf5ec] text-[#147343]" : "text-[#647269] hover:bg-[#f5f7f4] hover:text-[#18352a]"}`}>
              <Icon size={19} strokeWidth={tab === id ? 2.4 : 1.9} /><span className="flex-1">{navLabel(label)}</span>
              {id === "shop" && cartCount > 0 && <span className="rounded-full bg-[#14804a] px-2 py-0.5 text-[10px] text-white">{cartCount}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#f3f8f2] p-4">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#14804a]"><Heart size={18} /></div>
          <p className="text-sm font-semibold text-[#254635]">{t("Here for your farm")}</p>
          <p className="mt-1 text-xs leading-5 text-[#77857b]">{t("Talk to our agronomist assistant whenever you need a hand.")}</p>
          <button onClick={() => setAssistantOpen(true)} className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#14804a] px-3 text-xs font-semibold text-white hover:bg-[#0f6b3c]">{t("Ask a question")} <ArrowRight size={14} /></button>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-[#edf0ed] pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e8d7] text-sm font-bold text-[#81532c]">{farmerName.slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{farmerName} Patil</div><div className="truncate text-xs text-[#8a978f]">{farmLocation}</div></div>
          <button onClick={openFarmProfile} className="rounded-lg p-2 text-[#8a978f] hover:bg-[#f5f7f4]" aria-label="Edit farm profile"><UserRound size={17} /></button>
        </div>
      </aside>

      {menuOpen && <button className="fixed inset-0 z-30 bg-black/25 lg:hidden" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <main className="min-h-screen lg:pl-[260px]">
        <header className="app-header sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-2 border-b border-[#E3E9DF] bg-white/95 px-2 backdrop-blur sm:gap-3 sm:px-7 xl:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="rounded-lg p-2 text-[#526258] lg:hidden" aria-label="Open navigation"><Menu size={21} /></button>
            <button onClick={openFarmProfile} className="group flex min-h-11 min-w-0 max-w-[88px] items-center gap-1 rounded-xl px-0.5 text-left transition hover:bg-[#f4f8f3] sm:max-w-none sm:gap-3 sm:px-2" aria-label={`Change farm location: ${farmLocation}`}>
              <SectionPhoto
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=160&q=75"
                alt=""
                className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#EAF3E9] sm:block"
                fallback={<Sprout size={17} className="text-[#3F8757]" />}
              />
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF3E9] text-[#246B45] sm:hidden"><MapPin size={17} /></span>
              <span className="min-w-0">
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.1em] text-[#718076] sm:block">{t("Your farm")}</span>
                <span className="flex max-w-[62px] items-center gap-1 truncate text-[11px] font-semibold text-[#202B25] sm:max-w-[180px] sm:text-sm">{farmLocation}<ChevronDown size={13} className="shrink-0 text-[#718076] transition group-hover:translate-y-0.5" /></span>
              </span>
              <span className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold xl:flex ${weather?.source === "live" ? "bg-[#EAF3E9] text-[#246B45]" : "bg-[#f2f4f0] text-[#68756D]"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${weather?.source === "live" ? "bg-[#3F8757]" : "bg-[#9AA59C]"}`} />
                {weather?.source === "live" ? t("Local weather") : weather ? t("Saved forecast") : t("Weather loading")}
              </span>
            </button>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); setMarketSearch(headerSearch); setTab("market"); }} className="hidden min-w-0 max-w-[380px] flex-1 items-center rounded-xl border border-[#E3E9DF] bg-[#F7F8F2] px-3 focus-within:border-[#83B85A] focus-within:bg-white md:flex">
            <Search size={17} className="shrink-0 text-[#718076]" />
            <input aria-label={t("Search crops and markets")} value={headerSearch} onChange={(event) => setHeaderSearch(event.target.value)} placeholder={t("Search crops, markets...")} className="min-h-10 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
            <button type="submit" className="rounded-lg bg-[#245C3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#19492d]">{t("Search")}</button>
          </form>
          <div className="flex items-center gap-1 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-xl border border-[#E2E8E2] bg-[#F6F8F5] px-3 py-2 text-xs text-[#246B45] xl:flex"><Sun size={16} /><span className="font-semibold">{weather ? `${weather.temperature}°` : "—"}</span><span className="max-w-[100px] truncate text-[#68756D]">{t(weather?.condition ?? "Weather")}</span></div>
            <label className="flex h-9 items-center gap-1 rounded-lg border border-[#e8eee8] px-1.5 text-xs text-[#6d7b72] sm:h-10 sm:gap-2 sm:px-3">
              <Globe2 size={15} className="text-[#14804a]" />
              <select aria-label={t("Choose language")} value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="max-w-[58px] bg-transparent outline-none sm:max-w-none"><option value="English">English</option><option value="Hindi">हिन्दी</option><option value="Marathi">मराठी</option></select>
            </label>
            <button onClick={() => setTheme((current) => current === "light" ? "dark" : "light")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8eee8] text-[#526258] hover:bg-[#f3f6f2] sm:h-10 sm:w-10" aria-label={t(theme === "light" ? "Dark mode" : "Light mode")} title={t(theme === "light" ? "Dark mode" : "Light mode")}>
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button onClick={() => setAssistantOpen(true)} className="relative rounded-xl p-1.5 text-[#68766d] hover:bg-[#f3f6f2] sm:p-2" aria-label={t("Notifications")}><Bell size={19} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#e7a63c]" /></button>
            <div className="hidden h-8 w-px bg-[#e9eee9] sm:block" />
            <button onClick={() => setShowOnboarding(true)} className="flex items-center gap-2 rounded-xl p-1 hover:bg-[#f7f8f6] sm:p-1.5 sm:pr-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4e8d7] text-xs font-bold text-[#81532c]">{farmerName.slice(0, 1).toUpperCase()}</span><span className="hidden text-sm font-semibold sm:block">{farmerName}</span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mb-2 text-sm text-[#718076]">{new Intl.DateTimeFormat(language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</p><h1 className="flex items-center gap-2 text-[26px] font-bold tracking-tight text-[#202B24] sm:text-[30px]">{t("Welcome back")}, {farmerName} <Leaf size={23} className="text-[#3F8757]" aria-hidden="true" /></h1><p className="mt-1 text-sm text-[#718076]">{t("Your farm overview, crop recommendations, and market insights in one place.")}</p></div>
            <button onClick={openFarmProfile} className="flex min-h-11 items-center gap-2 rounded-xl border border-[#dce6dc] bg-white px-4 text-sm font-semibold text-[#3a5945] hover:bg-[#f7faf6]"><Sprout size={17} /> {t("My farm")} <ChevronDown size={15} /></button>
          </div>

          {tab === "dashboard" && (
            <div className="space-y-6">
              <section className="hero-banner relative overflow-hidden rounded-2xl p-6 text-white shadow-sm sm:min-h-[265px] sm:p-9 lg:p-11">
                {!heroImageFailed && <img src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1600&q=85" alt="" fetchPriority="high" onError={() => setHeroImageFailed(true)} />}
                <div className="relative max-w-2xl py-2 sm:py-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90"><Sprout size={14} /> {t("Practical insights for your farm")}</span>
                  <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">{t("Grow Smarter. Sell Better.")}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">{t("Your intelligent companion for healthier crops, smarter farming decisions, and better market opportunities.")}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={() => document.getElementById("crop-guides")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#245C3A] hover:bg-[#EAF2E6]">{t("Explore crop insights")} <ArrowRight size={16} /></button>
                    <button onClick={() => setTab("market")} className="flex min-h-11 items-center gap-2 rounded-xl border border-white/55 bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20"><TrendingUp size={16} /> {t("Check market prices")}</button>
                  </div>
                </div>
              </section>

              <section aria-label="Farm overview" className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                <div className="rounded-2xl border border-[#E3E9DF] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2E6] text-[#245C3A]"><Sprout size={19} /></span><span className="rounded-full bg-[#EAF2E6] px-2.5 py-1 text-[10px] font-semibold text-[#3F8554]">{t("SEASONAL GUIDE")}</span></div>
                  <p className="mt-4 text-2xl font-bold text-[#202B24]">03</p><p className="mt-1 text-sm font-semibold">{t("Crop ideas to explore")}</p><p className="mt-1 text-xs text-[#718076]">{t("General growing guides, not a soil diagnosis")}</p>
                </div>
                <div className="rounded-2xl border border-[#E3E9DF] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5DF] text-[#A87718]"><TrendingUp size={19} /></span><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${marketSource === "sample" ? "bg-[#FFF5DF] text-[#8E671D]" : "bg-[#EAF2E6] text-[#3F8554]"}`}>{marketSource === "sample" ? t("SAMPLE") : t("LIVE")}</span></div>
                  <p className="mt-4 text-2xl font-bold text-[#202B24]">{primaryCropMarketRecord ? money(primaryCropMarketRecord.price) : "—"}</p><p className="mt-1 text-sm font-semibold">{t(primaryCrop)} {t("market price")}</p><p className="mt-1 text-xs text-[#718076]">{primaryCropMarketRecord ? `${primaryCropMarketRecord.market} · ${t("per quintal")}` : t("Open mandi insights for available prices")}</p>
                </div>
                <div className="rounded-2xl border border-[#E3E9DF] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2E6] text-[#245C3A]"><Sun size={19} /></span><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${weather?.source === "live" ? "bg-[#EAF2E6] text-[#3F8554]" : "bg-[#FFF5DF] text-[#8E671D]"}`}>{weather?.source === "live" ? t("LIVE") : t("SAMPLE")}</span></div>
                  <p className="mt-4 text-2xl font-bold text-[#202B24]">{weather ? `${weather.temperature}°C` : "—"}</p><p className="mt-1 text-sm font-semibold">{weather ? t(weather.condition) : t("Weather conditions")}</p><p className="mt-1 text-xs text-[#718076]">{weather?.location ?? farmLocation}</p>
                </div>
                <button onClick={() => setTab("doctor")} className="rounded-2xl border border-[#E3E9DF] bg-white p-5 text-left shadow-sm transition hover:border-[#83B85A] hover:shadow-md">
                  <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCEEE9] text-[#B45B44]"><Bug size={19} /></span><ArrowRight size={16} className="text-[#718076]" /></div>
                  <p className="mt-4 text-2xl font-bold text-[#202B24]">{diagnosis ? "1" : "—"}</p><p className="mt-1 text-sm font-semibold">{diagnosis ? t("Screening result ready") : t("No crop scans yet")}</p><p className="mt-1 text-xs text-[#718076]">{diagnosis ? t("Screening aid · not a confirmed diagnosis") : t("Scan a plant to check for possible issues")}</p>
                </button>
              </section>

              <section id="crop-guides" className="scroll-mt-24">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3F8554]">{t("EXPLORE YOUR OPTIONS")}</p><h2 className="mt-1 text-xl font-bold text-[#202B24]">{t("Seasonal crop guide")}</h2><p className="mt-1 text-sm text-[#718076]">{t("Starting points for planning. Confirm local suitability with your soil report or KVK.")}</p></div>
                  <span className="rounded-full bg-[#EAF2E6] px-3 py-1.5 text-xs font-semibold text-[#3F8554]">{t("General guidance · not personalized")}</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {cropGuides.map((guide) => {
                    const priceRecord = marketRecords.find((record) => record.crop.toLowerCase() === guide.crop.toLowerCase());
                    return (
                      <article key={guide.crop} className="crop-card overflow-hidden rounded-2xl border border-[#E3E9DF] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <CropPhoto guide={guide} />
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-2"><h3 className="text-lg font-bold text-[#202B24]">{t(guide.crop)}</h3><span className="rounded-full bg-[#EAF2E6] px-2.5 py-1 text-[10px] font-semibold text-[#3F8554]">{t(guide.season)}</span></div>
                          <div className="mt-4 grid grid-cols-2 gap-y-3 text-xs">
                            <div><p className="text-[#718076]">{t("Soil guide")}</p><p className="mt-0.5 font-semibold text-[#34463a]">{t(guide.soil)}</p></div>
                            <div><p className="text-[#718076]">{t("Growing duration")}</p><p className="mt-0.5 font-semibold text-[#34463a]">{t(guide.duration)}</p></div>
                            <div className="col-span-2 border-t border-[#E3E9DF] pt-3"><p className="text-[#718076]">{t("Indicative mandi modal price · ₹/quintal")}</p><p className="mt-0.5 font-semibold text-[#34463a]">{priceRecord ? `${money(priceRecord.price)} · ${marketSource === "sample" ? t("sample data") : t("live data")}` : t("No price available for this crop")}</p></div>
                          </div>
                          <button onClick={() => { setPrimaryCrop(guide.crop); setQuestion(cropQuestion(guide.crop)); setAssistantOpen(true); }} className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#D8E5D4] text-sm font-semibold text-[#245C3A] hover:bg-[#EAF2E6]">{t("Ask about")} {t(guide.crop)} <ArrowRight size={15} /></button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-[#DDE8D8] bg-[#EAF2E6] p-5 sm:p-6">
                  <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#245C3A]"><Sprout size={21} /></span><div><h2 className="text-lg font-bold text-[#202B24]">{t("Your Smart Farming Assistant")}</h2><p className="mt-1 max-w-xl text-sm leading-6 text-[#617267]">{t("Get guidance on crop selection, soil health, pest management, irrigation, and market opportunities.")}</p></div></div>
                  <div className="mt-4 flex flex-wrap gap-2">{["Which crop is suitable for my soil?", "How can I identify crop diseases?", "Which mandi offers a better price?", "When should I irrigate my crops?"].map((suggestion) => <button key={suggestion} type="button" onClick={() => setQuestion(t(suggestion))} className="min-h-9 rounded-full border border-[#D6E2D2] bg-white px-3 text-xs font-medium text-[#3F5A46] hover:border-[#83B85A]">{t(suggestion)}</button>)}</div>
                  <form onSubmit={(event) => { setAssistantOpen(true); void sendQuestion(event); }} className="mt-4 flex gap-2 rounded-xl border border-[#D6E2D2] bg-white p-2">
                    <input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} placeholder={t("Ask about your farm...")} className="min-h-10 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" aria-label={t("Ask the farming assistant")} />
                    <button type="submit" disabled={!question.trim() || chatLoading} className="flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-[#245C3A] px-4 text-sm font-semibold text-white hover:bg-[#19492d] disabled:cursor-not-allowed disabled:opacity-50"><span className="hidden sm:inline">{t("Ask")}</span><Send size={15} /></button>
                  </form>
                  <p className="mt-2 text-[11px] text-[#718076]">{t("Answers are general information. Confirm important decisions with local agricultural experts.")}</p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-[#E3E9DF] bg-white">
                  <div className="h-32 overflow-hidden bg-[#EAF2E6]"><img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80" alt="Farmer tending crops in a green field" loading="lazy" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /></div>
                  <div className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3F8554]">{t("PLANT HEALTH")}</p><h2 className="mt-1 text-lg font-bold text-[#202B24]">{t("A closer look can help")}</h2><p className="mt-1 text-sm leading-5 text-[#718076]">{t("Upload a clear leaf photo for an AI screening. Results are a starting point, not a confirmed diagnosis.")}</p><button onClick={() => setTab("doctor")} className="mt-4 flex min-h-10 items-center gap-2 rounded-xl bg-[#245C3A] px-4 text-sm font-semibold text-white hover:bg-[#19492d]">{t("Open crop doctor")} <ArrowRight size={15} /></button></div>
                </div>
              </section>

              <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e7348] to-[#145b3c] p-5 text-white shadow-sm sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><button onClick={openFarmProfile} className="flex items-center gap-2 text-left text-sm text-white/80 hover:text-white"><MapPin size={15} /> {farmLocation}<ChevronDown size={14} /><span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">{weather?.source === "live" ? t("LIVE") : t("SAMPLE")}</span></button><div className="mt-4 flex items-center gap-3"><div className="text-5xl font-semibold tracking-tight">{weather?.temperature ?? "—"}°</div><div className="text-sm leading-5 text-white/80">{weather ? t(weather.condition) : t("Loading weather")}<br />{language === "Hindi" ? "महसूस:" : language === "Marathi" ? "जाणवते:" : t("Feels like")} {weather?.feelsLike ?? "—"}°</div></div><p className="mt-2 text-sm text-white/70">{t("Good day to check your crop rows.")}</p></div>
                    <div className="rounded-2xl bg-white/10 p-3"><Sun size={42} strokeWidth={1.5} className="text-[#f6d88b]" /></div>
                  </div>
                  {weatherError && <p role="alert" className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-xs text-white">{weatherError}</p>}
                  <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/15 pt-5 sm:gap-4">
                    {                    [{ icon: Droplets, label: "Humidity", value: `${weather?.humidity ?? "—"}%` }, { icon: CloudRain, label: "Rain chance", value: `${weather?.rainChance ?? "—"}%` }, { icon: Wind, label: "Wind", value: `${weather?.wind ?? "—"} km/h` }].map(({ icon: Icon, label, value }) => <div key={label} className="flex items-center gap-2.5"><Icon size={18} className="text-white/70" /><div><p className="text-[11px] text-white/65">{t(label)}</p><p className="mt-0.5 text-sm font-semibold">{value}</p></div></div>)}
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6">
                  <div><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#929e95]">{t("YOUR DAILY BRIEF")}</p><h2 className="mt-2 text-lg font-bold text-[#274535]">{t("Farm weather, in a minute")}</h2></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f7ef] text-[#14804a]"><AudioLines size={21} /></div></div><p className="mt-3 text-sm leading-6 text-[#728077]">{weatherAdvisory(weather?.advisory)}</p></div>
                  <div className="mt-5 flex items-center gap-3"><button onClick={toggleBriefing} className="flex min-h-11 items-center gap-2 rounded-xl bg-[#14804a] px-4 text-sm font-semibold text-white hover:bg-[#0f6b3c]"><Volume2 size={17} /> {t(speechPaused ? "Resume briefing" : isSpeaking ? "Pause briefing" : "Listen to briefing")}</button><button onClick={startBriefing} className="flex min-h-11 items-center gap-2 rounded-xl border border-[#e5ebe5] px-3 text-sm font-medium text-[#647269] hover:bg-[#f8faf7]"><AudioLines size={16} /> {t("Replay")}</button></div>
                </div>
              </section>

              <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
                <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6">
                  <SectionPhoto
                    src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80"
                    alt="Green farm fields with irrigation channels"
                    className="mb-5 h-28 overflow-hidden rounded-xl bg-[#EAF2E6] sm:h-36"
                    fallback={<div className="flex items-center gap-2 text-sm font-semibold text-[#3F8554]"><Sprout size={19} /> Local weather for your fields</div>}
                  />
                  <div className="mb-5 flex items-start justify-between gap-2"><div><h2 className="font-bold text-[#234332]">{t("7-day forecast")}</h2><p className="mt-1 text-xs text-[#8a978f]">{t("Plan field work around the weather")}</p></div><div className="flex gap-1"><button onClick={openFarmProfile} className="flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]"><MapPin size={14} /> {t("Choose farm")}</button><button onClick={() => { if (!navigator.geolocation) { setWeatherError("Location access isn't available in this browser."); return; } navigator.geolocation.getCurrentPosition((position) => void loadWeather({ lat: position.coords.latitude, lon: position.coords.longitude }), () => setWeatherError("We couldn't access your location. Check browser permissions.")); }} className="flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]"><MapPin size={14} /> {t("Use my location")}</button></div></div>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">{(weather?.forecast ?? []).map((day) => <div key={day.day} className={`rounded-xl px-1.5 py-3 text-center ${day.day === "Today" ? "bg-[#f0f7ee]" : "bg-white"}`}><p className="text-[11px] font-medium text-[#68786e]">{t(day.day)}</p><div className="my-3 flex justify-center text-[#d3982f]"><WeatherIcon kind={day.icon} size={20} /></div><p className="text-xs font-bold text-[#3b5142]">{day.high}° <span className="font-normal text-[#9aa59c]">{day.low}°</span></p><p className="mt-1 text-[10px] text-[#7590a3]">{day.rain}% {t("rain")}</p></div>)}</div>
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fff8e9] px-3.5 py-3 text-xs leading-5 text-[#755c2d]"><ThermometerSun size={16} className="mt-0.5 shrink-0 text-[#c38b2d]" /><span><strong>{t("Field tip:")}</strong> {weather ? weatherAdvisory(weather.advisory) : t("Check the latest forecast before field work.")}</span></div>
                </div>
                <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between"><div><h2 className="font-bold text-[#234332]">{t("Your farm at a glance")}</h2><p className="mt-1 text-xs text-[#8a978f]">{t("A quick look at your fields")}</p></div><button onClick={() => setTab("efficiency")} className="rounded-lg p-2 text-[#14804a] hover:bg-[#f1f7ef]" aria-label={t("View farm planner")}><ArrowRight size={18} /></button></div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#f7f9f6] p-4"><div className="flex items-center gap-2 text-[#14804a]"><MapPin size={16} /><span className="text-[11px] font-medium text-[#7b8980]">{t("Cultivated area")}</span></div><p className="mt-2 text-xl font-bold">{farmSize} <span className="text-xs font-medium text-[#859188]">{language === "Hindi" ? "एकड़" : language === "Marathi" ? "एकर" : "acres"}</span></p></div>
                    <div className="rounded-xl bg-[#f7f9f6] p-4"><div className="flex items-center gap-2 text-[#14804a]"><Leaf size={16} /><span className="text-[11px] font-medium text-[#7b8980]">{t("Main crop")}</span></div><p className="mt-2 text-xl font-bold">{t(primaryCrop)}</p></div>
                  </div>
                  <div className="mt-3 rounded-xl border border-[#e9eee9] p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 rounded-full bg-[#5aae73]" />{t("Next field task")}</div><span className="text-xs text-[#8a978f]">{t("Tomorrow")}</span></div><p className="mt-2 pl-4 text-xs text-[#7c8980]">{t("Walk the field and check soil moisture before irrigation.")}</p></div>
                </div>
              </section>

              <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
                <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold text-[#234332]">{t("Today's mandi snapshot")}</h2><p className="mt-1 text-xs text-[#8a978f]">{marketSource === "sample" ? t("Sample modal prices") : t("Live modal prices")} · ₹ {t("per quintal")}</p></div><button onClick={() => setTab("market")} className="flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]">{t("All prices")} <ArrowRight size={14} /></button></div>
                  <div className="divide-y divide-[#edf0ed]">{marketSnapshot.map((record) => <button key={marketKey(record)} onClick={() => { setMarketFocus(marketKey(record)); setTab("market"); }} className="flex min-h-[58px] w-full items-center gap-3 text-left hover:bg-[#fbfcfa]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f7ef] text-[#14804a]"><Leaf size={17} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{t(record.crop)}</span><span className="block text-[11px] text-[#8a978f]">{record.market}, {record.state}</span></span><span className="text-right"><span className="block text-sm font-bold">{money(record.price)}</span><span className={`text-[11px] ${record.change >= 0 ? "text-[#258654]" : "text-[#c05948]"}`}>{record.change >= 0 ? "+" : ""}{record.change}% {t("today")}</span></span></button>)}</div>
                </div>
                <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between"><div><h2 className="font-bold text-[#234332]">{t("Quick actions")}</h2><p className="mt-1 text-xs text-[#8a978f]">{t("Tools for your next field visit")}</p></div><div className="rounded-lg bg-[#f1f7ef] p-2 text-[#14804a]"><CalendarDays size={17} /></div></div>
                  <div className="mt-4 space-y-2">{[{ id: "doctor" as Tab, icon: Bug, title: "Scan a crop problem", sub: "Get a quick plant health check" }, { id: "soil" as Tab, icon: FlaskConical, title: "Book a soil test", sub: "Find a nearby testing lab" }, { id: "efficiency" as Tab, icon: Activity, title: "Plan fertilizer use", sub: "Estimate amounts for your fields" }].map(({ id, icon: Icon, title, sub }) => <button key={title} onClick={() => setTab(id)} className="flex min-h-[62px] w-full items-center gap-3 rounded-xl border border-[#edf0ed] px-3 text-left hover:border-[#d3e4d4] hover:bg-[#f9fbf8]"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f7ee] text-[#14804a]"><Icon size={17} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{t(title)}</span><span className="mt-0.5 block text-[11px] text-[#89958c]">{t(sub)}</span></span><ArrowRight size={16} className="text-[#9aa59c]" /></button>)}</div>
                </div>
              </section>
            </div>
          )}

          {tab === "doctor" && (
            <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
              <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-7">
                <div className="mb-6"><span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff3e6] text-[#bf771d]"><Bug size={22} /></span><h2 className="mt-4 text-xl font-bold">{t("AI crop health doctor")}</h2><p className="mt-1 max-w-lg text-sm leading-6 text-[#77857b]">{t("Take a clear photo of a leaf or affected plant. We'll help you understand what might be happening.")}</p></div>
                <label className="mb-2 block text-sm font-semibold">{t("What crop are you checking?")}</label><select value={primaryCrop} onChange={(event) => setPrimaryCrop(event.target.value)} className="mb-5 min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white px-3 text-sm"><option value={primaryCrop}>{t(primaryCrop)}</option>{crops.filter((crop) => crop !== primaryCrop).map((crop) => <option key={crop}>{t(crop)}</option>)}</select>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={selectImage} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  onDragEnter={(event) => { event.preventDefault(); setUploadFocused(true); }}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setUploadFocused(false); }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setUploadFocused(false);
                    loadCropImage(event.dataTransfer.files[0]);
                  }}
                  className={`upload-dropzone flex min-h-[190px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-4 text-center transition ${uploadFocused ? "border-[#246B45] ring-2 ring-[#246B45]/20" : "border-[#d9e5d9] hover:border-[#85b894]"}`}
                >
                  {imageData ? <><img src={imageData} alt={t("Selected crop leaf preview")} className="max-h-40 rounded-xl object-contain" /><span className="mt-2 text-xs text-[#6e7d73]">{imageName} · {t("Click or drop to change")}</span></> : <><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf3e9] text-[#246B45]"><Upload size={21} /></span><span className="mt-3 text-sm font-semibold">{t("Upload or take a photo")}</span><span className="mt-1 text-xs text-[#68756D]">{t("Drop an image here, or browse · JPG, PNG or WebP · up to 10 MB")}</span></>}
                </button>
                {diagnosisError && <p role="alert" className="mt-3 text-sm text-[#b54136]">{diagnosisError}</p>}
                <button disabled={diagnosing} onClick={() => void runDiagnosis()} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#14804a] px-4 text-sm font-semibold text-white hover:bg-[#0f6b3c] disabled:cursor-wait disabled:opacity-60">{diagnosing ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> {t("Checking your crop...")}</> : <><Search size={17} /> {t("Check crop health")}</>}</button>
                <p className="mt-3 text-center text-[11px] leading-5 text-[#8b978e]">{t("Your photo is used only to provide this result. This tool is a screening aid, not a confirmed diagnosis.")}</p>
              </div>
              <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-7">
                {!diagnosis ? <div className="h-full min-h-[390px] text-center"><SectionPhoto src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1100&q=80" alt={t("Close-up of healthy green crop leaves")} className="h-44 overflow-hidden rounded-xl bg-[#eaf3e9] sm:h-52" fallback={<Leaf size={36} className="text-[#3F8757]" />} /><div className="flex flex-col items-center px-2 pb-3 pt-6"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3e9] text-[#246B45]"><Leaf size={24} /></span><h3 className="mt-3 font-bold">{t("Your crop check will appear here")}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-[#68756D]">{t("Upload a clear photo in natural light. Try to include both healthy and affected leaves.")}</p><div className="mt-5 grid w-full max-w-sm grid-cols-3 gap-2 text-[11px] text-[#68756D]"><div className="rounded-xl bg-[#f6f8f5] p-3">{t("Clear, close-up photo")}</div><div className="rounded-xl bg-[#f6f8f5] p-3">{t("Good natural light")}</div><div className="rounded-xl bg-[#f6f8f5] p-3">{t("One plant at a time")}</div></div></div></div> : <><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-[#fff4e5] px-3 py-1 text-xs font-semibold text-[#9a651b]">{t(diagnosis.severity)} {t("concern")}</span><h3 className="mt-4 text-xl font-bold">{diagnosis.disease}</h3><p className="mt-1 text-sm text-[#7c8980]">{diagnosis.source === "gemini" ? t("Gemini AI screening") : t("Sample screening")} · {diagnosis.confidence}% {t("confidence")}</p></div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1f7ef] text-[#14804a]"><FileText size={20} /></span></div>{imageData && <img src={imageData} alt={t("Crop image submitted for screening")} className="mt-5 h-48 w-full rounded-xl object-cover" />}<div className="mt-6 space-y-4">{[{ title: "What to look for", body: diagnosis.symptoms }, { title: "Gentle first steps", body: diagnosis.organic }, { title: "Chemical treatment", body: diagnosis.chemical }, { title: "Prevention", body: diagnosis.prevention }].map(({ title, body }) => <div key={title} className="border-t border-[#edf0ed] pt-4"><h4 className="text-sm font-semibold">{t(title)}</h4><p className="mt-1.5 text-sm leading-6 text-[#718077]">{body}</p></div>)}</div><p className="mt-5 rounded-xl bg-[#fff8e9] p-3 text-xs leading-5 text-[#755c2d]">{diagnosis.note}</p></>}
              </div>
            </section>
          )}

          {tab === "soil" && (
            <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-7">
                <SectionPhoto
                  src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80"
                  alt="Laboratory workspace for testing soil samples"
                  className="mb-5 h-32 overflow-hidden rounded-xl bg-[#eaf3e9]"
                  fallback={<div className="flex items-center gap-2 text-sm font-semibold text-[#3F8757]"><FlaskConical size={20} /> {t("Soil testing and lab services")}</div>}
                />
                <div className="mb-6 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef5e8] text-[#678740]"><FlaskConical size={22} /></span><div><h2 className="text-xl font-bold">{t("Book a soil test")}</h2><p className="mt-1 text-sm text-[#7b8980]">{t("Choose a nearby lab and a time that works for you.")}</p></div></div>
                {bookingToken ? <div className="rounded-2xl bg-[#eff8ef] p-6 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#14804a]"><Check size={24} /></span><h3 className="mt-4 text-lg font-bold text-[#214631]">{bookingPersisted ? t("Request confirmed") : t("Demo request created")}</h3><p className="mt-2 text-sm text-[#68796e]">{bookingPersisted ? t("Your appointment is saved. Show this token at the lab or mention it when arranging pickup.") : t("This demo token is not saved yet. Connect a database to keep appointment records.")}</p><div className="mx-auto mt-4 max-w-xs rounded-xl border border-[#d5e7d6] bg-white p-4"><p className="text-[11px] uppercase tracking-wider text-[#859188]">{t("Your appointment token")}</p><p className="mt-1 text-2xl font-bold tracking-wider text-[#14804a]">{bookingToken}</p></div><button onClick={() => setBookingToken("")} className="mt-5 text-sm font-semibold text-[#14804a]">{t("Book another test")}</button></div> : <form onSubmit={(event) => void submitBooking(event)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">{t("Your name")}<input required value={booking.name} onChange={(event) => setBooking({ ...booking, name: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] px-3 font-normal" placeholder="e.g. Ravi Patil" /></label><label className="text-sm font-semibold">{t("Mobile number")}<input required inputMode="numeric" pattern="[6-9][0-9]{9}" value={booking.phone} onChange={(event) => setBooking({ ...booking, phone: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] px-3 font-normal" placeholder={t("10-digit mobile number")} /></label></div>
                  <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">{t("Crop to test")}<select value={booking.crop} onChange={(event) => setBooking({ ...booking, crop: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white px-3 font-normal">{crops.map((crop) => <option key={crop}>{t(crop)}</option>)}</select></label><label className="text-sm font-semibold">{t("Preferred date")}<input required type="date" min={new Date().toISOString().slice(0, 10)} value={booking.date} onChange={(event) => setBooking({ ...booking, date: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] px-3 font-normal" /></label></div>
                  <label className="block text-sm font-semibold">{t("Time slot")}<select value={booking.slot} onChange={(event) => setBooking({ ...booking, slot: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white px-3 font-normal"><option value="09:00-11:00">9:00 am – 11:00 am</option><option value="11:00-13:00">11:00 am – 1:00 pm</option><option value="14:00-16:00">2:00 pm – 4:00 pm</option></select></label>
                  <fieldset><legend className="mb-2 text-sm font-semibold">{t("How would you like to test?")}</legend><div className="grid grid-cols-2 gap-3"><label className={`flex min-h-[62px] cursor-pointer items-center gap-3 rounded-xl border px-3 ${booking.visitType === "lab" ? "border-[#7db58a] bg-[#f3f9f2]" : "border-[#e3e9e3]"}`}><input type="radio" name="visitType" value="lab" checked={booking.visitType === "lab"} onChange={(event) => setBooking({ ...booking, visitType: event.target.value })} className="accent-[#14804a]" /><span><span className="block text-sm font-semibold">{t("Visit the lab")}</span><span className="text-xs text-[#8b978e]">{t("Bring your soil sample")}</span></span></label><label className={`flex min-h-[62px] cursor-pointer items-center gap-3 rounded-xl border px-3 ${booking.visitType === "pickup" ? "border-[#7db58a] bg-[#f3f9f2]" : "border-[#e3e9e3]"}`}><input type="radio" name="visitType" value="pickup" checked={booking.visitType === "pickup"} onChange={(event) => setBooking({ ...booking, visitType: event.target.value })} className="accent-[#14804a]" /><span><span className="block text-sm font-semibold">{t("Sample pickup")}</span><span className="text-xs text-[#8b978e]">{t("Lab will confirm availability")}</span></span></label></div></fieldset>
                  <label className="block text-sm font-semibold">{t("Soil testing lab")}
                    <input required list="nearby-lab-options" value={booking.lab} onChange={(event) => setBooking({ ...booking, lab: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] px-3 font-normal" placeholder={nearbyLabs.length ? t("Choose a nearby lab or enter a lab name") : t("Enter a soil testing lab name")} />
                    <datalist id="nearby-lab-options">{nearbyLabs.map((lab) => <option key={lab.id} value={lab.name}>{lab.distanceKm} km away</option>)}</datalist>
                  </label>
                  {bookingError && <p role="alert" className="text-sm text-[#b54136]">{bookingError}</p>}
                  <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#14804a] text-sm font-semibold text-white hover:bg-[#0f6b3c]">{t("Request appointment")} <ArrowRight size={16} /></button>
                </form>}
              </div>
              <div className="space-y-5">
                <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><h2 className="font-bold">{t("Nearby soil labs")}</h2><p className="mt-1 text-xs text-[#8a978f]"><MapPin size={12} className="mr-1 inline" />{farmLocation}</p></div>
                    <div className="flex items-center gap-2">
                      <select aria-label={t("Lab search radius")} value={labRadius} onChange={(event) => setLabRadius(Number(event.target.value))} className="min-h-10 rounded-lg border border-[#e4eae4] bg-white px-2 text-xs"><option value={10000}>10 km</option><option value={25000}>25 km</option><option value={50000}>50 km</option></select>
                      <button onClick={() => void loadNearbyLabs(farmCoordinates, labRadius)} className="flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]" aria-label={t("Refresh nearby labs")}><Activity size={15} /> {t("Refresh")}</button>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-[#8a978f]">{t("OpenStreetMap nearby-place results · ordered by distance")}</p>
                  {labsLoading && <p role="status" className="mt-4 rounded-xl bg-[#f7f9f6] p-4 text-sm text-[#69786f]">{t("Looking for agriculture and soil-testing facilities near your farm...")}</p>}
                  {labsError && <div className="mt-4 rounded-xl bg-[#fff8e9] p-4"><p role="alert" className="text-sm text-[#755c2d]">{labsError}</p></div>}
                  {!labsLoading && !labsError && nearbyLabs.length === 0 && <div className="mt-4 rounded-xl bg-[#f7f9f6] p-4"><p className="text-sm font-semibold">{t("No soil-testing facilities were listed nearby.")}</p><p className="mt-1 text-xs leading-5 text-[#7d8a81]">{t("Map listings may be incomplete. Search a wider area or check the map for local government and university labs.")}</p></div>}
                  {!labsLoading && nearbyLabs.length > 0 && <div className="mt-4 space-y-3">{nearbyLabs.map((lab) => <div key={lab.id} className="rounded-xl border border-[#edf0ed] p-4"><div className="flex items-start gap-3"><span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f7ef] text-[#14804a]"><MapPin size={17} /></span><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{lab.name}</h3><p className="mt-1 text-xs text-[#89958c]">{lab.address || t("Address not listed")}</p><p className="mt-1 text-xs text-[#78867d]">{lab.distanceKm} {t("km away")} · {lab.source}</p>{lab.phone && <a href={`tel:${lab.phone}`} className="mt-1 block text-xs text-[#14804a]">{lab.phone}</a>}</div></div><div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f2f0] pt-3"><button type="button" onClick={() => setBooking((current) => ({ ...current, lab: lab.name }))} className="min-h-9 rounded-lg bg-[#f1f7ef] px-3 text-xs font-semibold text-[#14804a] hover:bg-[#e7f2e7]">{t("Select for booking")}</button><div className="flex gap-3"><a href={lab.mapUrl} target="_blank" rel="noreferrer" className="flex min-h-9 items-center gap-1 text-xs font-semibold text-[#14804a]">{t("Map")} <ExternalLink size={12} /></a><a href={lab.directionsUrl} target="_blank" rel="noreferrer" className="flex min-h-9 items-center gap-1 text-xs font-semibold text-[#14804a]">{t("Directions")} <ExternalLink size={12} /></a></div></div></div>)}</div>}
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`soil testing lab agricultural laboratory near ${farmLocation}`)}`} target="_blank" rel="noreferrer" className="mt-4 flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#e4eae4] text-xs font-semibold text-[#14804a] hover:bg-[#f8faf7]">{t("Search soil labs on Google Maps")} <ExternalLink size={13} /></a>
                  <p className="mt-3 text-[10px] leading-4 text-[#929e95]">{t("Listings come from OpenStreetMap and may be incomplete or unverified. Call the facility to confirm soil testing services and availability.")}</p>
                </div>
                <div className="rounded-2xl bg-[#f0f6e9] p-5"><div className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#688442]"><BookOpen size={18} /></span><div><h3 className="text-sm font-bold text-[#38522c]">{t("Why test your soil?")}</h3><p className="mt-1 text-xs leading-5 text-[#6f7e60]">{t("A soil test measures pH and nutrients so you can make informed fertilizer choices and avoid unnecessary inputs. Ask the lab for a soil health card with your results.")}</p></div></div></div>
              </div>
            </section>
          )}

          {tab === "market" && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">{t("Mandi market insights")}</h2><p className="mt-1 text-sm text-[#7b8980]">{t("Search mandi prices for multiple crops across India.")}</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-[#eff6ec] px-3 py-1.5 text-xs font-semibold text-[#527342]">{marketSource === "sample" ? t("Expanded sample data") : t("Data.gov.in live")}</span><span className="text-xs text-[#7b8980]">{marketTotal.toLocaleString("en-IN")} {t("results")}</span></div></div>
              <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="font-bold">{t("Find crop prices")}</h3><p className="mt-1 text-xs text-[#8a978f]">{t("Filter by commodity and mandi location. Leave blank to browse all available records.")}</p></div><Search size={18} className="text-[#14804a]" /></div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  <label className="text-xs font-semibold text-[#68766d]">{t("State")}
                    <select value={marketFilterState} onChange={(event) => { setMarketFilterState(event.target.value); setMarketFilterCrop(""); setMarketFilterDistrict(""); setMarketFilterMarket(""); setMarketPage(0); }} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] bg-white px-3 text-sm font-normal">
                      <option value="">{t("All states")}</option>{(marketOptions.states.length ? marketOptions.states : indianStates).map((state) => <option key={state}>{state}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-[#68766d]">{t("Crop")}
                    <select value={marketFilterCrop} onChange={(event) => { setMarketFilterCrop(event.target.value); setMarketPage(0); }} disabled={marketOptionsLoading || marketOptions.crops.length === 0} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] bg-white px-3 text-sm font-normal disabled:bg-[#f5f7f4]">
                      <option value="">{t("All crops")}</option>{marketOptions.crops.map((crop) => <option key={crop}>{t(crop)}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-[#68766d]">{t("District")}
                    <select value={marketFilterDistrict} onChange={(event) => { setMarketFilterDistrict(event.target.value); setMarketFilterMarket(""); setMarketPage(0); }} disabled={!marketFilterState || marketOptionsLoading || marketOptions.districts.length === 0} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] bg-white px-3 text-sm font-normal disabled:bg-[#f5f7f4]">
                      <option value="">{marketFilterState ? t("All districts") : t("Select a state first")}</option>{marketOptions.districts.map((district) => <option key={district}>{district}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-[#68766d]">{t("Mandi")}
                    <select value={marketFilterMarket} onChange={(event) => { setMarketFilterMarket(event.target.value); setMarketPage(0); }} disabled={!marketFilterState || marketOptionsLoading || availableMandis.length === 0} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] bg-white px-3 text-sm font-normal disabled:bg-[#f5f7f4]">
                      <option value="">{marketFilterDistrict ? t("All mandis in district") : marketFilterState ? t("All mandis in state") : t("Select a state first")}</option>{availableMandis.map((market) => <option key={market}>{market}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-[#68766d]">{t("Search all fields")}<input value={marketSearch} onChange={(event) => { setMarketSearch(event.target.value); setMarketPage(0); }} placeholder={t("Crop, variety, location...")} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] px-3 text-sm font-normal" /></label>
                </div>
                {marketOptionsError && <p role="alert" className="mt-3 text-xs text-[#a93f35]">{marketOptionsError}</p>}
                <div className="mt-3 flex items-center justify-between gap-2"><p className="text-[11px] text-[#89958c]">{marketOptionsLoading ? t("Loading available crops, districts, and mandis...") : marketFilterState ? t("Crop and district options for {state}; mandis follow the selected district.").replace("{state}", marketFilterState) : t("Select a state to narrow the crop, district, and mandi options.")}</p><button onClick={() => { setMarketFilterCrop(""); setMarketFilterState(""); setMarketFilterDistrict(""); setMarketFilterMarket(""); setMarketSearch(""); setMarketPage(0); }} className="min-h-9 shrink-0 rounded-lg px-2 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]">{t("Clear all filters")}</button></div>
              </div>
              <div className="grid gap-5 xl:grid-cols-[1.45fr_0.8fr]">
                <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold">{t("Price trend")}</h3><p className="mt-1 text-xs text-[#8a978f]">{t("Recent mandi modal price · ₹ per quintal")}</p></div><select aria-label={t("Choose crop and mandi for price trend")} value={marketRecord ? marketKey(marketRecord) : ""} onChange={(event) => setMarketFocus(event.target.value)} className="min-h-10 max-w-full rounded-lg border border-[#e4eae4] bg-white px-3 text-sm">{marketRecords.map((record) => <option key={marketKey(record)} value={marketKey(record)}>{t(record.crop)} — {record.market}, {record.state}</option>)}</select></div>
                  <div className="mt-6 h-[255px] w-full">{marketRecord && chartData.length > 0 ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 8, left: -15, bottom: 0 }}><defs><linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14804a" stopOpacity={0.18} /><stop offset="95%" stopColor="#14804a" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#edf1ed" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#89958c", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#89958c", fontSize: 11 }} tickFormatter={(value: number) => `₹${value}`} /><Tooltip formatter={(value) => [money(Number(value)), t("Modal price")]} contentStyle={{ borderRadius: 12, borderColor: "#e8eee8", fontSize: 12 }} /><Area type="monotone" dataKey="price" stroke="#14804a" strokeWidth={2.5} fill="url(#priceFill)" /></AreaChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-[#87938a]">{t("Price history is not available for this record.")}</div>}</div>
                  {marketRecord && <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#edf0ed] pt-4"><div><p className="text-[11px] text-[#8a978f]">{t("Modal price")}</p><p className="mt-1 font-bold">{money(marketRecord.price)}</p></div><div><p className="text-[11px] text-[#8a978f]">{t("Today's change")}</p><p className={`mt-1 font-bold ${marketRecord.change >= 0 ? "text-[#258654]" : "text-[#c05948]"}`}>{marketRecord.change >= 0 ? "+" : ""}{marketRecord.change}%</p></div><div><p className="text-[11px] text-[#8a978f]">{t("Market")}</p><p className="mt-1 truncate font-bold">{marketRecord.market}</p></div></div>}
                </div>
                <div className="space-y-5">
                  <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6"><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0f7ee] text-[#14804a]"><Activity size={18} /></span><h3 className="font-bold">{t("Market outlook")}</h3></div><div className="mt-4 rounded-xl bg-[#f2f8f0] p-4"><span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#3a7d4d]">{t("WATCH THE MARKET")}</span><p className="mt-3 text-sm leading-6 text-[#5f7165]">{marketRecord?.change && marketRecord.change > 2 ? t("{crop} prices are up recently in {market}. Compare nearby markets and storage costs before deciding when to sell.").replace("{crop}", t(marketRecord.crop)).replace("{market}", marketRecord.market) : t("{crop} prices are moving gradually. Check arrivals and local prices again before making a sale decision.").replace("{crop}", t(marketRecord?.crop ?? "Crop"))}</p></div><p className="mt-3 text-[11px] leading-5 text-[#89958c]">{t("This is a simple trend summary, not a guaranteed forecast. Prices can change quickly and vary by quality and market.")}</p></div>
                  <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h3 className="font-bold">{t("Markets on this page")}</h3><p className="mt-1 text-xs text-[#8a978f]">{t("Select any crop and mandi for the chart")}</p></div><Search size={18} className="text-[#14804a]" /></div><div className="mt-3 max-h-[260px] space-y-1 overflow-y-auto">{filteredRecords.slice(0, 30).map((record) => <button key={marketKey(record)} onClick={() => setMarketFocus(marketKey(record))} className={`flex min-h-12 w-full items-center justify-between gap-2 rounded-lg px-2 text-left hover:bg-[#f7f9f6] ${marketFocus === marketKey(record) ? "bg-[#f2f8f0]" : ""}`}><span className="min-w-0"><span className="block truncate text-sm font-semibold">{t(record.crop)} · {record.market}</span><span className="text-[11px] text-[#89958c]">{record.district ? `${record.district}, ` : ""}{record.state}</span></span><span className="shrink-0 text-sm font-bold">{money(record.price)}</span></button>)}{filteredRecords.length === 0 && !marketLoading && <p className="py-4 text-center text-xs text-[#89958c]">{t("No matching mandi records.")}</p>}</div></div>
                </div>
              </div>
              <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold">{t("Mandi rates across India")}</h3><p className="mt-1 text-xs text-[#8a978f]">{t("Showing")} {marketTotal === 0 ? 0 : marketPage * marketLimit + 1}–{Math.min((marketPage + 1) * marketLimit, marketTotal)} {t("of")} {marketTotal.toLocaleString("en-IN")} {t("records")} · ₹ {t("per quintal")}</p></div><button onClick={() => void loadMarkets({ crop: marketFilterCrop, state: marketFilterState, district: marketFilterDistrict, market: marketFilterMarket, search: marketSearch, offset: marketPage * marketLimit })} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]"><Activity size={15} /> {t("Refresh")}</button></div>
                {marketSource === "sample" && <p className="mb-4 rounded-xl bg-[#fff8e9] p-3 text-xs leading-5 text-[#755c2d]">{t("These are sample prices for demonstration, not live mandi quotes. Add Data.gov.in API credentials to see official records. The sample directory covers 16 crops across 18 markets and states.")}</p>}
                {marketError && <p role="alert" className="mb-4 rounded-xl bg-[#fff1ef] p-3 text-sm text-[#a93f35]">{marketError}</p>}
                <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-[#edf0ed] text-[11px] uppercase tracking-wide text-[#8a978f]"><th className="pb-3 font-semibold">{t("Crop & variety")}</th><th className="pb-3 font-semibold">{t("Mandi")}</th><th className="pb-3 font-semibold">{t("District")}</th><th className="pb-3 font-semibold">{t("State")}</th><th className="pb-3 text-right font-semibold">{t("Modal price")}</th><th className="pb-3 text-right font-semibold">{t("Change")}</th></tr></thead><tbody>{filteredRecords.map((record) => <tr key={marketKey(record)} className="border-b border-[#f1f3f1] last:border-0"><td className="py-3.5"><span className="font-semibold">{t(record.crop)}</span><span className="ml-2 text-xs text-[#89958c]">{record.variety}</span></td><td className="py-3.5 text-[#69786f]">{record.market}</td><td className="py-3.5 text-[#69786f]">{record.district || "—"}</td><td className="py-3.5 text-[#69786f]">{record.state}</td><td className="py-3.5 text-right font-semibold">{money(record.price)}</td><td className={`py-3.5 text-right font-medium ${record.change >= 0 ? "text-[#258654]" : "text-[#c05948]"}`}>{record.change >= 0 ? "+" : ""}{record.change}%</td></tr>)}</tbody></table>{marketLoading && <p role="status" className="py-8 text-center text-sm text-[#89958c]">{t("Loading mandi rates...")}</p>}{filteredRecords.length === 0 && !marketLoading && <p className="py-8 text-center text-sm text-[#89958c]">{t("No mandi records match these filters. Try clearing a filter or selecting another crop.")}</p>}</div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0ed] pt-4"><span className="text-xs text-[#8a978f]">{t("Page")} {marketPage + 1} {t("of")} {Math.max(1, Math.ceil(marketTotal / marketLimit))}</span><div className="flex gap-2"><button disabled={marketPage === 0 || marketLoading} onClick={() => setMarketPage((page) => Math.max(0, page - 1))} className="min-h-10 rounded-lg border border-[#e3e9e3] px-4 text-xs font-semibold text-[#526359] disabled:opacity-40">{t("Previous")}</button><button disabled={(marketPage + 1) * marketLimit >= marketTotal || marketLoading} onClick={() => setMarketPage((page) => page + 1)} className="min-h-10 rounded-lg border border-[#e3e9e3] px-4 text-xs font-semibold text-[#526359] disabled:opacity-40">{t("Next")}</button></div></div>
              </div>
            </section>
          )}

          {tab === "efficiency" && (
            <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
              <div className="planner-photo relative overflow-hidden rounded-2xl p-5 text-white sm:col-span-2 sm:p-7">
                <SectionPhoto
                  src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1600&q=80"
                  alt="Farmer working among crops in a green field"
                  className="absolute inset-0"
                  fallback={<span className="text-[#245C3A]"><Sprout size={30} /></span>}
                />
                <div className="planner-photo-overlay absolute inset-0" />
                <div className="relative max-w-xl"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">{t("Farm planner")}</span><h2 className="mt-1 text-2xl font-bold sm:text-3xl">{t("Plan with your field in mind")}</h2><p className="mt-2 text-sm text-white/85">{t("Estimate inputs, check the forecast, and keep practical field notes together.")}</p></div>
              </div>
              <div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-7"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff6e9] text-[#658442]"><Sprout size={22} /></span><div><h2 className="text-xl font-bold">{t("Field input calculator")}</h2><p className="mt-1 text-sm text-[#7b8980]">{t("Estimate amounts from your own per-acre recommendation.")}</p></div></div><div className="mt-7 space-y-6"><label className="block"><span className="flex items-center justify-between text-sm font-semibold"><span>{t("Farm area")}</span><span className="text-[#14804a]">{acres} {t("acres")}</span></span><input type="range" min="0.5" max="50" step="0.5" value={acres} onChange={(event) => setAcres(Number(event.target.value))} className="mt-4 w-full accent-[#14804a]" /><span className="mt-1 flex justify-between text-[11px] text-[#89958c]"><span>0.5 {t("acre")}</span><span>50 {t("acres")}</span></span></label><label className="block text-sm font-semibold">{t("Fertilizer recommendation per acre (kg)")}<div className="mt-2 flex min-h-12 items-center rounded-xl border border-[#dfe7df]"><button onClick={() => setFertilizerRate(Math.max(1, fertilizerRate - 5))} className="flex h-11 w-12 items-center justify-center text-[#69786f]" aria-label={t("Reduce fertilizer rate")}><Minus size={16} /></button><input type="number" min="1" value={fertilizerRate} onChange={(event) => setFertilizerRate(Math.max(0, Number(event.target.value)))} className="min-w-0 flex-1 text-center font-semibold outline-none" /><span className="pr-3 text-xs text-[#89958c]">{t("kg / acre")}</span><button onClick={() => setFertilizerRate(fertilizerRate + 5)} className="flex h-11 w-12 items-center justify-center text-[#69786f]" aria-label={t("Increase fertilizer rate")}><Plus size={16} /></button></div></label><label className="block text-sm font-semibold">{t("Input type")}<select className="mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white px-3 text-sm font-normal"><option>{t("NPK fertilizer")}</option><option>{t("Compost / organic manure")}</option><option>{t("Seed quantity")}</option></select></label></div><div className="mt-7 rounded-2xl bg-[#eff7ed] p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#71856b]">{t("Estimated quantity for your farm")}</p><p className="mt-2 text-3xl font-bold text-[#1e633b]">{(acres * fertilizerRate).toLocaleString("en-IN")} <span className="text-base font-semibold">{t("kg")}</span></p><p className="mt-1 text-xs text-[#768674]">{t("Based on")} {fertilizerRate} kg {t("per acre")} × {acres} {t("acres")}</p></div><p className="mt-4 text-xs leading-5 text-[#89958c]">{t("Use the rate recommended for your crop and soil test. This calculator estimates total quantity only; it does not replace agronomic advice.")}</p></div>
              <div className="space-y-5"><div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6"><h3 className="font-bold">{t("Plan around the forecast")}</h3><p className="mt-1 text-xs text-[#8a978f]">{t("A few simple reminders for your fields.")}</p><div className="mt-4 space-y-3">{[{ icon: CloudRain, title: "Check rain before spraying", desc: "Rain can wash treatments off leaves. Follow the product label.", tint: "text-[#55849e] bg-[#eef6f8]" }, { icon: Droplets, title: "Check soil moisture", desc: "Avoid watering if the soil is still moist below the surface.", tint: "text-[#4c88a1] bg-[#eef6f8]" }, { icon: FileText, title: "Keep a field record", desc: "Note what you used and when to plan your next crop cycle.", tint: "text-[#8c7940] bg-[#fbf7e9]" }].map(({ icon: Icon, title, desc, tint }) => <div key={title} className="flex gap-3 rounded-xl bg-[#fafbf9] p-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tint}`}><Icon size={17} /></span><div><h4 className="text-sm font-semibold">{t(title)}</h4><p className="mt-1 text-xs leading-5 text-[#829087]">{t(desc)}</p></div></div>)}</div></div><div className="rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6"><div className="flex items-center gap-2"><Activity size={18} className="text-[#14804a]" /><h3 className="font-bold">{t("Field efficiency checklist")}</h3></div><p className="mt-1 text-xs text-[#8a978f]">{t("A practical starting point, not a farm score.")}</p><div className="mt-4 space-y-3">{["Soil test completed for this season", "Irrigation checked against rainfall", "Input amounts recorded by field", "Crop rotation planned after harvest"].map((item) => <label key={item} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[#58695e]"><input type="checkbox" className="h-4 w-4 accent-[#14804a]" />{t(item)}</label>)}</div></div></div>
            </section>
          )}

          {tab === "shop" && (
            <section className="space-y-5">
              <div className="relative overflow-hidden rounded-2xl">
                <SectionPhoto
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1500&q=80"
                  alt="Fresh crops in a sunlit agricultural field"
                  className="absolute inset-0"
                  fallback={<ShoppingBag size={32} className="text-[#3F8554]" />}
                />
                <div className="shop-photo-overlay absolute inset-0" />
                <div className="relative flex min-h-44 flex-wrap items-end justify-between gap-4 p-5 text-white sm:min-h-52 sm:p-7">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">{t("For your next growing season")}</p><h2 className="mt-1 text-2xl font-bold sm:text-3xl">{t("Farm essentials")}</h2><p className="mt-1 max-w-xl text-sm text-white/85">{t("Browse a small demo catalog of common farm supplies.")}</p></div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/15 px-3 py-2 text-sm backdrop-blur-sm"><ShoppingBag size={17} /> {t("Basket")} <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#245C3A]">{cartCount}</span></div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { title: "Certified wheat seeds", details: "HD 2967 · 40 kg bag", price: 1850, tag: "Popular", icon: Sprout, photo: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=900&q=80", alt: "Green crop rows for seed growing" },
                  { title: "Neem-based bio-fertilizer", details: "Organic · 5 litre pack", price: 690, tag: "Organic", icon: Leaf, photo: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80", alt: "Healthy crops in a green field" },
                  { title: "Drip irrigation starter kit", details: "For up to 1 acre", price: 4290, tag: "Save 12%", icon: Droplets, photo: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80", alt: "Irrigation channels between crop rows" }
                ].map(({ title, details, price, tag, icon: Icon, photo, alt }) => (
                  <article key={title} className="overflow-hidden rounded-2xl border border-[#e8eee8] bg-white">
                    <SectionPhoto src={photo} alt={alt} className="h-40 bg-[#EAF2E6]" fallback={<Icon size={44} strokeWidth={1.4} className="text-[#3F8554]" />} />
                    <div className="p-5"><span className="rounded-full bg-[#f5f7f3] px-2.5 py-1 text-[10px] font-semibold text-[#718077]">{t(tag)}</span><h3 className="mt-3 font-bold">{t(title)}</h3><p className="mt-1 text-xs text-[#89958c]">{t(details)}</p><div className="mt-5 flex items-center justify-between"><span className="text-lg font-bold">{money(price)}</span><button onClick={() => setCartCount((count) => count + 1)} className="flex min-h-10 items-center gap-1.5 rounded-lg bg-[#14804a] px-3 text-xs font-semibold text-white hover:bg-[#0f6b3c]"><Plus size={15} /> {t("Add to basket")}</button></div></div>
                  </article>
                ))}
              </div>
              <div className="rounded-2xl border border-dashed border-[#d9e5d9] bg-[#f5f9f3] p-5 text-center"><Package size={22} className="mx-auto text-[#71966e]" /><p className="mt-2 text-sm font-semibold">{t("Community buying is coming soon")}</p><p className="mt-1 text-xs text-[#849187]">{t("Group orders and local supplier listings will be available here.")}</p></div>
            </section>
          )}
        </div>
      </main>

      <button onClick={() => setAssistantOpen((open) => !open)} className="fixed bottom-5 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-[#14804a] px-4 text-sm font-semibold text-white shadow-lg shadow-[#145b3c]/20 hover:bg-[#0f6b3c]" aria-label={t("Open AI farm assistant")}><Mic size={19} /><span className="hidden sm:inline">{t("Ask an agronomist")}</span></button>
      {assistantOpen && (
        <div className="fixed bottom-[88px] right-4 z-40 flex h-[min(560px,calc(100vh-120px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[#e3eae3] bg-white shadow-2xl sm:right-5">
          <div className="flex items-center justify-between bg-[#176c43] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><Sprout size={19} /></span>
              <div><p className="text-sm font-bold">{t("Farm assistant")}</p><p className="mt-0.5 text-[10px] text-white/70">{t("Agriculture information, made simple")}</p></div>
            </div>
            <button onClick={() => setAssistantOpen(false)} className="rounded-lg p-2 hover:bg-white/10" aria-label={t("Close assistant")}><X size={18} /></button>
          </div>
          <div className="scrollbar-none flex-1 space-y-3 overflow-y-auto bg-[#f8faf7] p-4">
            {chatMessages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${message.role === "user" ? "ml-auto rounded-br-sm bg-[#14804a] text-white" : "rounded-bl-sm border border-[#e8eee8] bg-white text-[#526359]"}`}>{message.text}</div>)}
            {chatLoading && <div className="rounded-xl bg-white px-3 py-2 text-xs text-[#839087]">{t("Thinking...")}</div>}
          </div>
          <form onSubmit={(event) => void sendQuestion(event)} className="flex items-center gap-2 border-t border-[#edf0ed] bg-white p-3">
            <button type="button" onClick={startVoiceInput} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f7f1] text-[#14804a]" aria-label={t("Speak your question")}><Mic size={17} /></button>
            <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t("Ask about your crops...")} maxLength={1000} className="min-w-0 flex-1 text-sm outline-none" />
            <button disabled={!question.trim() || chatLoading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#14804a] text-white disabled:opacity-40" aria-label={t("Send question")}><Send size={16} /></button>
          </form>
        </div>
      )}

      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#152b20]/45 p-4" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
          <form onSubmit={saveProfile} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <SectionPhoto
                  src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1200&q=80"
                  alt="Farmer standing among green crops"
                  className="mb-5 h-32 w-full overflow-hidden rounded-xl bg-[#EAF2E6] sm:h-40"
                  fallback={<Sprout size={28} className="text-[#3F8554]" />}
                />
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5eb] text-[#14804a]"><Sprout size={22} /></span>
                <h2 id="onboarding-title" className="mt-4 text-xl font-bold">{t("Your farm details")}</h2>
                <p className="mt-1 text-sm leading-5 text-[#7b8980]">{t("Choose your state, district and village to get local weather.")}</p>
              </div>
              <button type="button" onClick={() => setShowOnboarding(false)} className="rounded-lg p-2 text-[#89958c] hover:bg-[#f5f7f4]" aria-label={t("Close farm profile")}><X size={18} /></button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold">{t("Your name")}
                <input value={onboardName} onChange={(event) => setOnboardName(event.target.value)} placeholder={farmerName} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#e0e7e0] px-3 text-sm font-normal" />
              </label>
              <label className="block text-sm font-semibold">{t("State / union territory")}
                <select value={onboardState} onChange={(event) => {
                  setOnboardState(event.target.value);
                  setDistrictInput("");
                  setSelectedDistrict("");
                  setSelectedDistrictPlace(null);
                  setDistrictResults([]);
                  setVillageInput("");
                  setSelectedVillage(null);
                  setVillageResults([]);
                  setLocationError("");
                }} className="mt-1.5 min-h-12 w-full rounded-xl border border-[#e0e7e0] bg-white px-3 text-sm font-normal">
                  {indianStates.map((state) => <option key={state}>{state}</option>)}
                </select>
              </label>
              <div className="relative">
                <label htmlFor="farm-district" className="block text-sm font-semibold">{t("District")}</label>
                <input id="farm-district" required autoComplete="off" value={districtInput} onChange={(event) => {
                  setDistrictInput(event.target.value);
                  setSelectedDistrict("");
                  setSelectedDistrictPlace(null);
                  setDistrictResults([]);
                  setVillageInput("");
                  setSelectedVillage(null);
                  setLocationError("");
                }} className="mt-1.5 min-h-12 w-full rounded-xl border border-[#e0e7e0] px-3 text-sm font-normal" placeholder={t("Type a district or nearby town")} />
                {districtLoading && <p className="mt-1 text-xs text-[#87938a]">{t("Searching districts...")}</p>}
                {districtResults.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-[#e2e9e2] bg-white p-1 shadow-lg">
                    {uniqueDistrictResults.map((place) => (
                      <button type="button" key={`${place.district}-${place.latitude}`} onClick={() => selectDistrict(place)} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm hover:bg-[#f1f7ef]">
                        <MapPin size={15} className="shrink-0 text-[#14804a]" /><span><strong>{place.district || place.name}</strong><span className="ml-1 text-xs text-[#839087]">{t("near")} {place.name}</span></span>
                      </button>
                    ))}
                  </div>
                )}
                {selectedDistrict && <p className="mt-1 text-xs text-[#64816b]">{t("Selected district:")} {selectedDistrict}</p>}
              </div>
              <div className="relative">
                <label htmlFor="farm-village" className="block text-sm font-semibold">{t("Village / town")} <span className="font-normal text-[#8b978e]">{t("(optional)")}</span></label>
                <input id="farm-village" autoComplete="off" disabled={!selectedDistrict} value={villageInput} onChange={(event) => {
                  setVillageInput(event.target.value);
                  setSelectedVillage(null);
                  setVillageResults([]);
                  setLocationError("");
                }} className="mt-1.5 min-h-12 w-full rounded-xl border border-[#e0e7e0] px-3 text-sm font-normal disabled:bg-[#f5f7f4]" placeholder={selectedDistrict ? t("Type your village or town") : t("Select a district first")} />
                {villageLoading && <p className="mt-1 text-xs text-[#87938a]">{t("Searching villages and towns...")}</p>}
                {villageResults.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-[#e2e9e2] bg-white p-1 shadow-lg">
                    {villageResults.map((place) => (
                      <button type="button" key={`${place.name}-${place.latitude}`} onClick={() => selectVillage(place)} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm hover:bg-[#f1f7ef]">
                        <MapPin size={15} className="shrink-0 text-[#14804a]" /><span>{place.name}<span className="ml-1 text-xs text-[#839087]">{place.district}</span></span>
                      </button>
                    ))}
                  </div>
                )}
                {selectedVillage && <p className="mt-1 text-xs text-[#64816b]">{t("Weather coordinates selected for")} {selectedVillage.name}.</p>}
              </div>
              {locationError && <p role="alert" className="text-sm text-[#b54136]">{locationError}</p>}
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold">{t("Farm size (acres)")}
                  <input type="number" min="0.1" step="0.1" value={onboardSize} onChange={(event) => setOnboardSize(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#e0e7e0] px-3 text-sm font-normal" />
                </label>
                <label className="block text-sm font-semibold">{t("Main crop")}
                  <select value={onboardCrop} onChange={(event) => setOnboardCrop(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#e0e7e0] bg-white px-3 text-sm font-normal">{crops.map((crop) => <option key={crop}>{t(crop)}</option>)}</select>
                </label>
              </div>
            </div>
            <button className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#14804a] text-sm font-semibold text-white hover:bg-[#0f6b3c]"><Check size={17} /> {t("Save my farm")}</button>
            <p className="mt-3 text-center text-[11px] text-[#89958c]">{t("Locations are searched from a global geocoding directory. You can update these details anytime.")}</p>
          </form>
        </div>
      )}
    </div>
  );
}
