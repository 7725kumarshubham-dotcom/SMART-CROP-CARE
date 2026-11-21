"use client";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import {
  Activity,
  ArrowRight,
  AudioLines,
  Bell,
  BookOpen,
  Bug,
  CalendarDays,
  Check,
  ChevronDown,
  Cloud,
  CloudRain,
  Droplets,
  ExternalLink,
  FileText,
  FlaskConical,
  Globe2,
  Heart,
  Landmark,
  Leaf,
  MapPin,
  Menu,
  Mic,
  Minus,
  Moon,
  Package,
  LogOut,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Sprout,
  Sun,
  ThermometerSun,
  TrendingUp,
  Upload,
  UserRound,
  Volume2,
  Wind,
  X
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";
import { indianStates } from "./india-locations.js";
import { useNavigate } from "react-router-dom";
import GovernmentSchemesPanel from "./GovernmentSchemesPanel.jsx";
function localDateKey(date = /* @__PURE__ */ new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const cropGuides = [
  {
    crop: "Wheat",
    season: "Rabi \xB7 Oct\u2013Dec",
    soil: "Well-drained loam",
    duration: "110\u2013140 days",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Golden wheat growing in a farm field"
  },
  {
    crop: "Rice",
    season: "Kharif \xB7 Jun\u2013Aug",
    soil: "Clay or alluvial soil",
    duration: "120\u2013150 days",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Green rice plants growing in a paddy field"
  },
  {
    crop: "Onion",
    season: "Rabi \xB7 Oct\u2013Dec",
    soil: "Loose, well-drained loam",
    duration: "100\u2013120 days",
    image: "/crops/onion.jpg",
    imageAlt: "Freshly harvested onions in a crate"
  }
];
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Activity },
  { id: "doctor", label: "Crop doctor", icon: Bug },
  { id: "diary", label: "Crop diary", icon: BookOpen },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "soil", label: "Soil testing", icon: FlaskConical },
  { id: "market", label: "Mandi prices", icon: TrendingUp },
  { id: "schemes", label: "Government schemes", icon: Landmark },
  { id: "efficiency", label: "Farm planner", icon: Sprout },
  { id: "shop", label: "Farm shop", icon: ShoppingBag }
];
const translations = {
  English: {},
  Hindi: {
    Dashboard: "\u0921\u0948\u0936\u092C\u094B\u0930\u094D\u0921",
    "Crop doctor": "\u092B\u0938\u0932 \u0921\u0949\u0915\u094D\u091F\u0930",
    "Reminders": "\u0930\u093F\u092E\u093E\u0907\u0902\u0921\u0930",
    "Soil testing": "\u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A",
    "Government schemes": "\u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u090F\u0902",
    "Mandi prices": "\u092E\u0902\u0921\u0940 \u092D\u093E\u0935",
    "Crop diary": "\u092B\u0938\u0932 \u0921\u093E\u092F\u0930\u0940",
    "Farm planner": "\u0916\u0947\u0924 \u092F\u094B\u091C\u0928\u093E",
    "Farm shop": "\u0915\u0943\u0937\u093F \u0926\u0941\u0915\u093E\u0928",
    "Your farm, in good hands": "\u0906\u092A\u0915\u093E \u0916\u0947\u0924, \u0939\u092E\u093E\u0930\u0940 \u0926\u0947\u0916\u092D\u093E\u0932",
    "YOUR FARM": "\u0906\u092A\u0915\u093E \u0916\u0947\u0924",
    "Here for your farm": "\u0906\u092A\u0915\u0947 \u0916\u0947\u0924 \u0915\u0947 \u0932\u093F\u090F",
    "Talk to our agronomist assistant whenever you need a hand.": "\u0915\u0943\u0937\u093F \u0938\u0932\u093E\u0939 \u0915\u0947 \u0932\u093F\u090F \u0939\u092E\u093E\u0930\u0947 \u0938\u0939\u093E\u092F\u0915 \u0938\u0947 \u0915\u092D\u0940 \u092D\u0940 \u092C\u093E\u0924 \u0915\u0930\u0947\u0902\u0964",
    "Ask a question": "\u0938\u0935\u093E\u0932 \u092A\u0942\u091B\u0947\u0902",
    "Choose language": "\u092D\u093E\u0937\u093E \u091A\u0941\u0928\u0947\u0902",
    "Good morning,": "\u0938\u0941\u092A\u094D\u0930\u092D\u093E\u0924,",
    "Here's what's happening on your farm today.": "\u0906\u091C \u0906\u092A\u0915\u0947 \u0916\u0947\u0924 \u092E\u0947\u0902 \u0915\u094D\u092F\u093E \u0939\u094B \u0930\u0939\u093E \u0939\u0948, \u091C\u093E\u0928\u0947\u0902\u0964",
    "My farm": "\u092E\u0947\u0930\u093E \u0916\u0947\u0924",
    "Good day to check your crop rows.": "\u092B\u0938\u0932 \u0915\u0940 \u0915\u0924\u093E\u0930\u0947\u0902 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0905\u091A\u094D\u091B\u093E \u0926\u093F\u0928 \u0939\u0948\u0964",
    "Humidity": "\u0928\u092E\u0940",
    "Rain chance": "\u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E",
    "Wind": "\u0939\u0935\u093E",
    "YOUR DAILY BRIEF": "\u0906\u091C \u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940",
    "Farm weather, in a minute": "\u090F\u0915 \u092E\u093F\u0928\u091F \u092E\u0947\u0902 \u092E\u094C\u0938\u092E \u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940",
    "Listen to briefing": "\u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0938\u0941\u0928\u0947\u0902",
    "Pause briefing": "\u0930\u094B\u0915\u0947\u0902",
    "Resume briefing": "\u092B\u093F\u0930 \u0938\u0941\u0928\u0947\u0902",
    "Replay": "\u0926\u094B\u092C\u093E\u0930\u093E \u0938\u0941\u0928\u0947\u0902",
    "7-day forecast": "7 \u0926\u093F\u0928 \u0915\u093E \u092E\u094C\u0938\u092E",
    "Plan field work around the weather": "\u092E\u094C\u0938\u092E \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u0916\u0947\u0924 \u0915\u0947 \u0915\u093E\u092E \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u092C\u0928\u093E\u090F\u0902",
    "Choose farm": "\u0916\u0947\u0924 \u091A\u0941\u0928\u0947\u0902",
    "Use my location": "\u092E\u0947\u0930\u0940 \u0932\u094B\u0915\u0947\u0936\u0928 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902",
    "Field tip:": "\u0916\u0947\u0924 \u0915\u0940 \u0938\u0932\u093E\u0939:",
    "Your farm at a glance": "\u0906\u092A\u0915\u0947 \u0916\u0947\u0924 \u0915\u0940 \u090F\u0915 \u091D\u0932\u0915",
    "A quick look at your fields": "\u0906\u092A\u0915\u0947 \u0916\u0947\u0924\u094B\u0902 \u0915\u0940 \u0938\u0902\u0915\u094D\u0937\u093F\u092A\u094D\u0924 \u091C\u093E\u0928\u0915\u093E\u0930\u0940",
    "Cultivated area": "\u0916\u0947\u0924\u0940 \u0915\u093E \u0915\u094D\u0937\u0947\u0924\u094D\u0930",
    "Main crop": "\u092E\u0941\u0916\u094D\u092F \u092B\u0938\u0932",
    "Next field task": "\u0905\u0917\u0932\u093E \u0916\u0947\u0924 \u0915\u093E \u0915\u093E\u092E",
    "Tomorrow": "\u0915\u0932",
    "Walk the field and check soil moisture before irrigation.": "\u0938\u093F\u0902\u091A\u093E\u0908 \u0938\u0947 \u092A\u0939\u0932\u0947 \u0916\u0947\u0924 \u092E\u0947\u0902 \u091C\u093E\u0915\u0930 \u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u0940 \u0928\u092E\u0940 \u091C\u093E\u0902\u091A\u0947\u0902\u0964",
    "Today's mandi snapshot": "\u0906\u091C \u0915\u0947 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935",
    "Latest sample modal prices \xB7 \u20B9 per quintal": "\u0928\u092E\u0942\u0928\u093E \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \xB7 \u20B9 \u092A\u094D\u0930\u0924\u093F \u0915\u094D\u0935\u093F\u0902\u091F\u0932",
    "All prices": "\u0938\u092D\u0940 \u092D\u093E\u0935",
    "Quick actions": "\u091C\u0932\u094D\u0926\u0940 \u0915\u0930\u0947\u0902",
    "Tools for your next field visit": "\u0905\u0917\u0932\u0940 \u0916\u0947\u0924 \u092F\u093E\u0924\u094D\u0930\u093E \u0915\u0947 \u0932\u093F\u090F \u0938\u093E\u0927\u0928",
    "Scan a crop problem": "\u092B\u0938\u0932 \u0915\u0940 \u0938\u092E\u0938\u094D\u092F\u093E \u091C\u093E\u0902\u091A\u0947\u0902",
    "Get a quick plant health check": "\u092B\u0938\u0932 \u0915\u0947 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0915\u0940 \u0924\u0941\u0930\u0902\u0924 \u091C\u093E\u0902\u091A \u0915\u0930\u0947\u0902",
    "Book a soil test": "\u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u092C\u0941\u0915 \u0915\u0930\u0947\u0902",
    "Find a nearby testing lab": "\u092A\u093E\u0938 \u0915\u0940 \u091C\u093E\u0902\u091A \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u0916\u094B\u091C\u0947\u0902",
    "Plan fertilizer use": "\u0916\u093E\u0926 \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0924\u092F \u0915\u0930\u0947\u0902",
    "Estimate amounts for your fields": "\u0905\u092A\u0928\u0947 \u0916\u0947\u0924 \u0915\u0947 \u0932\u093F\u090F \u092E\u093E\u0924\u094D\u0930\u093E \u091C\u093E\u0928\u0947\u0902",
    "Select a language": "\u092D\u093E\u0937\u093E \u091A\u0941\u0928\u0947\u0902",
    "Light mode": "\u0932\u093E\u0907\u091F \u092E\u094B\u0921",
    "Dark mode": "\u0921\u093E\u0930\u094D\u0915 \u092E\u094B\u0921",
    "Your farm": "\u0906\u092A\u0915\u093E \u0916\u0947\u0924",
    "Local weather": "\u0938\u094D\u0925\u093E\u0928\u0940\u092F \u092E\u094C\u0938\u092E",
    "Saved forecast": "\u0938\u0939\u0947\u091C\u093E \u0917\u092F\u093E \u092A\u0942\u0930\u094D\u0935\u093E\u0928\u0941\u092E\u093E\u0928",
    "Weather loading": "\u092E\u094C\u0938\u092E \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u093E \u0939\u0948",
    "Search crops, markets...": "\u092B\u0938\u0932\u0947\u0902, \u092E\u0902\u0921\u093F\u092F\u093E\u0902 \u0916\u094B\u091C\u0947\u0902...",
    "Search crops and markets": "\u092B\u0938\u0932\u0947\u0902 \u0914\u0930 \u092E\u0902\u0921\u093F\u092F\u093E\u0902 \u0916\u094B\u091C\u0947\u0902",
    "Search": "\u0916\u094B\u091C\u0947\u0902",
    "Weather": "\u092E\u094C\u0938\u092E",
    "Notifications": "\u0938\u0942\u091A\u0928\u093E\u090F\u0902",
    "Edit farm profile": "\u0916\u0947\u0924 \u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0938\u0902\u092A\u093E\u0926\u093F\u0924 \u0915\u0930\u0947\u0902",
    "Welcome back": "\u0935\u093E\u092A\u0938\u0940 \u092A\u0930 \u0938\u094D\u0935\u093E\u0917\u0924 \u0939\u0948",
    "Your farm overview, crop recommendations, and market insights in one place.": "\u0906\u092A\u0915\u0947 \u0916\u0947\u0924 \u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940, \u092B\u0938\u0932 \u0938\u0941\u091D\u093E\u0935 \u0914\u0930 \u092C\u093E\u091C\u093E\u0930 \u092D\u093E\u0935 \u090F\u0915 \u0939\u0940 \u091C\u0917\u0939\u0964",
    "Practical insights for your farm": "\u0906\u092A\u0915\u0947 \u0916\u0947\u0924 \u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u094B\u0917\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940",
    "Grow Smarter. Sell Better.": "\u0938\u092E\u091D\u0926\u093E\u0930\u0940 \u0938\u0947 \u0909\u0917\u093E\u090F\u0902\u0964 \u092C\u0947\u0939\u0924\u0930 \u092C\u0947\u091A\u0947\u0902\u0964",
    "Your intelligent companion for healthier crops, smarter farming decisions, and better market opportunities.": "\u0938\u094D\u0935\u0938\u094D\u0925 \u092B\u0938\u0932\u094B\u0902, \u092C\u0947\u0939\u0924\u0930 \u0916\u0947\u0924\u0940 \u0915\u0947 \u092B\u0948\u0938\u0932\u094B\u0902 \u0914\u0930 \u0905\u091A\u094D\u091B\u0947 \u092C\u093E\u091C\u093E\u0930 \u0905\u0935\u0938\u0930\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u0906\u092A\u0915\u093E \u092D\u0930\u094B\u0938\u0947\u092E\u0902\u0926 \u0938\u093E\u0925\u0940\u0964",
    "Explore crop insights": "\u092B\u0938\u0932 \u0938\u0941\u091D\u093E\u0935 \u0926\u0947\u0916\u0947\u0902",
    "Check market prices": "\u092C\u093E\u091C\u093E\u0930 \u092D\u093E\u0935 \u0926\u0947\u0916\u0947\u0902",
    "SEASONAL GUIDE": "\u092E\u094C\u0938\u092E\u0940 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u093F\u0915\u093E",
    "Crop ideas to explore": "\u091C\u093E\u0928\u0928\u0947 \u092F\u094B\u0917\u094D\u092F \u092B\u0938\u0932\u0947\u0902",
    "General growing guides, not a soil diagnosis": "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0916\u0947\u0924\u0940 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928, \u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u0940 \u091C\u093E\u0902\u091A \u0928\u0939\u0940\u0902",
    "SAMPLE": "\u0928\u092E\u0942\u0928\u093E",
    "LIVE": "\u0932\u093E\u0907\u0935",
    "market price": "\u092C\u093E\u091C\u093E\u0930 \u092D\u093E\u0935",
    "per quintal": "\u092A\u094D\u0930\u0924\u093F \u0915\u094D\u0935\u093F\u0902\u091F\u0932",
    "Open mandi insights for available prices": "\u0909\u092A\u0932\u092C\u094D\u0927 \u092D\u093E\u0935\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u092E\u0902\u0921\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0916\u094B\u0932\u0947\u0902",
    "Weather conditions": "\u092E\u094C\u0938\u092E \u0915\u0940 \u0938\u094D\u0925\u093F\u0924\u093F",
    "Screening result ready": "\u092B\u0938\u0932 \u091C\u093E\u0902\u091A \u0915\u093E \u092A\u0930\u093F\u0923\u093E\u092E \u0924\u0948\u092F\u093E\u0930",
    "No crop scans yet": "\u0905\u092D\u0940 \u0924\u0915 \u092B\u0938\u0932 \u0915\u0940 \u091C\u093E\u0902\u091A \u0928\u0939\u0940\u0902 \u0939\u0941\u0908",
    "Screening aid \xB7 not a confirmed diagnosis": "\u092A\u094D\u0930\u093E\u0930\u0902\u092D\u093F\u0915 \u091C\u093E\u0902\u091A \xB7 \u092A\u0941\u0937\u094D\u091F\u093F \u0915\u093F\u092F\u093E \u0939\u0941\u0906 \u0928\u093F\u0926\u093E\u0928 \u0928\u0939\u0940\u0902",
    "Scan a plant to check for possible issues": "\u0938\u0902\u092D\u093E\u0935\u093F\u0924 \u0938\u092E\u0938\u094D\u092F\u093E\u0913\u0902 \u0915\u0947 \u0932\u093F\u090F \u092A\u094C\u0927\u0947 \u0915\u0940 \u091C\u093E\u0902\u091A \u0915\u0930\u0947\u0902",
    "EXPLORE YOUR OPTIONS": "\u0905\u092A\u0928\u0947 \u0935\u093F\u0915\u0932\u094D\u092A \u0926\u0947\u0916\u0947\u0902",
    "Seasonal crop guide": "\u092E\u094C\u0938\u092E\u0940 \u092B\u0938\u0932 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u093F\u0915\u093E",
    "Starting points for planning. Confirm local suitability with your soil report or KVK.": "\u092F\u094B\u091C\u0928\u093E \u0915\u0947 \u0932\u093F\u090F \u0936\u0941\u0930\u0941\u0906\u0924\u0940 \u0938\u0941\u091D\u093E\u0935\u0964 \u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0909\u092A\u092F\u0941\u0915\u094D\u0924\u0924\u093E \u0915\u0940 \u092A\u0941\u0937\u094D\u091F\u093F \u092E\u093F\u091F\u094D\u091F\u0940 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u092F\u093E \u0915\u0943\u0937\u093F \u0935\u093F\u091C\u094D\u091E\u093E\u0928 \u0915\u0947\u0902\u0926\u094D\u0930 \u0938\u0947 \u0915\u0930\u0947\u0902\u0964",
    "General guidance \xB7 not personalized": "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0938\u0932\u093E\u0939 \xB7 \u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0917\u0924 \u0928\u0939\u0940\u0902",
    "Soil guide": "\u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u093E \u0938\u0941\u091D\u093E\u0935",
    "Growing duration": "\u0909\u0917\u0928\u0947 \u0915\u0940 \u0905\u0935\u0927\u093F",
    "Indicative mandi modal price \xB7 \u20B9/quintal": "\u0905\u0928\u0941\u092E\u093E\u0928\u093F\u0924 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \xB7 \u20B9/\u0915\u094D\u0935\u093F\u0902\u091F\u0932",
    "sample data": "\u0928\u092E\u0942\u0928\u093E \u0921\u0947\u091F\u093E",
    "live data": "\u0932\u093E\u0907\u0935 \u0921\u0947\u091F\u093E",
    "No price available for this crop": "\u0907\u0938 \u092B\u0938\u0932 \u0915\u093E \u092D\u093E\u0935 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u0939\u0940\u0902",
    "Ask about": "\u092A\u0942\u091B\u0947\u0902:",
    "Your Smart Farming Assistant": "\u0906\u092A\u0915\u093E \u0938\u094D\u092E\u093E\u0930\u094D\u091F \u0915\u0943\u0937\u093F \u0938\u0939\u093E\u092F\u0915",
    "Get guidance on crop selection, soil health, pest management, irrigation, and market opportunities.": "\u092B\u0938\u0932 \u091A\u092F\u0928, \u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u0947 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F, \u0915\u0940\u091F \u092A\u094D\u0930\u092C\u0902\u0927\u0928, \u0938\u093F\u0902\u091A\u093E\u0908 \u0914\u0930 \u092C\u093E\u091C\u093E\u0930 \u0915\u0947 \u0905\u0935\u0938\u0930\u094B\u0902 \u092A\u0930 \u0938\u0932\u093E\u0939 \u092A\u093E\u090F\u0902\u0964",
    "Which crop is suitable for my soil?": "\u092E\u0947\u0930\u0940 \u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u0947 \u0932\u093F\u090F \u0915\u094C\u0928 \u0938\u0940 \u092B\u0938\u0932 \u0909\u092A\u092F\u0941\u0915\u094D\u0924 \u0939\u0948?",
    "How can I identify crop diseases?": "\u092E\u0948\u0902 \u092B\u0938\u0932 \u0915\u0947 \u0930\u094B\u0917\u094B\u0902 \u0915\u0940 \u092A\u0939\u091A\u093E\u0928 \u0915\u0948\u0938\u0947 \u0915\u0930\u0942\u0902?",
    "Which mandi offers a better price?": "\u0915\u093F\u0938 \u092E\u0902\u0921\u0940 \u092E\u0947\u0902 \u092C\u0947\u0939\u0924\u0930 \u092D\u093E\u0935 \u092E\u093F\u0932\u0924\u093E \u0939\u0948?",
    "When should I irrigate my crops?": "\u092E\u0941\u091D\u0947 \u092B\u0938\u0932\u094B\u0902 \u0915\u0940 \u0938\u093F\u0902\u091A\u093E\u0908 \u0915\u092C \u0915\u0930\u0928\u0940 \u091A\u093E\u0939\u093F\u090F?",
    "Ask about your farm...": "\u0905\u092A\u0928\u0947 \u0916\u0947\u0924 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092A\u0942\u091B\u0947\u0902...",
    "Ask the farming assistant": "\u0915\u0943\u0937\u093F \u0938\u0939\u093E\u092F\u0915 \u0938\u0947 \u092A\u0942\u091B\u0947\u0902",
    "Answers are general information. Confirm important decisions with local agricultural experts.": "\u0909\u0924\u094D\u0924\u0930 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0939\u0948\u0902\u0964 \u092E\u0939\u0924\u094D\u0935\u092A\u0942\u0930\u094D\u0923 \u092B\u0948\u0938\u0932\u094B\u0902 \u0915\u0940 \u092A\u0941\u0937\u094D\u091F\u093F \u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0915\u0943\u0937\u093F \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0938\u0947 \u0915\u0930\u0947\u0902\u0964",
    "PLANT HEALTH": "\u092A\u094C\u0927\u094B\u0902 \u0915\u093E \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F",
    "A closer look can help": "\u0927\u094D\u092F\u093E\u0928 \u0938\u0947 \u091C\u093E\u0902\u091A\u0928\u093E \u092E\u0926\u0926\u0917\u093E\u0930 \u0939\u0948",
    "Upload a clear leaf photo for an AI screening. Results are a starting point, not a confirmed diagnosis.": "\u090F\u0906\u0908 \u091C\u093E\u0902\u091A \u0915\u0947 \u0932\u093F\u090F \u092A\u0924\u094D\u0924\u0940 \u0915\u0940 \u0938\u093E\u092B \u0924\u0938\u094D\u0935\u0940\u0930 \u0905\u092A\u0932\u094B\u0921 \u0915\u0930\u0947\u0902\u0964 \u092A\u0930\u093F\u0923\u093E\u092E \u0936\u0941\u0930\u0941\u0906\u0924\u0940 \u0938\u0902\u0915\u0947\u0924 \u0939\u0948\u0902, \u092A\u0941\u0937\u094D\u091F\u093F \u0915\u093F\u092F\u093E \u0939\u0941\u0906 \u0928\u093F\u0926\u093E\u0928 \u0928\u0939\u0940\u0902\u0964",
    "Open crop doctor": "\u092B\u0938\u0932 \u0921\u0949\u0915\u094D\u091F\u0930 \u0916\u094B\u0932\u0947\u0902",
    "Feels like": "\u092E\u0939\u0938\u0942\u0938 \u0939\u094B \u0930\u0939\u093E \u0939\u0948",
    "Checking today's forecast and field conditions...": "\u0906\u091C \u0915\u093E \u092E\u094C\u0938\u092E \u0914\u0930 \u0916\u0947\u0924 \u0915\u0940 \u0938\u094D\u0925\u093F\u0924\u093F \u091C\u093E\u0902\u091A\u0940 \u091C\u093E \u0930\u0939\u0940 \u0939\u0948...",
    "Check the latest forecast before field work.": "\u0916\u0947\u0924 \u092E\u0947\u0902 \u0915\u093E\u092E \u0938\u0947 \u092A\u0939\u0932\u0947 \u0924\u093E\u091C\u093E \u092E\u094C\u0938\u092E \u092A\u0942\u0930\u094D\u0935\u093E\u0928\u0941\u092E\u093E\u0928 \u0926\u0947\u0916\u0947\u0902\u0964",
    "Sample modal prices": "\u0928\u092E\u0942\u0928\u093E \u092E\u0902\u0921\u0940 \u092D\u093E\u0935",
    "Live modal prices": "\u0932\u093E\u0907\u0935 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935",
    "today": "\u0906\u091C",
    "Basket": "\u091F\u094B\u0915\u0930\u0940",
    "Ask an agronomist": "\u0915\u0943\u0937\u093F \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0938\u0947 \u092A\u0942\u091B\u0947\u0902",
    "Open AI farm assistant": "\u090F\u0906\u0908 \u0915\u0943\u0937\u093F \u0938\u0939\u093E\u092F\u0915 \u0916\u094B\u0932\u0947\u0902",
    "Farm assistant": "\u0915\u0943\u0937\u093F \u0938\u0939\u093E\u092F\u0915",
    "Agriculture information, made simple": "\u0916\u0947\u0924\u0940 \u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940, \u0906\u0938\u093E\u0928 \u092D\u093E\u0937\u093E \u092E\u0947\u0902",
    "Close assistant": "\u0938\u0939\u093E\u092F\u0915 \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
    "Thinking...": "\u0938\u094B\u091A \u0930\u0939\u093E \u0939\u0948...",
    "Speak your question": "\u0905\u092A\u0928\u093E \u0938\u0935\u093E\u0932 \u092C\u094B\u0932\u0947\u0902",
    "Send question": "\u0938\u0935\u093E\u0932 \u092D\u0947\u091C\u0947\u0902",
    "Ask about your crops...": "\u0905\u092A\u0928\u0940 \u092B\u0938\u0932\u094B\u0902 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092A\u0942\u091B\u0947\u0902...",
    "Open navigation": "\u0928\u0947\u0935\u093F\u0917\u0947\u0936\u0928 \u0916\u094B\u0932\u0947\u0902",
    "Close menu": "\u092E\u0947\u0928\u0942 \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
    "Rabi \xB7 Oct\u2013Dec": "\u0930\u092C\u0940 \xB7 \u0905\u0915\u094D\u091F\u0942\u092C\u0930\u2013\u0926\u093F\u0938\u0902\u092C\u0930",
    "Kharif \xB7 Jun\u2013Aug": "\u0916\u0930\u0940\u092B \xB7 \u091C\u0942\u0928\u2013\u0905\u0917\u0938\u094D\u0924",
    "Well-drained loam": "\u0905\u091A\u094D\u091B\u0940 \u091C\u0932-\u0928\u093F\u0915\u093E\u0938\u0940 \u0935\u093E\u0932\u0940 \u0926\u094B\u092E\u091F \u092E\u093F\u091F\u094D\u091F\u0940",
    "Clay or alluvial soil": "\u091A\u093F\u0915\u0928\u0940 \u092F\u093E \u091C\u0932\u094B\u0922\u093C \u092E\u093F\u091F\u094D\u091F\u0940",
    "Loose, well-drained loam": "\u092D\u0941\u0930\u092D\u0941\u0930\u0940, \u0905\u091A\u094D\u091B\u0940 \u091C\u0932-\u0928\u093F\u0915\u093E\u0938\u0940 \u0935\u093E\u0932\u0940 \u0926\u094B\u092E\u091F \u092E\u093F\u091F\u094D\u091F\u0940",
    "110\u2013140 days": "110\u2013140 \u0926\u093F\u0928",
    "120\u2013150 days": "120\u2013150 \u0926\u093F\u0928",
    "100\u2013120 days": "100\u2013120 \u0926\u093F\u0928",
    "Today": "\u0906\u091C",
    "Sun": "\u0930\u0935\u093F",
    "Mon": "\u0938\u094B\u092E",
    "Tue": "\u092E\u0902\u0917\u0932",
    "Wed": "\u092C\u0941\u0927",
    "Thu": "\u0917\u0941\u0930\u0941",
    "Fri": "\u0936\u0941\u0915\u094D\u0930",
    "Clear sky": "\u0938\u093E\u092B \u0906\u0938\u092E\u093E\u0928",
    "Partly cloudy": "\u0906\u0902\u0936\u093F\u0915 \u092C\u093E\u0926\u0932",
    "Overcast": "\u092C\u093E\u0926\u0932 \u091B\u093E\u090F \u0939\u0941\u090F",
    "Fog": "\u0915\u094B\u0939\u0930\u093E",
    "Drizzle or rain": "\u092C\u0942\u0902\u0926\u093E\u092C\u093E\u0902\u0926\u0940 \u092F\u093E \u092C\u093E\u0930\u093F\u0936",
    "Rain showers": "\u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u092C\u094C\u091B\u093E\u0930\u0947\u0902",
    "Thunderstorms": "\u0906\u0902\u0927\u0940-\u0924\u0942\u092B\u093E\u0928",
    "Snow": "\u092C\u0930\u094D\u092B\u092C\u093E\u0930\u0940",
    "Snow showers": "\u092C\u0930\u094D\u092B \u0915\u0940 \u092C\u094C\u091B\u093E\u0930\u0947\u0902",
    "Current conditions": "\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092E\u094C\u0938\u092E",
    "Loading weather": "\u092E\u094C\u0938\u092E \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u093E \u0939\u0948",
    "Conditions look mostly dry. Check soil moisture before your next irrigation.": "\u092E\u094C\u0938\u092E \u0905\u0927\u093F\u0915\u0924\u0930 \u0938\u0942\u0916\u093E \u0939\u0948\u0964 \u0905\u0917\u0932\u0940 \u0938\u093F\u0902\u091A\u093E\u0908 \u0938\u0947 \u092A\u0939\u0932\u0947 \u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u0940 \u0928\u092E\u0940 \u091C\u093E\u0902\u091A\u0947\u0902\u0964",
    "Rain is likely on": "\u0907\u0938 \u0926\u093F\u0928 \u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u0939\u0948:",
    "Avoid spraying pesticides before or during the showers.": "\u092C\u093E\u0930\u093F\u0936 \u0938\u0947 \u092A\u0939\u0932\u0947 \u092F\u093E \u092C\u093E\u0930\u093F\u0936 \u0915\u0947 \u0926\u094C\u0930\u093E\u0928 \u0915\u0940\u091F\u0928\u093E\u0936\u0915 \u0915\u093E \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0928 \u0915\u0930\u0947\u0902\u0964",
    "Ask": "\u092A\u0942\u091B\u0947\u0902",
    "What should I consider before growing {crop} near {location}?": "{location} \u0915\u0947 \u092A\u093E\u0938 {crop} \u0909\u0917\u093E\u0928\u0947 \u0938\u0947 \u092A\u0939\u0932\u0947 \u092E\u0941\u091D\u0947 \u0915\u093F\u0928 \u092C\u093E\u0924\u094B\u0902 \u092A\u0930 \u0935\u093F\u091A\u093E\u0930 \u0915\u0930\u0928\u093E \u091A\u093E\u0939\u093F\u090F?",
    Wheat: "\u0917\u0947\u0939\u0942\u0902",
    Rice: "\u0927\u093E\u0928",
    Onion: "\u092A\u094D\u092F\u093E\u091C",
    Cotton: "\u0915\u092A\u093E\u0938",
    Tomato: "\u091F\u092E\u093E\u091F\u0930",
    Potato: "\u0906\u0932\u0942",
    rain: "\u092C\u093E\u0930\u093F\u0936",
    "AI crop health doctor": "\u090F\u0906\u0908 \u092B\u0938\u0932 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0921\u0949\u0915\u094D\u091F\u0930",
    "Take a clear photo of a leaf or affected plant. We'll help you understand what might be happening.": "\u092A\u0924\u094D\u0924\u0940 \u092F\u093E \u092A\u094D\u0930\u092D\u093E\u0935\u093F\u0924 \u092A\u094C\u0927\u0947 \u0915\u0940 \u0938\u093E\u092B \u0924\u0938\u094D\u0935\u0940\u0930 \u0932\u0947\u0902\u0964 \u0907\u0938\u0938\u0947 \u0938\u0902\u092D\u093E\u0935\u093F\u0924 \u0938\u092E\u0938\u094D\u092F\u093E \u0938\u092E\u091D\u0928\u0947 \u092E\u0947\u0902 \u092E\u0926\u0926 \u092E\u093F\u0932\u0947\u0917\u0940\u0964",
    "What crop are you checking?": "\u0906\u092A \u0915\u093F\u0938 \u092B\u0938\u0932 \u0915\u0940 \u091C\u093E\u0902\u091A \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902?",
    "Diagnosis history": "\u092B\u0938\u0932 \u091C\u093E\u0902\u091A \u0915\u093E \u0907\u0924\u093F\u0939\u093E\u0938",
    "Past crop checks are saved to your account. Uploaded photos are not stored.": "\u092A\u093F\u091B\u0932\u0940 \u092B\u0938\u0932 \u091C\u093E\u0902\u091A \u0906\u092A\u0915\u0947 \u0916\u093E\u0924\u0947 \u092E\u0947\u0902 \u0938\u0939\u0947\u091C\u0940 \u091C\u093E\u0924\u0940 \u0939\u0948\u0902\u0964 \u0905\u092A\u0932\u094B\u0921 \u0915\u0940 \u0917\u0908 \u0924\u0938\u094D\u0935\u0940\u0930\u0947\u0902 \u0938\u0939\u0947\u091C\u0940 \u0928\u0939\u0940\u0902 \u091C\u093E\u0924\u0940\u0902\u0964",
    "No saved diagnoses yet": "\u0905\u092D\u0940 \u0924\u0915 \u0915\u094B\u0908 \u091C\u093E\u0902\u091A \u092A\u0930\u093F\u0923\u093E\u092E \u0938\u0939\u0947\u091C\u093E \u0928\u0939\u0940\u0902 \u0917\u092F\u093E",
    "Your recent crop checks will appear here.": "\u0906\u092A\u0915\u0940 \u0939\u093E\u0932 \u0915\u0940 \u092B\u0938\u0932 \u091C\u093E\u0902\u091A \u092F\u0939\u093E\u0902 \u0926\u093F\u0916\u093E\u0908 \u0926\u0947\u0902\u0917\u0940\u0964",
    "Loading diagnosis history...": "\u092B\u0938\u0932 \u091C\u093E\u0902\u091A \u0915\u093E \u0907\u0924\u093F\u0939\u093E\u0938 \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u093E \u0939\u0948...",
    "Upload or take a photo": "\u0924\u0938\u094D\u0935\u0940\u0930 \u0905\u092A\u0932\u094B\u0921 \u0915\u0930\u0947\u0902 \u092F\u093E \u0932\u0947\u0902",
    "Drop an image here, or browse \xB7 JPG, PNG or WebP \xB7 up to 10 MB": "\u0924\u0938\u094D\u0935\u0940\u0930 \u092F\u0939\u093E\u0902 \u091B\u094B\u0921\u093C\u0947\u0902 \u092F\u093E \u091A\u0941\u0928\u0947\u0902 \xB7 JPG, PNG \u092F\u093E WebP \xB7 \u0905\u0927\u093F\u0915\u0924\u092E 10 MB",
    "Checking your crop...": "\u0906\u092A\u0915\u0940 \u092B\u0938\u0932 \u0915\u0940 \u091C\u093E\u0902\u091A \u0939\u094B \u0930\u0939\u0940 \u0939\u0948...",
    "Check crop health": "\u092B\u0938\u0932 \u0915\u093E \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u091C\u093E\u0902\u091A\u0947\u0902",
    "Record planting, irrigation, and fieldwork in one place.": "\u092C\u0941\u0935\u093E\u0908, \u0938\u093F\u0902\u091A\u093E\u0908 \u0914\u0930 \u0916\u0947\u0924 \u0915\u0947 \u0915\u093E\u092E \u0915\u093E \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u090F\u0915 \u0939\u0940 \u091C\u0917\u0939 \u0930\u0916\u0947\u0902\u0964",
    "Add diary entry": "\u0921\u093E\u092F\u0930\u0940 \u092E\u0947\u0902 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u091C\u094B\u0921\u093C\u0947\u0902",
    "Activity": "\u0917\u0924\u093F\u0935\u093F\u0927\u093F",
    "Date": "\u0924\u093E\u0930\u0940\u0916",
    "Notes (optional)": "\u091F\u093F\u092A\u094D\u092A\u0923\u0940 (\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915)",
    "Add a note about this field activity...": "\u0907\u0938 \u0916\u0947\u0924 \u0915\u0947 \u0915\u093E\u092E \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u0932\u093F\u0916\u0947\u0902...",
    "Save entry": "\u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0938\u0939\u0947\u091C\u0947\u0902",
    "Saving...": "\u0938\u0939\u0947\u091C\u093E \u091C\u093E \u0930\u0939\u093E \u0939\u0948...",
    "Your recent field activity": "\u0906\u092A\u0915\u0947 \u0939\u093E\u0932 \u0915\u0947 \u0916\u0947\u0924 \u0915\u0947 \u0915\u093E\u092E",
    "No diary entries yet": "\u0905\u092D\u0940 \u0924\u0915 \u0921\u093E\u092F\u0930\u0940 \u092E\u0947\u0902 \u0915\u094B\u0908 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0928\u0939\u0940\u0902",
    "Your saved field activities will appear here.": "\u0906\u092A\u0915\u0947 \u0938\u0939\u0947\u091C\u0947 \u0917\u090F \u0916\u0947\u0924 \u0915\u0947 \u0915\u093E\u092E \u092F\u0939\u093E\u0902 \u0926\u093F\u0916\u093E\u0908 \u0926\u0947\u0902\u0917\u0947\u0964",
    "Loading diary...": "\u0921\u093E\u092F\u0930\u0940 \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u0940 \u0939\u0948...",
    "Sowing": "\u092C\u0941\u0935\u093E\u0908",
    "Irrigation": "\u0938\u093F\u0902\u091A\u093E\u0908",
    "Fertilizing": "\u0916\u093E\u0926 \u0921\u093E\u0932\u0928\u093E",
    "Spraying": "\u091B\u093F\u0921\u093C\u0915\u093E\u0935",
    "Weeding": "\u0928\u093F\u0930\u093E\u0908",
    "Harvest": "\u0915\u091F\u093E\u0908",
    "Other": "\u0905\u0928\u094D\u092F",
    "Add a reminder": "\u0930\u093F\u092E\u093E\u0907\u0902\u0921\u0930 \u091C\u094B\u0921\u093C\u0947\u0902",
    "Set a task and due date to keep track of upcoming farm work.": "\u0906\u0928\u0947 \u0935\u093E\u0932\u0947 \u0916\u0947\u0924 \u0915\u0947 \u0915\u093E\u092E \u092A\u0930 \u0928\u091C\u093C\u0930 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093E\u092E \u0914\u0930 \u0924\u093E\u0930\u0940\u0916 \u0924\u092F \u0915\u0930\u0947\u0902\u0964",
    "Task": "\u0915\u093E\u092E",
    "Crop (optional)": "\u092B\u0938\u0932 (\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915)",
    "General farm task": "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0916\u0947\u0924 \u0915\u093E \u0915\u093E\u092E",
    "Due date": "\u0926\u0947\u092F \u0924\u093E\u0930\u0940\u0916",
    "Save reminder": "\u0930\u093F\u092E\u093E\u0907\u0902\u0921\u0930 \u0938\u0939\u0947\u091C\u0947\u0902",
    "Upcoming and overdue": "\u0906\u0917\u093E\u092E\u0940 \u0914\u0930 \u0932\u0902\u092C\u093F\u0924 \u0915\u093E\u092E",
    "No reminders yet": "\u0905\u092D\u0940 \u0915\u094B\u0908 \u0930\u093F\u092E\u093E\u0907\u0902\u0921\u0930 \u0928\u0939\u0940\u0902",
    "Your saved tasks will appear here.": "\u0906\u092A\u0915\u0947 \u0938\u0939\u0947\u091C\u0947 \u0917\u090F \u0915\u093E\u092E \u092F\u0939\u093E\u0902 \u0926\u093F\u0916\u093E\u0908 \u0926\u0947\u0902\u0917\u0947\u0964",
    "Loading reminders...": "\u0930\u093F\u092E\u093E\u0907\u0902\u0921\u0930 \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u0947 \u0939\u0948\u0902...",
    "Due today": "\u0906\u091C \u0915\u093E \u0915\u093E\u092E",
    "Overdue": "\u0938\u092E\u092F \u0928\u093F\u0915\u0932 \u0917\u092F\u093E",
    "Upcoming": "\u0906\u0917\u093E\u092E\u0940",
    "Completed": "\u092A\u0942\u0930\u093E \u0939\u0941\u0906",
    "Mark complete": "\u092A\u0942\u0930\u093E \u0915\u0930\u0947\u0902",
    "Reopen": "\u092B\u093F\u0930 \u0938\u0947 \u0916\u094B\u0932\u0947\u0902",
    "Delete reminder": "\u0930\u093F\u092E\u093E\u0907\u0902\u0921\u0930 \u0939\u091F\u093E\u090F\u0902",
    "Your photo is used only to provide this result. This tool is a screening aid, not a confirmed diagnosis.": "\u0906\u092A\u0915\u0940 \u0924\u0938\u094D\u0935\u0940\u0930 \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0947\u0935\u0932 \u092F\u0939 \u092A\u0930\u093F\u0923\u093E\u092E \u0926\u0947\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0939\u094B\u0917\u093E\u0964 \u092F\u0939 \u092A\u094D\u0930\u093E\u0930\u0902\u092D\u093F\u0915 \u091C\u093E\u0902\u091A \u0939\u0948, \u092A\u0941\u0937\u094D\u091F\u093F \u0915\u093F\u092F\u093E \u0939\u0941\u0906 \u0928\u093F\u0926\u093E\u0928 \u0928\u0939\u0940\u0902\u0964",
    "Your crop check will appear here": "\u092B\u0938\u0932 \u091C\u093E\u0902\u091A \u0915\u093E \u092A\u0930\u093F\u0923\u093E\u092E \u092F\u0939\u093E\u0902 \u0926\u093F\u0916\u0947\u0917\u093E",
    "Upload a clear photo in natural light. Try to include both healthy and affected leaves.": "\u092A\u094D\u0930\u093E\u0915\u0943\u0924\u093F\u0915 \u0930\u094B\u0936\u0928\u0940 \u092E\u0947\u0902 \u0938\u093E\u092B \u0924\u0938\u094D\u0935\u0940\u0930 \u0905\u092A\u0932\u094B\u0921 \u0915\u0930\u0947\u0902\u0964 \u0938\u094D\u0935\u0938\u094D\u0925 \u0914\u0930 \u092A\u094D\u0930\u092D\u093E\u0935\u093F\u0924 \u0926\u094B\u0928\u094B\u0902 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u094B \u0936\u093E\u092E\u093F\u0932 \u0915\u0930\u0947\u0902\u0964",
    "Clear, close-up photo": "\u0938\u093E\u092B, \u092A\u093E\u0938 \u0938\u0947 \u0932\u0940 \u0917\u0908 \u0924\u0938\u094D\u0935\u0940\u0930",
    "Good natural light": "\u0905\u091A\u094D\u091B\u0940 \u092A\u094D\u0930\u093E\u0915\u0943\u0924\u093F\u0915 \u0930\u094B\u0936\u0928\u0940",
    "One plant at a time": "\u090F\u0915 \u092C\u093E\u0930 \u092E\u0947\u0902 \u090F\u0915 \u092A\u094C\u0927\u093E",
    "concern": "\u0938\u0902\u092C\u0902\u0927\u0940 \u091A\u093F\u0902\u0924\u093E",
    "Sample screening": "\u0928\u092E\u0942\u0928\u093E \u091C\u093E\u0902\u091A",
    "confidence": "\u0935\u093F\u0936\u094D\u0935\u093E\u0938 \u0938\u094D\u0924\u0930",
    "What to look for": "\u0915\u094D\u092F\u093E \u0926\u0947\u0916\u0947\u0902",
    "Gentle first steps": "\u0936\u0941\u0930\u0941\u0906\u0924\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0909\u092A\u093E\u092F",
    "Chemical treatment": "\u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u0909\u092A\u091A\u093E\u0930",
    "Prevention": "\u092C\u091A\u093E\u0935",
    "Choose a nearby lab and a time that works for you.": "\u092A\u093E\u0938 \u0915\u0940 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u0914\u0930 \u0905\u092A\u0928\u0940 \u0938\u0941\u0935\u093F\u0927\u093E \u0915\u093E \u0938\u092E\u092F \u091A\u0941\u0928\u0947\u0902\u0964",
    "Request confirmed": "\u0905\u0928\u0941\u0930\u094B\u0927 \u0915\u0940 \u092A\u0941\u0937\u094D\u091F\u093F \u0939\u0941\u0908",
    "Demo request created": "\u0921\u0947\u092E\u094B \u0905\u0928\u0941\u0930\u094B\u0927 \u092C\u0928\u093E\u092F\u093E \u0917\u092F\u093E",
    "Your appointment is saved. Show this token at the lab or mention it when arranging pickup.": "\u0906\u092A\u0915\u0940 \u092C\u0941\u0915\u093F\u0902\u0917 \u0938\u0939\u0947\u091C\u0940 \u0917\u0908 \u0939\u0948\u0964 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u092E\u0947\u0902 \u092F\u0939 \u091F\u094B\u0915\u0928 \u0926\u093F\u0916\u093E\u090F\u0902 \u092F\u093E \u0928\u092E\u0942\u0928\u093E \u0932\u0947\u0928\u0947 \u0915\u0940 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u092C\u0924\u093E\u090F\u0902\u0964",
    "This demo token is not saved yet. Connect a database to keep appointment records.": "\u092F\u0939 \u0921\u0947\u092E\u094B \u091F\u094B\u0915\u0928 \u0905\u092D\u0940 \u0938\u0939\u0947\u091C\u093E \u0928\u0939\u0940\u0902 \u0917\u092F\u093E \u0939\u0948\u0964 \u092C\u0941\u0915\u093F\u0902\u0917 \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u091C\u094B\u0921\u093C\u0947\u0902\u0964",
    "Your appointment token": "\u0906\u092A\u0915\u093E \u0905\u092A\u0949\u0907\u0902\u091F\u092E\u0947\u0902\u091F \u091F\u094B\u0915\u0928",
    "Book another test": "\u090F\u0915 \u0914\u0930 \u091C\u093E\u0902\u091A \u092C\u0941\u0915 \u0915\u0930\u0947\u0902",
    "Mobile number": "\u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930",
    "Crop to test": "\u091C\u093E\u0902\u091A \u0915\u0940 \u092B\u0938\u0932",
    "Preferred date": "\u092A\u0938\u0902\u0926\u0940\u0926\u093E \u0924\u093E\u0930\u0940\u0916",
    "Time slot": "\u0938\u092E\u092F \u0938\u094D\u0932\u0949\u091F",
    "How would you like to test?": "\u0906\u092A \u091C\u093E\u0902\u091A \u0915\u0948\u0938\u0947 \u0915\u0930\u0935\u093E\u0928\u093E \u091A\u093E\u0939\u0947\u0902\u0917\u0947?",
    "Visit the lab": "\u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u091C\u093E\u090F\u0902",
    "Bring your soil sample": "\u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u093E \u0928\u092E\u0942\u0928\u093E \u0938\u093E\u0925 \u0932\u093E\u090F\u0902",
    "Sample pickup": "\u0928\u092E\u0942\u0928\u093E \u0932\u0947\u0928\u0947 \u0906\u090F\u0902",
    "Lab will confirm availability": "\u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u0909\u092A\u0932\u092C\u094D\u0927\u0924\u093E \u0915\u0940 \u092A\u0941\u0937\u094D\u091F\u093F \u0915\u0930\u0947\u0917\u0940",
    "Soil testing lab": "\u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E",
    "Choose a nearby lab or enter a lab name": "\u092A\u093E\u0938 \u0915\u0940 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u091A\u0941\u0928\u0947\u0902 \u092F\u093E \u0928\u093E\u092E \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",
    "Enter a soil testing lab name": "\u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u0915\u093E \u0928\u093E\u092E \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902",
    "Request appointment": "\u0905\u092A\u0949\u0907\u0902\u091F\u092E\u0947\u0902\u091F \u0915\u093E \u0905\u0928\u0941\u0930\u094B\u0927 \u0915\u0930\u0947\u0902",
    "Nearby soil labs": "\u092A\u093E\u0938 \u0915\u0940 \u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E\u090F\u0902",
    "Refresh": "\u0930\u0940\u092B\u094D\u0930\u0947\u0936 \u0915\u0930\u0947\u0902",
    "OpenStreetMap nearby-place results \xB7 ordered by distance": "OpenStreetMap \u0915\u0947 \u092A\u093E\u0938 \u0915\u0947 \u0938\u094D\u0925\u093E\u0928 \xB7 \u0926\u0942\u0930\u0940 \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930",
    "Looking for agriculture and soil-testing facilities near your farm...": "\u0906\u092A\u0915\u0947 \u0916\u0947\u0924 \u0915\u0947 \u092A\u093E\u0938 \u0915\u0943\u0937\u093F \u0914\u0930 \u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u0915\u0947\u0902\u0926\u094D\u0930 \u0916\u094B\u091C\u0947 \u091C\u093E \u0930\u0939\u0947 \u0939\u0948\u0902...",
    "No soil-testing facilities were listed nearby.": "\u092A\u093E\u0938 \u092E\u0947\u0902 \u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u0915\u0947\u0902\u0926\u094D\u0930 \u0938\u0942\u091A\u0940\u092C\u0926\u094D\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0902\u0964",
    "Address not listed": "\u092A\u0924\u093E \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u0939\u0940\u0902",
    "Select for booking": "\u092C\u0941\u0915\u093F\u0902\u0917 \u0915\u0947 \u0932\u093F\u090F \u091A\u0941\u0928\u0947\u0902",
    "Map": "\u0928\u0915\u094D\u0936\u093E",
    "Directions": "\u0926\u093F\u0936\u093E-\u0928\u093F\u0930\u094D\u0926\u0947\u0936",
    "Search soil labs on Google Maps": "Google Maps \u092A\u0930 \u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u0915\u0947\u0902\u0926\u094D\u0930 \u0916\u094B\u091C\u0947\u0902",
    "Why test your soil?": "\u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u0940 \u091C\u093E\u0902\u091A \u0915\u094D\u092F\u094B\u0902 \u0915\u0930\u0947\u0902?",
    "Listings come from OpenStreetMap and may be incomplete or unverified. Call the facility to confirm soil testing services and availability.": "\u0938\u0942\u091A\u093F\u092F\u093E\u0902 OpenStreetMap \u0938\u0947 \u0939\u0948\u0902 \u0914\u0930 \u0905\u0927\u0942\u0930\u0940 \u092F\u093E \u0905\u092A\u0941\u0937\u094D\u091F \u0939\u094B \u0938\u0915\u0924\u0940 \u0939\u0948\u0902\u0964 \u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u0938\u0947\u0935\u093E \u0914\u0930 \u0909\u092A\u0932\u092C\u094D\u0927\u0924\u093E \u0915\u0940 \u092A\u0941\u0937\u094D\u091F\u093F \u0915\u0947 \u0932\u093F\u090F \u0915\u0947\u0902\u0926\u094D\u0930 \u0915\u094B \u0915\u0949\u0932 \u0915\u0930\u0947\u0902\u0964",
    "A soil test measures pH and nutrients so you can make informed fertilizer choices and avoid unnecessary inputs. Ask the lab for a soil health card with your results.": "\u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u0940 \u091C\u093E\u0902\u091A \u0938\u0947 pH \u0914\u0930 \u092A\u094B\u0937\u0915 \u0924\u0924\u094D\u0935\u094B\u0902 \u0915\u093E \u092A\u0924\u093E \u091A\u0932\u0924\u093E \u0939\u0948, \u091C\u093F\u0938\u0938\u0947 \u0906\u092A \u0938\u0939\u0940 \u0916\u093E\u0926 \u091A\u0941\u0928 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902 \u0914\u0930 \u0905\u0928\u093E\u0935\u0936\u094D\u092F\u0915 \u0916\u0930\u094D\u091A \u0938\u0947 \u092C\u091A \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964 \u092A\u0930\u093F\u0923\u093E\u092E\u094B\u0902 \u0915\u0947 \u0938\u093E\u0925 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u0938\u0947 \u092E\u0943\u0926\u093E \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0915\u093E\u0930\u094D\u0921 \u092E\u093E\u0902\u0917\u0947\u0902\u0964",
    "km away": "\u0915\u093F\u092E\u0940 \u0926\u0942\u0930",
    "Lab search radius": "\u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u0916\u094B\u091C\u0928\u0947 \u0915\u0940 \u0926\u0942\u0930\u0940",
    "Close farm profile": "\u0916\u0947\u0924 \u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u092C\u0902\u0926 \u0915\u0930\u0947\u0902",
    "Mandi market insights": "\u092E\u0902\u0921\u0940 \u092C\u093E\u091C\u093E\u0930 \u091C\u093E\u0928\u0915\u093E\u0930\u0940",
    "Search mandi prices for multiple crops across India.": "\u092D\u093E\u0930\u0924 \u092D\u0930 \u0915\u0940 \u0915\u0908 \u092B\u0938\u0932\u094B\u0902 \u0915\u0947 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u0916\u094B\u091C\u0947\u0902\u0964",
    "Find crop prices": "\u092B\u0938\u0932 \u0915\u0947 \u092D\u093E\u0935 \u0916\u094B\u091C\u0947\u0902",
    "Filter by commodity and mandi location. Leave blank to browse all available records.": "\u092B\u0938\u0932 \u0914\u0930 \u092E\u0902\u0921\u0940 \u0938\u094D\u0925\u093E\u0928 \u0938\u0947 \u091B\u093E\u0902\u091F\u0947\u0902\u0964 \u0938\u092D\u0940 \u0909\u092A\u0932\u092C\u094D\u0927 \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0916\u093E\u0932\u0940 \u091B\u094B\u0921\u093C\u0947\u0902\u0964",
    "State": "\u0930\u093E\u091C\u094D\u092F",
    "All states": "\u0938\u092D\u0940 \u0930\u093E\u091C\u094D\u092F",
    "Crop": "\u092B\u0938\u0932",
    "All crops": "\u0938\u092D\u0940 \u092B\u0938\u0932\u0947\u0902",
    "District": "\u091C\u093F\u0932\u093E",
    "All districts": "\u0938\u092D\u0940 \u091C\u093F\u0932\u0947",
    "Select a state first": "\u092A\u0939\u0932\u0947 \u0930\u093E\u091C\u094D\u092F \u091A\u0941\u0928\u0947\u0902",
    "Mandi": "\u092E\u0902\u0921\u0940",
    "All mandis in district": "\u091C\u093F\u0932\u0947 \u0915\u0940 \u0938\u092D\u0940 \u092E\u0902\u0921\u093F\u092F\u093E\u0902",
    "All mandis in state": "\u0930\u093E\u091C\u094D\u092F \u0915\u0940 \u0938\u092D\u0940 \u092E\u0902\u0921\u093F\u092F\u093E\u0902",
    "Search all fields": "\u0938\u092D\u0940 \u092B\u093C\u0940\u0932\u094D\u0921 \u092E\u0947\u0902 \u0916\u094B\u091C\u0947\u0902",
    "Crop, variety, location...": "\u092B\u0938\u0932, \u0915\u093F\u0938\u094D\u092E, \u0938\u094D\u0925\u093E\u0928...",
    "Loading available crops, districts, and mandis...": "\u0909\u092A\u0932\u092C\u094D\u0927 \u092B\u0938\u0932\u0947\u0902, \u091C\u093F\u0932\u0947 \u0914\u0930 \u092E\u0902\u0921\u093F\u092F\u093E\u0902 \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u0940 \u0939\u0948\u0902...",
    "Clear all filters": "\u0938\u092D\u0940 \u092B\u093C\u093F\u0932\u094D\u091F\u0930 \u0939\u091F\u093E\u090F\u0902",
    "Price trend": "\u092D\u093E\u0935 \u0915\u093E \u0930\u0941\u091D\u093E\u0928",
    "Price alerts": "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F",
    "Create a price alert": "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u092C\u0928\u093E\u090F\u0902",
    "Choose a market record and target price.": "\u092E\u0902\u0921\u0940 \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u0914\u0930 \u0932\u0915\u094D\u0937\u094D\u092F \u092D\u093E\u0935 \u091A\u0941\u0928\u0947\u0902\u0964",
    "Selected market record": "\u091A\u0941\u0928\u093E \u0917\u092F\u093E \u092E\u0902\u0921\u0940 \u0930\u093F\u0915\u0949\u0930\u094D\u0921",
    "Alert direction": "\u0905\u0932\u0930\u094D\u091F \u0915\u0940 \u0926\u093F\u0936\u093E",
    "At or above": "\u0907\u0938 \u092D\u093E\u0935 \u0924\u0915 \u092F\u093E \u0907\u0938\u0938\u0947 \u0905\u0927\u093F\u0915",
    "At or below": "\u0907\u0938 \u092D\u093E\u0935 \u0924\u0915 \u092F\u093E \u0907\u0938\u0938\u0947 \u0915\u092E",
    "Target price (\u20B9 per quintal)": "\u0932\u0915\u094D\u0937\u094D\u092F \u092D\u093E\u0935 (\u20B9 \u092A\u094D\u0930\u0924\u093F \u0915\u094D\u0935\u093F\u0902\u091F\u0932)",
    "Save price alert": "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u0938\u0939\u0947\u091C\u0947\u0902",
    "Current price": "\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092D\u093E\u0935",
    "Your saved alerts": "\u0906\u092A\u0915\u0947 \u0938\u0939\u0947\u091C\u0947 \u0917\u090F \u0905\u0932\u0930\u094D\u091F",
    "No price alerts yet": "\u0905\u092D\u0940 \u0915\u094B\u0908 \u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u0928\u0939\u0940\u0902",
    "Create alerts from the current market list. Alerts are checked when matching prices are loaded; they do not send phone notifications.": "\u092E\u0902\u0921\u0940 \u0938\u0942\u091A\u0940 \u0938\u0947 \u0905\u0932\u0930\u094D\u091F \u092C\u0928\u093E\u090F\u0902\u0964 \u092E\u093F\u0932\u0924\u0947-\u091C\u0941\u0932\u0924\u0947 \u092D\u093E\u0935 \u0932\u094B\u0921 \u0939\u094B\u0928\u0947 \u092A\u0930 \u0905\u0932\u0930\u094D\u091F \u091C\u093E\u0902\u091A\u0947 \u091C\u093E\u0924\u0947 \u0939\u0948\u0902; \u092B\u094B\u0928 \u092A\u0930 \u0938\u0942\u091A\u0928\u093E \u0928\u0939\u0940\u0902 \u092D\u0947\u091C\u0940 \u091C\u093E\u0924\u0940\u0964",
    "Triggered": "\u0932\u0915\u094D\u0937\u094D\u092F \u092A\u0942\u0930\u093E \u0939\u0941\u0906",
    "Not reached": "\u0932\u0915\u094D\u0937\u094D\u092F \u0924\u0915 \u0928\u0939\u0940\u0902 \u092A\u0939\u0941\u0902\u091A\u093E",
    "No matching quote is loaded right now.": "\u0905\u092D\u0940 \u0907\u0938 \u092E\u0902\u0921\u0940 \u0915\u093E \u092D\u093E\u0935 \u0932\u094B\u0921 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
    "Remove price alert": "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u0939\u091F\u093E\u090F\u0902",
    "Loading price alerts...": "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u0947 \u0939\u0948\u0902...",
    "Recent mandi modal price \xB7 \u20B9 per quintal": "\u0939\u093E\u0932 \u0915\u093E \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \xB7 \u20B9 \u092A\u094D\u0930\u0924\u093F \u0915\u094D\u0935\u093F\u0902\u091F\u0932",
    "Choose crop and mandi for price trend": "\u092D\u093E\u0935 \u0915\u093E \u0930\u0941\u091D\u093E\u0928 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092B\u0938\u0932 \u0914\u0930 \u092E\u0902\u0921\u0940 \u091A\u0941\u0928\u0947\u0902",
    "Modal price": "\u092E\u0949\u0921\u0932 \u092D\u093E\u0935",
    "Today's change": "\u0906\u091C \u0915\u093E \u092C\u0926\u0932\u093E\u0935",
    "Price history is not available for this record.": "\u0907\u0938 \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u0915\u0947 \u0932\u093F\u090F \u092D\u093E\u0935 \u0915\u093E \u0907\u0924\u093F\u0939\u093E\u0938 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
    "Markets on this page": "\u0907\u0938 \u092A\u0943\u0937\u094D\u0920 \u0915\u0947 \u092C\u093E\u091C\u093E\u0930",
    "Select any crop and mandi for the chart": "\u091A\u093E\u0930\u094D\u091F \u0915\u0947 \u0932\u093F\u090F \u0915\u094B\u0908 \u092D\u0940 \u092B\u0938\u0932 \u0914\u0930 \u092E\u0902\u0921\u0940 \u091A\u0941\u0928\u0947\u0902",
    "No matching mandi records.": "\u092E\u093F\u0932\u0924\u0947-\u091C\u0941\u0932\u0924\u0947 \u092E\u0902\u0921\u0940 \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u0947\u0964",
    "Plan with your field in mind": "\u0905\u092A\u0928\u0947 \u0916\u0947\u0924 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u092E\u0947\u0902 \u0930\u0916\u0915\u0930 \u092F\u094B\u091C\u0928\u093E \u092C\u0928\u093E\u090F\u0902",
    "Estimate inputs, check the forecast, and keep practical field notes together.": "\u0915\u0943\u0937\u093F \u0938\u093E\u092E\u0917\u094D\u0930\u0940 \u0915\u093E \u0905\u0928\u0941\u092E\u093E\u0928 \u0932\u0917\u093E\u090F\u0902, \u092E\u094C\u0938\u092E \u0926\u0947\u0916\u0947\u0902 \u0914\u0930 \u0916\u0947\u0924 \u0915\u0947 \u091C\u0930\u0942\u0930\u0940 \u0928\u094B\u091F \u0938\u093E\u0925 \u0930\u0916\u0947\u0902\u0964",
    "Field input calculator": "\u0916\u0947\u0924 \u0938\u093E\u092E\u0917\u094D\u0930\u0940 \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091F\u0930",
    "Estimate amounts from your own per-acre recommendation.": "\u092A\u094D\u0930\u0924\u093F \u090F\u0915\u0921\u093C \u0905\u092A\u0928\u0940 \u0938\u093F\u092B\u093E\u0930\u093F\u0936 \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u092E\u093E\u0924\u094D\u0930\u093E \u0915\u093E \u0905\u0928\u0941\u092E\u093E\u0928 \u0932\u0917\u093E\u090F\u0902\u0964",
    "Farm area": "\u0916\u0947\u0924 \u0915\u093E \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932",
    "acres": "\u090F\u0915\u0921\u093C",
    "acre": "\u090F\u0915\u0921\u093C",
    "Fertilizer recommendation per acre (kg)": "\u092A\u094D\u0930\u0924\u093F \u090F\u0915\u0921\u093C \u0909\u0930\u094D\u0935\u0930\u0915 \u0915\u0940 \u0938\u093F\u092B\u093E\u0930\u093F\u0936 (\u0915\u093F\u0932\u094B)",
    "Reduce fertilizer rate": "\u0909\u0930\u094D\u0935\u0930\u0915 \u0915\u0940 \u092E\u093E\u0924\u094D\u0930\u093E \u0918\u091F\u093E\u090F\u0902",
    "Increase fertilizer rate": "\u0909\u0930\u094D\u0935\u0930\u0915 \u0915\u0940 \u092E\u093E\u0924\u094D\u0930\u093E \u092C\u0922\u093C\u093E\u090F\u0902",
    "Input type": "\u0915\u0943\u0937\u093F \u0938\u093E\u092E\u0917\u094D\u0930\u0940 \u0915\u093E \u092A\u094D\u0930\u0915\u093E\u0930",
    "NPK fertilizer": "\u090F\u0928\u092A\u0940\u0915\u0947 \u0909\u0930\u094D\u0935\u0930\u0915",
    "Compost / organic manure": "\u0915\u092E\u094D\u092A\u094B\u0938\u094D\u091F / \u091C\u0948\u0935\u093F\u0915 \u0916\u093E\u0926",
    "Seed quantity": "\u092C\u0940\u091C \u0915\u0940 \u092E\u093E\u0924\u094D\u0930\u093E",
    "Estimated quantity for your farm": "\u0906\u092A\u0915\u0947 \u0916\u0947\u0924 \u0915\u0947 \u0932\u093F\u090F \u0905\u0928\u0941\u092E\u093E\u0928\u093F\u0924 \u092E\u093E\u0924\u094D\u0930\u093E",
    "Based on": "\u0906\u0927\u093E\u0930",
    "kg / acre": "\u0915\u093F\u0932\u094B / \u090F\u0915\u0921\u093C",
    "Use the rate recommended for your crop and soil test. This calculator estimates total quantity only; it does not replace agronomic advice.": "\u0905\u092A\u0928\u0940 \u092B\u0938\u0932 \u0914\u0930 \u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u0938\u0941\u091D\u093E\u0908 \u0917\u0908 \u092E\u093E\u0924\u094D\u0930\u093E \u0932\u0947\u0902\u0964 \u092F\u0939 \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091F\u0930 \u0915\u0947\u0935\u0932 \u0915\u0941\u0932 \u092E\u093E\u0924\u094D\u0930\u093E \u092C\u0924\u093E\u0924\u093E \u0939\u0948; \u0915\u0943\u0937\u093F \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0915\u0940 \u0938\u0932\u093E\u0939 \u0915\u093E \u0935\u093F\u0915\u0932\u094D\u092A \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
    "Plan around the forecast": "\u092E\u094C\u0938\u092E \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u092F\u094B\u091C\u0928\u093E \u092C\u0928\u093E\u090F\u0902",
    "A few simple reminders for your fields.": "\u0906\u092A\u0915\u0947 \u0916\u0947\u0924 \u0915\u0947 \u0932\u093F\u090F \u0915\u0941\u091B \u0906\u0938\u093E\u0928 \u0938\u0941\u091D\u093E\u0935\u0964",
    "Check rain before spraying": "\u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0938\u0947 \u092A\u0939\u0932\u0947 \u092C\u093E\u0930\u093F\u0936 \u091C\u093E\u0902\u091A\u0947\u0902",
    "Rain can wash treatments off leaves. Follow the product label.": "\u092C\u093E\u0930\u093F\u0936 \u0938\u0947 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u092A\u0930 \u091B\u093F\u0921\u093C\u0915\u093E \u092A\u0926\u093E\u0930\u094D\u0925 \u0927\u0941\u0932 \u0938\u0915\u0924\u093E \u0939\u0948\u0964 \u0909\u0924\u094D\u092A\u093E\u0926 \u0915\u0947 \u0928\u093F\u0930\u094D\u0926\u0947\u0936 \u092A\u0922\u093C\u0947\u0902\u0964",
    "Check soil moisture": "\u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u0940 \u0928\u092E\u0940 \u091C\u093E\u0902\u091A\u0947\u0902",
    "Avoid watering if the soil is still moist below the surface.": "\u0905\u0917\u0930 \u0938\u0924\u0939 \u0915\u0947 \u0928\u0940\u091A\u0947 \u092E\u093F\u091F\u094D\u091F\u0940 \u0928\u092E \u0939\u0948, \u0924\u094B \u092A\u093E\u0928\u0940 \u0926\u0947\u0928\u0947 \u0938\u0947 \u092C\u091A\u0947\u0902\u0964",
    "Keep a field record": "\u0916\u0947\u0924 \u0915\u093E \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u0930\u0916\u0947\u0902",
    "Note what you used and when to plan your next crop cycle.": "\u0905\u0917\u0932\u0940 \u092B\u0938\u0932 \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u094B\u0917 \u0915\u0940 \u0917\u0908 \u091A\u0940\u091C\u0947\u0902 \u0914\u0930 \u0924\u093E\u0930\u0940\u0916 \u0932\u093F\u0916\u0947\u0902\u0964",
    "Field efficiency checklist": "\u0916\u0947\u0924 \u0926\u0915\u094D\u0937\u0924\u093E \u0938\u0942\u091A\u0940",
    "A practical starting point, not a farm score.": "\u0915\u093E\u092E \u0936\u0941\u0930\u0942 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u094B\u0917\u0940 \u0938\u0942\u091A\u0940, \u0916\u0947\u0924 \u0915\u093E \u0938\u094D\u0915\u094B\u0930 \u0928\u0939\u0940\u0902\u0964",
    "Soil test completed for this season": "\u0907\u0938 \u092E\u094C\u0938\u092E \u0915\u0947 \u0932\u093F\u090F \u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u092A\u0942\u0930\u0940 \u0939\u0941\u0908",
    "Irrigation checked against rainfall": "\u092C\u093E\u0930\u093F\u0936 \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u0938\u093F\u0902\u091A\u093E\u0908 \u091C\u093E\u0902\u091A\u0940 \u0917\u0908",
    "Input amounts recorded by field": "\u0916\u0947\u0924 \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u0938\u093E\u092E\u0917\u094D\u0930\u0940 \u0915\u0940 \u092E\u093E\u0924\u094D\u0930\u093E \u0926\u0930\u094D\u091C \u0915\u0940 \u0917\u0908",
    "Crop rotation planned after harvest": "\u0915\u091F\u093E\u0908 \u0915\u0947 \u092C\u093E\u0926 \u092B\u0938\u0932 \u091A\u0915\u094D\u0930 \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u092C\u0928\u093E\u0908 \u0917\u0908",
    "For your next growing season": "\u0906\u0928\u0947 \u0935\u093E\u0932\u0947 \u092B\u0938\u0932 \u092E\u094C\u0938\u092E \u0915\u0947 \u0932\u093F\u090F",
    "Farm essentials": "\u0916\u0947\u0924\u0940 \u0915\u0947 \u091C\u0930\u0942\u0930\u0940 \u0938\u093E\u092E\u093E\u0928",
    "Browse a small demo catalog of common farm supplies.": "\u0916\u0947\u0924\u0940 \u0915\u0940 \u0906\u092E \u091C\u0930\u0942\u0930\u0924\u094B\u0902 \u0915\u0940 \u091B\u094B\u091F\u0940 \u0921\u0947\u092E\u094B \u0938\u0942\u091A\u0940 \u0926\u0947\u0916\u0947\u0902\u0964",
    "Certified wheat seeds": "\u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0917\u0947\u0939\u0942\u0902 \u0915\u0947 \u092C\u0940\u091C",
    "Neem-based bio-fertilizer": "\u0928\u0940\u092E \u0906\u0927\u093E\u0930\u093F\u0924 \u091C\u0948\u0935 \u0909\u0930\u094D\u0935\u0930\u0915",
    "Drip irrigation starter kit": "\u0921\u094D\u0930\u093F\u092A \u0938\u093F\u0902\u091A\u093E\u0908 \u0936\u0941\u0930\u0941\u0906\u0924\u0940 \u0915\u093F\u091F",
    "Popular": "\u0932\u094B\u0915\u092A\u094D\u0930\u093F\u092F",
    "Organic": "\u091C\u0948\u0935\u093F\u0915",
    "Save 12%": "12% \u092C\u091A\u093E\u090F\u0902",
    "Add to basket": "\u091F\u094B\u0915\u0930\u0940 \u092E\u0947\u0902 \u091C\u094B\u0921\u093C\u0947\u0902",
    "Community buying is coming soon": "\u0938\u093E\u092E\u0942\u0939\u093F\u0915 \u0916\u0930\u0940\u0926 \u091C\u0932\u094D\u0926 \u0906 \u0930\u0939\u0940 \u0939\u0948",
    "Group orders and local supplier listings will be available here.": "\u0938\u092E\u0942\u0939 \u0911\u0930\u094D\u0921\u0930 \u0914\u0930 \u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0935\u093F\u0915\u094D\u0930\u0947\u0924\u093E\u0913\u0902 \u0915\u0940 \u0938\u0942\u091A\u0940 \u092F\u0939\u093E\u0902 \u0909\u092A\u0932\u092C\u094D\u0927 \u0939\u094B\u0917\u0940\u0964",
    "Your farm details": "\u0906\u092A\u0915\u0947 \u0916\u0947\u0924 \u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940",
    "Choose your state, district and village to get local weather.": "\u0938\u094D\u0925\u093E\u0928\u0940\u092F \u092E\u094C\u0938\u092E \u092A\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0905\u092A\u0928\u093E \u0930\u093E\u091C\u094D\u092F, \u091C\u093F\u0932\u093E \u0914\u0930 \u0917\u093E\u0902\u0935 \u091A\u0941\u0928\u0947\u0902\u0964",
    "Your name": "\u0906\u092A\u0915\u093E \u0928\u093E\u092E",
    "State / union territory": "\u0930\u093E\u091C\u094D\u092F / \u0915\u0947\u0902\u0926\u094D\u0930 \u0936\u093E\u0938\u093F\u0924 \u092A\u094D\u0930\u0926\u0947\u0936",
    "Type a district or nearby town": "\u091C\u093F\u0932\u093E \u092F\u093E \u092A\u093E\u0938 \u0915\u0947 \u0936\u0939\u0930 \u0915\u093E \u0928\u093E\u092E \u0932\u093F\u0916\u0947\u0902",
    "Searching districts...": "\u091C\u093F\u0932\u0947 \u0916\u094B\u091C\u0947 \u091C\u093E \u0930\u0939\u0947 \u0939\u0948\u0902...",
    "near": "\u0915\u0947 \u092A\u093E\u0938",
    "Selected district:": "\u091A\u0941\u0928\u093E \u0917\u092F\u093E \u091C\u093F\u0932\u093E:",
    "Village / town": "\u0917\u093E\u0902\u0935 / \u0936\u0939\u0930",
    "(optional)": "(\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915)",
    "Type your village or town": "\u0905\u092A\u0928\u0947 \u0917\u093E\u0902\u0935 \u092F\u093E \u0936\u0939\u0930 \u0915\u093E \u0928\u093E\u092E \u0932\u093F\u0916\u0947\u0902",
    "Searching villages and towns...": "\u0917\u093E\u0902\u0935 \u0914\u0930 \u0936\u0939\u0930 \u0916\u094B\u091C\u0947 \u091C\u093E \u0930\u0939\u0947 \u0939\u0948\u0902...",
    "Select a district first": "\u092A\u0939\u0932\u0947 \u091C\u093F\u0932\u093E \u091A\u0941\u0928\u0947\u0902",
    "Weather coordinates selected for": "\u092E\u094C\u0938\u092E \u0915\u0947 \u0932\u093F\u090F \u0938\u094D\u0925\u093E\u0928 \u091A\u0941\u0928\u093E \u0917\u092F\u093E:",
    "Farm size (acres)": "\u0916\u0947\u0924 \u0915\u093E \u0906\u0915\u093E\u0930 (\u090F\u0915\u0921\u093C)",
    "Save my farm": "\u092E\u0947\u0930\u0947 \u0916\u0947\u0924 \u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0938\u0939\u0947\u091C\u0947\u0902",
    "Locations are searched from a global geocoding directory. You can update these details anytime.": "\u0938\u094D\u0925\u093E\u0928 \u0935\u0948\u0936\u094D\u0935\u093F\u0915 \u092D\u094C\u0917\u094B\u0932\u093F\u0915 \u0928\u093F\u0930\u094D\u0926\u0947\u0936\u093F\u0915\u093E \u0938\u0947 \u0916\u094B\u091C\u0947 \u091C\u093E\u0924\u0947 \u0939\u0948\u0902\u0964 \u0906\u092A \u092F\u0939 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0915\u092D\u0940 \u092D\u0940 \u092C\u0926\u0932 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964",
    "Click or drop to change": "\u092C\u0926\u0932\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u094D\u0932\u093F\u0915 \u0915\u0930\u0947\u0902 \u092F\u093E \u0924\u0938\u094D\u0935\u0940\u0930 \u091B\u094B\u0921\u093C\u0947\u0902",
    "Close-up of healthy green crop leaves": "\u0938\u094D\u0935\u0938\u094D\u0925 \u0939\u0930\u0940 \u092B\u0938\u0932 \u0915\u0940 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u093E \u0928\u091C\u0926\u0940\u0915\u0940 \u0926\u0943\u0936\u094D\u092F",
    "Selected crop leaf preview": "\u091A\u0941\u0928\u0940 \u0917\u0908 \u092B\u0938\u0932 \u0915\u0940 \u092A\u0924\u094D\u0924\u0940 \u0915\u093E \u092A\u0942\u0930\u094D\u0935\u093E\u0935\u0932\u094B\u0915\u0928",
    "Gemini AI screening": "Gemini \u090F\u0906\u0908 \u091C\u093E\u0902\u091A",
    "Crop image submitted for screening": "\u091C\u093E\u0902\u091A \u0915\u0947 \u0932\u093F\u090F \u092D\u0947\u091C\u0940 \u0917\u0908 \u092B\u0938\u0932 \u0915\u0940 \u0924\u0938\u094D\u0935\u0940\u0930",
    "Soil testing and lab services": "\u092E\u093F\u091F\u094D\u091F\u0940 \u091C\u093E\u0902\u091A \u0914\u0930 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E \u0938\u0947\u0935\u093E\u090F\u0902",
    "10-digit mobile number": "10 \u0905\u0902\u0915\u094B\u0902 \u0915\u093E \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930",
    "Refresh nearby labs": "\u092A\u093E\u0938 \u0915\u0940 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E\u0913\u0902 \u0915\u094B \u0930\u0940\u092B\u094D\u0930\u0947\u0936 \u0915\u0930\u0947\u0902",
    "Map listings may be incomplete. Search a wider area or check the map for local government and university labs.": "\u0928\u0915\u094D\u0936\u0947 \u0915\u0940 \u0938\u0942\u091A\u0940 \u0905\u0927\u0942\u0930\u0940 \u0939\u094B \u0938\u0915\u0924\u0940 \u0939\u0948\u0964 \u092C\u0921\u093C\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u092E\u0947\u0902 \u0916\u094B\u091C\u0947\u0902 \u092F\u093E \u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0938\u0930\u0915\u093E\u0930\u0940 \u0914\u0930 \u0935\u093F\u0936\u094D\u0935\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0932\u093E\u0913\u0902 \u0915\u093E \u0928\u0915\u094D\u0936\u093E \u0926\u0947\u0916\u0947\u0902\u0964",
    "Expanded sample data": "\u0935\u093F\u0938\u094D\u0924\u0943\u0924 \u0928\u092E\u0942\u0928\u093E \u0921\u0947\u091F\u093E",
    "Data.gov.in live": "Data.gov.in \u0932\u093E\u0907\u0935",
    "results": "\u092A\u0930\u093F\u0923\u093E\u092E",
    "Mandi rates across India": "\u092D\u093E\u0930\u0924 \u092D\u0930 \u0915\u0947 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935",
    "records": "\u0930\u093F\u0915\u0949\u0930\u094D\u0921",
    "These are sample prices for demonstration, not live mandi quotes. Add Data.gov.in API credentials to see official records. The sample directory covers 16 crops across 18 markets and states.": "\u092F\u0947 \u092A\u094D\u0930\u0926\u0930\u094D\u0936\u0928 \u0915\u0947 \u0932\u093F\u090F \u0928\u092E\u0942\u0928\u093E \u092D\u093E\u0935 \u0939\u0948\u0902, \u0932\u093E\u0907\u0935 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u0928\u0939\u0940\u0902\u0964 \u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F Data.gov.in API \u0915\u094D\u0930\u0947\u0921\u0947\u0902\u0936\u093F\u092F\u0932 \u091C\u094B\u0921\u093C\u0947\u0902\u0964 \u0928\u092E\u0942\u0928\u093E \u0938\u0942\u091A\u0940 \u092E\u0947\u0902 18 \u092C\u093E\u091C\u093E\u0930\u094B\u0902 \u0914\u0930 \u0930\u093E\u091C\u094D\u092F\u094B\u0902 \u0915\u0940 16 \u092B\u0938\u0932\u0947\u0902 \u0939\u0948\u0902\u0964",
    "Crop & variety": "\u092B\u0938\u0932 \u0914\u0930 \u0915\u093F\u0938\u094D\u092E",
    "Change": "\u092C\u0926\u0932\u093E\u0935",
    "Loading mandi rates...": "\u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u0947 \u0939\u0948\u0902...",
    "No mandi records match these filters. Try clearing a filter or selecting another crop.": "\u0907\u0928 \u092B\u093C\u093F\u0932\u094D\u091F\u0930 \u0938\u0947 \u0915\u094B\u0908 \u092E\u0902\u0921\u0940 \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u093E\u0964 \u092B\u093C\u093F\u0932\u094D\u091F\u0930 \u0939\u091F\u093E\u090F\u0902 \u092F\u093E \u0926\u0942\u0938\u0930\u0940 \u092B\u0938\u0932 \u091A\u0941\u0928\u0947\u0902\u0964",
    "Page": "\u092A\u0943\u0937\u094D\u0920",
    "of": "\u092E\u0947\u0902 \u0938\u0947",
    "Previous": "\u092A\u093F\u091B\u0932\u093E",
    "Next": "\u0905\u0917\u0932\u093E",
    "Select a state to narrow the crop, district, and mandi options.": "\u092B\u0938\u0932, \u091C\u093F\u0932\u0947 \u0914\u0930 \u092E\u0902\u0921\u0940 \u0915\u0947 \u0935\u093F\u0915\u0932\u094D\u092A \u0938\u0940\u092E\u093F\u0924 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0930\u093E\u091C\u094D\u092F \u091A\u0941\u0928\u0947\u0902\u0964",
    "Crop and district options for {state}; mandis follow the selected district.": "{state} \u0915\u0947 \u0932\u093F\u090F \u092B\u0938\u0932 \u0914\u0930 \u091C\u093F\u0932\u093E \u0935\u093F\u0915\u0932\u094D\u092A; \u092E\u0902\u0921\u093F\u092F\u093E\u0902 \u091A\u0941\u0928\u0947 \u0917\u090F \u091C\u093F\u0932\u0947 \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u0939\u0948\u0902\u0964",
    "9:00 am \u2013 11:00 am": "\u0938\u0941\u092C\u0939 9:00 \u2013 11:00",
    "11:00 am \u2013 1:00 pm": "\u0938\u0941\u092C\u0939 11:00 \u2013 \u0926\u094B\u092A\u0939\u0930 1:00",
    "2:00 pm \u2013 4:00 pm": "\u0926\u094B\u092A\u0939\u0930 2:00 \u2013 4:00",
    "e.g. Ravi Patil": "\u091C\u0948\u0938\u0947, \u0930\u0935\u093F \u092A\u093E\u091F\u093F\u0932",
    "For up to 1 acre": "1 \u090F\u0915\u0921\u093C \u0924\u0915",
    "HD 2967 \xB7 40 kg bag": "HD 2967 \xB7 40 \u0915\u093F\u0932\u094B \u0915\u093E \u092C\u0948\u0917",
    "Organic \xB7 5 litre pack": "\u091C\u0948\u0935\u093F\u0915 \xB7 5 \u0932\u0940\u091F\u0930 \u092A\u0948\u0915",
    kg: "\u0915\u093F\u0932\u094B",
    "per acre": "\u092A\u094D\u0930\u0924\u093F \u090F\u0915\u0921\u093C",
    "Market outlook": "\u092C\u093E\u091C\u093E\u0930 \u0915\u093E \u0930\u0941\u091D\u093E\u0928",
    "WATCH THE MARKET": "\u092C\u093E\u091C\u093E\u0930 \u092A\u0930 \u0928\u091C\u0930 \u0930\u0916\u0947\u0902",
    "{crop} prices are up recently in {market}. Compare nearby markets and storage costs before deciding when to sell.": "{market} \u092E\u0947\u0902 \u0939\u093E\u0932 \u092E\u0947\u0902 {crop} \u0915\u0947 \u092D\u093E\u0935 \u092C\u0922\u093C\u0947 \u0939\u0948\u0902\u0964 \u092C\u0947\u091A\u0928\u0947 \u0915\u093E \u0938\u092E\u092F \u0924\u092F \u0915\u0930\u0928\u0947 \u0938\u0947 \u092A\u0939\u0932\u0947 \u092A\u093E\u0938 \u0915\u0940 \u092E\u0902\u0921\u093F\u092F\u094B\u0902 \u0914\u0930 \u092D\u0902\u0921\u093E\u0930\u0923 \u0932\u093E\u0917\u0924 \u0915\u0940 \u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
    "{crop} prices are moving gradually. Check arrivals and local prices again before making a sale decision.": "{crop} \u0915\u0947 \u092D\u093E\u0935 \u092E\u0947\u0902 \u0927\u0940\u0930\u0947-\u0927\u0940\u0930\u0947 \u092C\u0926\u0932\u093E\u0935 \u0939\u094B \u0930\u0939\u093E \u0939\u0948\u0964 \u092C\u093F\u0915\u094D\u0930\u0940 \u0915\u093E \u092B\u0948\u0938\u0932\u093E \u0915\u0930\u0928\u0947 \u0938\u0947 \u092A\u0939\u0932\u0947 \u0906\u0935\u0915 \u0914\u0930 \u0938\u094D\u0925\u093E\u0928\u0940\u092F \u092D\u093E\u0935 \u092B\u093F\u0930 \u091C\u093E\u0902\u091A\u0947\u0902\u0964",
    "This is a simple trend summary, not a guaranteed forecast. Prices can change quickly and vary by quality and market.": "\u092F\u0939 \u0915\u0947\u0935\u0932 \u0930\u0941\u091D\u093E\u0928 \u0915\u093E \u0938\u093E\u0930 \u0939\u0948, \u092A\u0915\u094D\u0915\u093E \u092A\u0942\u0930\u094D\u0935\u093E\u0928\u0941\u092E\u093E\u0928 \u0928\u0939\u0940\u0902\u0964 \u092D\u093E\u0935 \u091C\u0932\u094D\u0926\u0940 \u092C\u0926\u0932 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902 \u0914\u0930 \u0917\u0941\u0923\u0935\u0924\u094D\u0924\u093E \u0935 \u092E\u0902\u0921\u0940 \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u0905\u0932\u0917 \u0939\u094B \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964",
    "Showing": "\u0926\u093F\u0916\u093E\u090F \u091C\u093E \u0930\u0939\u0947 \u0939\u0948\u0902",
    "Voice input isn't available in this browser. You can type your question instead.": "\u0907\u0938 \u092C\u094D\u0930\u093E\u0909\u091C\u093C\u0930 \u092E\u0947\u0902 \u0906\u0935\u093E\u091C \u0938\u0947 \u0938\u0935\u093E\u0932 \u092A\u0942\u091B\u0928\u093E \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u0906\u092A \u0938\u0935\u093E\u0932 \u091F\u093E\u0907\u092A \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964",
    "I couldn't hear that clearly. Please try again.": "\u0906\u092A\u0915\u0940 \u0906\u0935\u093E\u091C \u0938\u094D\u092A\u0937\u094D\u091F \u0938\u0941\u0928\u093E\u0908 \u0928\u0939\u0940\u0902 \u0926\u0940\u0964 \u0915\u0943\u092A\u092F\u093E \u092B\u093F\u0930 \u0938\u0947 \u0915\u094B\u0936\u093F\u0936 \u0915\u0930\u0947\u0902\u0964"
  },
  Marathi: {
    Dashboard: "\u0921\u0945\u0936\u092C\u094B\u0930\u094D\u0921",
    "Crop doctor": "\u092A\u0940\u0915 \u0921\u0949\u0915\u094D\u091F\u0930",
    "Reminders": "\u0938\u094D\u092E\u0930\u0923\u092A\u0924\u094D\u0930\u0947",
    "Soil testing": "\u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923",
    "Government schemes": "\u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E",
    "Mandi prices": "\u092C\u093E\u091C\u093E\u0930\u092D\u093E\u0935",
    "Crop diary": "\u092A\u0940\u0915 \u0921\u093E\u092F\u0930\u0940",
    "Farm planner": "\u0936\u0947\u0924\u0940 \u0928\u093F\u092F\u094B\u091C\u0928",
    "Farm shop": "\u0936\u0947\u0924\u0940 \u0926\u0941\u0915\u093E\u0928",
    "Your farm, in good hands": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u0940\u091A\u0940 \u092F\u094B\u0917\u094D\u092F \u0915\u093E\u0933\u091C\u0940",
    "YOUR FARM": "\u0924\u0941\u092E\u091A\u0940 \u0936\u0947\u0924\u0940",
    "Here for your farm": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u0940\u0938\u093E\u0920\u0940",
    "Talk to our agronomist assistant whenever you need a hand.": "\u0936\u0947\u0924\u0940\u0935\u093F\u0937\u092F\u0915 \u092E\u0926\u0924\u0940\u0938\u093E\u0920\u0940 \u0906\u092E\u091A\u094D\u092F\u093E \u0938\u0939\u093E\u092F\u094D\u092F\u0915\u093E\u0936\u0940 \u0915\u0927\u0940\u0939\u0940 \u092C\u094B\u0932\u093E.",
    "Ask a question": "\u092A\u094D\u0930\u0936\u094D\u0928 \u0935\u093F\u091A\u093E\u0930\u093E",
    "Choose language": "\u092D\u093E\u0937\u093E \u0928\u093F\u0935\u0921\u093E",
    "Good morning,": "\u0936\u0941\u092D \u0938\u0915\u093E\u0933,",
    "Here's what's happening on your farm today.": "\u0906\u091C \u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u093E\u0924 \u0915\u093E\u092F \u0938\u0941\u0930\u0942 \u0906\u0939\u0947 \u0924\u0947 \u092A\u0939\u093E.",
    "My farm": "\u092E\u093E\u091D\u0947 \u0936\u0947\u0924",
    "Good day to check your crop rows.": "\u092A\u093F\u0915\u093E\u0902\u091A\u094D\u092F\u093E \u0913\u0933\u0940 \u0924\u092A\u093E\u0938\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0906\u091C\u091A\u093E \u0926\u093F\u0935\u0938 \u091A\u093E\u0902\u0917\u0932\u093E \u0906\u0939\u0947.",
    "Humidity": "\u0906\u0930\u094D\u0926\u094D\u0930\u0924\u093E",
    "Rain chance": "\u092A\u093E\u0935\u0938\u093E\u091A\u0940 \u0936\u0915\u094D\u092F\u0924\u093E",
    "Wind": "\u0935\u093E\u0930\u093E",
    "YOUR DAILY BRIEF": "\u0906\u091C\u091A\u0940 \u092E\u093E\u0939\u093F\u0924\u0940",
    "Farm weather, in a minute": "\u090F\u0915\u093E \u092E\u093F\u0928\u093F\u091F\u093E\u0924 \u0936\u0947\u0924\u0940 \u0939\u0935\u093E\u092E\u093E\u0928",
    "Listen to briefing": "\u092E\u093E\u0939\u093F\u0924\u0940 \u0910\u0915\u093E",
    "Pause briefing": "\u0925\u093E\u0902\u092C\u0935\u093E",
    "Resume briefing": "\u092A\u0941\u0928\u094D\u0939\u093E \u0910\u0915\u093E",
    "Replay": "\u092A\u0941\u0928\u094D\u0939\u093E \u0910\u0915\u093E",
    "7-day forecast": "\u096D \u0926\u093F\u0935\u0938\u093E\u0902\u091A\u093E \u0905\u0902\u0926\u093E\u091C",
    "Plan field work around the weather": "\u0939\u0935\u093E\u092E\u093E\u0928\u093E\u0928\u0941\u0938\u093E\u0930 \u0936\u0947\u0924\u0915\u093E\u092E\u093E\u091A\u0947 \u0928\u093F\u092F\u094B\u091C\u0928 \u0915\u0930\u093E",
    "Choose farm": "\u0936\u0947\u0924 \u0928\u093F\u0935\u0921\u093E",
    "Use my location": "\u092E\u093E\u091D\u0947 \u0938\u094D\u0925\u093E\u0928 \u0935\u093E\u092A\u0930\u093E",
    "Field tip:": "\u0936\u0947\u0924 \u0938\u0932\u094D\u0932\u093E:",
    "Your farm at a glance": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u0940\u091A\u0940 \u091D\u0932\u0915",
    "A quick look at your fields": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u093E\u0902\u091A\u0940 \u0925\u094B\u0921\u0915\u094D\u092F\u093E\u0924 \u092E\u093E\u0939\u093F\u0924\u0940",
    "Cultivated area": "\u0932\u093E\u0917\u0935\u0921\u0940\u091A\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930",
    "Main crop": "\u092E\u0941\u0916\u094D\u092F \u092A\u0940\u0915",
    "Next field task": "\u092A\u0941\u0922\u0940\u0932 \u0936\u0947\u0924\u0915\u093E\u092E",
    "Tomorrow": "\u0909\u0926\u094D\u092F\u093E",
    "Walk the field and check soil moisture before irrigation.": "\u0938\u093F\u0902\u091A\u0928\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u0936\u0947\u0924\u093E\u0924 \u092B\u0947\u0930\u092B\u091F\u0915\u093E \u092E\u093E\u0930\u0942\u0928 \u091C\u092E\u093F\u0928\u0940\u0924\u0940\u0932 \u0913\u0932\u093E\u0935\u093E \u0924\u092A\u093E\u0938\u093E.",
    "Today's mandi snapshot": "\u0906\u091C\u091A\u0947 \u092C\u093E\u091C\u093E\u0930\u092D\u093E\u0935",
    "Latest sample modal prices \xB7 \u20B9 per quintal": "\u0928\u092E\u0941\u0928\u093E \u092C\u093E\u091C\u093E\u0930\u092D\u093E\u0935 \xB7 \u20B9 \u092A\u094D\u0930\u0924\u093F \u0915\u094D\u0935\u093F\u0902\u091F\u0932",
    "All prices": "\u0938\u0930\u094D\u0935 \u092D\u093E\u0935",
    "Quick actions": "\u091C\u0932\u0926 \u0915\u0943\u0924\u0940",
    "Tools for your next field visit": "\u092A\u0941\u0922\u0940\u0932 \u0936\u0947\u0924\u092D\u0947\u091F\u0940\u0938\u093E\u0920\u0940 \u0938\u093E\u0927\u0928\u0947",
    "Scan a crop problem": "\u092A\u093F\u0915\u093E\u091A\u0940 \u0938\u092E\u0938\u094D\u092F\u093E \u0924\u092A\u093E\u0938\u093E",
    "Get a quick plant health check": "\u092A\u093F\u0915\u093E\u091A\u094D\u092F\u093E \u0906\u0930\u094B\u0917\u094D\u092F\u093E\u091A\u0940 \u0924\u094D\u0935\u0930\u093F\u0924 \u0924\u092A\u093E\u0938\u0923\u0940 \u0915\u0930\u093E",
    "Book a soil test": "\u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u092C\u0941\u0915 \u0915\u0930\u093E",
    "Find a nearby testing lab": "\u091C\u0935\u0933\u091A\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E \u0936\u094B\u0927\u093E",
    "Plan fertilizer use": "\u0916\u0924 \u0935\u093E\u092A\u0930\u093E\u091A\u0947 \u0928\u093F\u092F\u094B\u091C\u0928",
    "Estimate amounts for your fields": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u093E\u0938\u093E\u0920\u0940 \u092F\u094B\u0917\u094D\u092F \u092E\u093E\u0924\u094D\u0930\u093E \u091C\u093E\u0923\u0942\u0928 \u0918\u094D\u092F\u093E",
    "Select a language": "\u092D\u093E\u0937\u093E \u0928\u093F\u0935\u0921\u093E",
    "Light mode": "\u0932\u093E\u0907\u091F \u092E\u094B\u0921",
    "Dark mode": "\u0921\u093E\u0930\u094D\u0915 \u092E\u094B\u0921",
    "Your farm": "\u0924\u0941\u092E\u091A\u0940 \u0936\u0947\u0924\u0940",
    "Local weather": "\u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u0939\u0935\u093E\u092E\u093E\u0928",
    "Saved forecast": "\u091C\u0924\u0928 \u0915\u0947\u0932\u0947\u0932\u093E \u0905\u0902\u0926\u093E\u091C",
    "Weather loading": "\u0939\u0935\u093E\u092E\u093E\u0928 \u0932\u094B\u0921 \u0939\u094B\u0924 \u0906\u0939\u0947",
    "Search crops, markets...": "\u092A\u093F\u0915\u0947, \u092C\u093E\u091C\u093E\u0930 \u0936\u094B\u0927\u093E...",
    "Search crops and markets": "\u092A\u093F\u0915\u0947 \u0906\u0923\u093F \u092C\u093E\u091C\u093E\u0930 \u0936\u094B\u0927\u093E",
    "Search": "\u0936\u094B\u0927\u093E",
    "Weather": "\u0939\u0935\u093E\u092E\u093E\u0928",
    "Notifications": "\u0938\u0942\u091A\u0928\u093E",
    "Edit farm profile": "\u0936\u0947\u0924\u0940\u091A\u0940 \u092E\u093E\u0939\u093F\u0924\u0940 \u0938\u0902\u092A\u093E\u0926\u093F\u0924 \u0915\u0930\u093E",
    "Welcome back": "\u092A\u0941\u0928\u094D\u0939\u093E \u0938\u094D\u0935\u093E\u0917\u0924 \u0906\u0939\u0947",
    "Your farm overview, crop recommendations, and market insights in one place.": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u0940\u091A\u0940 \u092E\u093E\u0939\u093F\u0924\u0940, \u092A\u0940\u0915 \u0936\u093F\u092B\u093E\u0930\u0938\u0940 \u0906\u0923\u093F \u092C\u093E\u091C\u093E\u0930\u092D\u093E\u0935 \u090F\u0915\u093E\u091A \u0920\u093F\u0915\u093E\u0923\u0940.",
    "Practical insights for your farm": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u0940\u0938\u093E\u0920\u0940 \u0909\u092A\u092F\u0941\u0915\u094D\u0924 \u092E\u093E\u0939\u093F\u0924\u0940",
    "Grow Smarter. Sell Better.": "\u0938\u094D\u092E\u093E\u0930\u094D\u091F \u0936\u0947\u0924\u0940 \u0915\u0930\u093E. \u091A\u093E\u0902\u0917\u0932\u0947 \u0935\u093F\u0915\u094D\u0930\u0940 \u0915\u0930\u093E.",
    "Your intelligent companion for healthier crops, smarter farming decisions, and better market opportunities.": "\u0928\u093F\u0930\u094B\u0917\u0940 \u092A\u093F\u0915\u0947, \u092F\u094B\u0917\u094D\u092F \u0936\u0947\u0924\u0940 \u0928\u093F\u0930\u094D\u0923\u092F \u0906\u0923\u093F \u091A\u093E\u0902\u0917\u0932\u094D\u092F\u093E \u092C\u093E\u091C\u093E\u0930 \u0938\u0902\u0927\u0940\u0902\u0938\u093E\u0920\u0940 \u0924\u0941\u092E\u091A\u093E \u0935\u093F\u0936\u094D\u0935\u093E\u0938\u0942 \u0938\u093E\u0925\u0940\u0926\u093E\u0930.",
    "Explore crop insights": "\u092A\u0940\u0915 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928 \u092A\u0939\u093E",
    "Check market prices": "\u092C\u093E\u091C\u093E\u0930\u092D\u093E\u0935 \u0924\u092A\u093E\u0938\u093E",
    "SEASONAL GUIDE": "\u0939\u0902\u0917\u093E\u092E\u0940 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0915",
    "Crop ideas to explore": "\u092A\u093E\u0939\u0923\u094D\u092F\u093E\u0938\u093E\u0930\u0916\u0940 \u092A\u093F\u0915\u0947",
    "General growing guides, not a soil diagnosis": "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0936\u0947\u0924\u0940 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928, \u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0928\u093E\u0939\u0940",
    "SAMPLE": "\u0928\u092E\u0941\u0928\u093E",
    "LIVE": "\u0925\u0947\u091F",
    "market price": "\u092C\u093E\u091C\u093E\u0930\u092D\u093E\u0935",
    "per quintal": "\u092A\u094D\u0930\u0924\u093F \u0915\u094D\u0935\u093F\u0902\u091F\u0932",
    "Open mandi insights for available prices": "\u0909\u092A\u0932\u092C\u094D\u0927 \u092D\u093E\u0935\u093E\u0902\u0938\u093E\u0920\u0940 \u092C\u093E\u091C\u093E\u0930 \u092E\u093E\u0939\u093F\u0924\u0940 \u0909\u0918\u0921\u093E",
    "Weather conditions": "\u0939\u0935\u093E\u092E\u093E\u0928\u093E\u091A\u0940 \u0938\u094D\u0925\u093F\u0924\u0940",
    "Screening result ready": "\u092A\u0940\u0915 \u0924\u092A\u093E\u0938\u0923\u0940\u091A\u093E \u0928\u093F\u0915\u093E\u0932 \u0924\u092F\u093E\u0930",
    "No crop scans yet": "\u0905\u0926\u094D\u092F\u093E\u092A \u092A\u0940\u0915 \u0924\u092A\u093E\u0938\u0923\u0940 \u0928\u093E\u0939\u0940",
    "Screening aid \xB7 not a confirmed diagnosis": "\u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u0924\u092A\u093E\u0938\u0923\u0940 \xB7 \u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0928\u093F\u0926\u093E\u0928 \u0928\u093E\u0939\u0940",
    "Scan a plant to check for possible issues": "\u0938\u0902\u092D\u093E\u0935\u094D\u092F \u0938\u092E\u0938\u094D\u092F\u093E\u0902\u0938\u093E\u0920\u0940 \u0930\u094B\u092A \u0924\u092A\u093E\u0938\u093E",
    "EXPLORE YOUR OPTIONS": "\u0924\u0941\u092E\u091A\u0947 \u092A\u0930\u094D\u092F\u093E\u092F \u092A\u0939\u093E",
    "Seasonal crop guide": "\u0939\u0902\u0917\u093E\u092E\u0940 \u092A\u0940\u0915 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0915",
    "Starting points for planning. Confirm local suitability with your soil report or KVK.": "\u0928\u093F\u092F\u094B\u091C\u0928\u093E\u0938\u093E\u0920\u0940 \u0938\u0941\u0930\u0941\u0935\u093E\u0924\u0940\u091A\u0947 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928. \u092E\u093E\u0924\u0940 \u0905\u0939\u0935\u093E\u0932 \u0915\u093F\u0902\u0935\u093E \u0915\u0943\u0937\u0940 \u0935\u093F\u091C\u094D\u091E\u093E\u0928 \u0915\u0947\u0902\u0926\u094D\u0930\u093E\u0915\u0921\u0942\u0928 \u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u0909\u092A\u092F\u0941\u0915\u094D\u0924\u0924\u093E \u0924\u092A\u093E\u0938\u093E.",
    "General guidance \xB7 not personalized": "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928 \xB7 \u0935\u0948\u092F\u0915\u094D\u0924\u093F\u0915 \u0928\u093E\u0939\u0940",
    "Soil guide": "\u092E\u093E\u0924\u0940 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928",
    "Growing duration": "\u0935\u093E\u0922\u0940\u091A\u093E \u0915\u093E\u0932\u093E\u0935\u0927\u0940",
    "Indicative mandi modal price \xB7 \u20B9/quintal": "\u0905\u0902\u0926\u093E\u091C\u093F\u0924 \u092C\u093E\u091C\u093E\u0930\u092D\u093E\u0935 \xB7 \u20B9/\u0915\u094D\u0935\u093F\u0902\u091F\u0932",
    "sample data": "\u0928\u092E\u0941\u0928\u093E \u092E\u093E\u0939\u093F\u0924\u0940",
    "live data": "\u0925\u0947\u091F \u092E\u093E\u0939\u093F\u0924\u0940",
    "No price available for this crop": "\u092F\u093E \u092A\u093F\u0915\u093E\u091A\u093E \u092D\u093E\u0935 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u093E\u0939\u0940",
    "Ask about": "\u092F\u093E\u092C\u0926\u094D\u0926\u0932 \u0935\u093F\u091A\u093E\u0930\u093E:",
    "Your Smart Farming Assistant": "\u0924\u0941\u092E\u091A\u093E \u0938\u094D\u092E\u093E\u0930\u094D\u091F \u0936\u0947\u0924\u0940 \u0938\u0939\u093E\u092F\u094D\u092F\u0915",
    "Get guidance on crop selection, soil health, pest management, irrigation, and market opportunities.": "\u092A\u0940\u0915 \u0928\u093F\u0935\u0921, \u092E\u093E\u0924\u0940\u091A\u0947 \u0906\u0930\u094B\u0917\u094D\u092F, \u0915\u0940\u0921 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928, \u0938\u093F\u0902\u091A\u0928 \u0906\u0923\u093F \u092C\u093E\u091C\u093E\u0930 \u0938\u0902\u0927\u0940\u0902\u092C\u093E\u092C\u0924 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928 \u092E\u093F\u0933\u0935\u093E.",
    "Which crop is suitable for my soil?": "\u092E\u093E\u091D\u094D\u092F\u093E \u091C\u092E\u093F\u0928\u0940\u0938\u093E\u0920\u0940 \u0915\u094B\u0923\u0924\u0947 \u092A\u0940\u0915 \u092F\u094B\u0917\u094D\u092F \u0906\u0939\u0947?",
    "How can I identify crop diseases?": "\u092E\u0940 \u092A\u093F\u0915\u093E\u0902\u091A\u0947 \u0930\u094B\u0917 \u0915\u0938\u0947 \u0913\u0933\u0916\u0942 \u0936\u0915\u0924\u094B?",
    "Which mandi offers a better price?": "\u0915\u094B\u0923\u0924\u094D\u092F\u093E \u092C\u093E\u091C\u093E\u0930\u093E\u0924 \u091A\u093E\u0902\u0917\u0932\u093E \u092D\u093E\u0935 \u092E\u093F\u0933\u0924\u094B?",
    "When should I irrigate my crops?": "\u092E\u0940 \u092A\u093F\u0915\u093E\u0902\u0928\u093E \u092A\u093E\u0923\u0940 \u0915\u0927\u0940 \u0926\u094D\u092F\u093E\u0935\u0947?",
    "Ask about your farm...": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u0940\u092C\u0926\u094D\u0926\u0932 \u0935\u093F\u091A\u093E\u0930\u093E...",
    "Ask the farming assistant": "\u0936\u0947\u0924\u0940 \u0938\u0939\u093E\u092F\u094D\u092F\u0915\u093E\u0932\u093E \u0935\u093F\u091A\u093E\u0930\u093E",
    "Answers are general information. Confirm important decisions with local agricultural experts.": "\u0909\u0924\u094D\u0924\u0930\u0947 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u092E\u093E\u0939\u093F\u0924\u0940 \u0906\u0939\u0947\u0924. \u092E\u0939\u0924\u094D\u0924\u094D\u0935\u093E\u091A\u0947 \u0928\u093F\u0930\u094D\u0923\u092F \u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u0915\u0943\u0937\u0940 \u0924\u091C\u094D\u091C\u094D\u091E\u093E\u0902\u0915\u0921\u0942\u0928 \u0924\u092A\u093E\u0938\u0942\u0928 \u0918\u094D\u092F\u093E.",
    "PLANT HEALTH": "\u092A\u0940\u0915 \u0906\u0930\u094B\u0917\u094D\u092F",
    "A closer look can help": "\u091C\u0935\u0933\u0942\u0928 \u0924\u092A\u093E\u0938\u0932\u094D\u092F\u093E\u0938 \u092E\u0926\u0924 \u0939\u094B\u0908\u0932",
    "Upload a clear leaf photo for an AI screening. Results are a starting point, not a confirmed diagnosis.": "\u090F\u0906\u092F \u0924\u092A\u093E\u0938\u0923\u0940\u0938\u093E\u0920\u0940 \u092A\u093E\u0928\u093E\u091A\u093E \u0938\u094D\u092A\u0937\u094D\u091F \u092B\u094B\u091F\u094B \u0905\u092A\u0932\u094B\u0921 \u0915\u0930\u093E. \u0928\u093F\u0915\u093E\u0932 \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u0938\u0902\u0915\u0947\u0924 \u0906\u0939\u0947\u0924, \u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0928\u093F\u0926\u093E\u0928 \u0928\u093E\u0939\u0940.",
    "Open crop doctor": "\u092A\u0940\u0915 \u0921\u0949\u0915\u094D\u091F\u0930 \u0909\u0918\u0921\u093E",
    "Feels like": "\u091C\u093E\u0923\u0935\u0924\u0947",
    "Checking today's forecast and field conditions...": "\u0906\u091C\u091A\u093E \u0939\u0935\u093E\u092E\u093E\u0928 \u0905\u0902\u0926\u093E\u091C \u0906\u0923\u093F \u0936\u0947\u0924\u093E\u091A\u0940 \u0938\u094D\u0925\u093F\u0924\u0940 \u0924\u092A\u093E\u0938\u0924 \u0906\u0939\u0947...",
    "Check the latest forecast before field work.": "\u0936\u0947\u0924\u093E\u0924 \u0915\u093E\u092E \u0915\u0930\u0923\u094D\u092F\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u0924\u093E\u091C\u093E \u0939\u0935\u093E\u092E\u093E\u0928 \u0905\u0902\u0926\u093E\u091C \u0924\u092A\u093E\u0938\u093E.",
    "Sample modal prices": "\u0928\u092E\u0941\u0928\u093E \u092C\u093E\u091C\u093E\u0930\u092D\u093E\u0935",
    "Live modal prices": "\u0925\u0947\u091F \u092C\u093E\u091C\u093E\u0930\u092D\u093E\u0935",
    "today": "\u0906\u091C",
    "Basket": "\u091F\u094B\u092A\u0932\u0940",
    "Ask an agronomist": "\u0915\u0943\u0937\u0940 \u0924\u091C\u094D\u091C\u094D\u091E\u093E\u0902\u0928\u093E \u0935\u093F\u091A\u093E\u0930\u093E",
    "Open AI farm assistant": "\u090F\u0906\u092F \u0936\u0947\u0924\u0940 \u0938\u0939\u093E\u092F\u094D\u092F\u0915 \u0909\u0918\u0921\u093E",
    "Farm assistant": "\u0936\u0947\u0924\u0940 \u0938\u0939\u093E\u092F\u094D\u092F\u0915",
    "Agriculture information, made simple": "\u0936\u0947\u0924\u0940\u0935\u093F\u0937\u092F\u0915 \u092E\u093E\u0939\u093F\u0924\u0940, \u0938\u094B\u092A\u094D\u092F\u093E \u092D\u093E\u0937\u0947\u0924",
    "Close assistant": "\u0938\u0939\u093E\u092F\u094D\u092F\u0915 \u092C\u0902\u0926 \u0915\u0930\u093E",
    "Thinking...": "\u0935\u093F\u091A\u093E\u0930 \u0915\u0930\u0924 \u0906\u0939\u0947...",
    "Speak your question": "\u0924\u0941\u092E\u091A\u093E \u092A\u094D\u0930\u0936\u094D\u0928 \u092C\u094B\u0932\u093E",
    "Send question": "\u092A\u094D\u0930\u0936\u094D\u0928 \u092A\u093E\u0920\u0935\u093E",
    "Ask about your crops...": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u092A\u093F\u0915\u093E\u0902\u092C\u0926\u094D\u0926\u0932 \u0935\u093F\u091A\u093E\u0930\u093E...",
    "Open navigation": "\u0928\u0947\u0935\u094D\u0939\u093F\u0917\u0947\u0936\u0928 \u0909\u0918\u0921\u093E",
    "Close menu": "\u092E\u0947\u0928\u0942 \u092C\u0902\u0926 \u0915\u0930\u093E",
    "Rabi \xB7 Oct\u2013Dec": "\u0930\u092C\u094D\u092C\u0940 \xB7 \u0911\u0915\u094D\u091F\u094B\u092C\u0930\u2013\u0921\u093F\u0938\u0947\u0902\u092C\u0930",
    "Kharif \xB7 Jun\u2013Aug": "\u0916\u0930\u0940\u092A \xB7 \u091C\u0942\u0928\u2013\u0911\u0917\u0938\u094D\u091F",
    "Well-drained loam": "\u091A\u093E\u0902\u0917\u0932\u093E \u0928\u093F\u091A\u0930\u093E \u0939\u094B\u0923\u093E\u0930\u0940 \u092A\u094B\u092F\u091F\u094D\u092F\u093E\u091A\u0940 \u092E\u093E\u0924\u0940",
    "Clay or alluvial soil": "\u091A\u093F\u0915\u0923\u092E\u093E\u0924\u0940 \u0915\u093F\u0902\u0935\u093E \u0917\u093E\u0933\u093E\u091A\u0940 \u092E\u093E\u0924\u0940",
    "Loose, well-drained loam": "\u092D\u0941\u0938\u092D\u0941\u0936\u0940\u0924, \u091A\u093E\u0902\u0917\u0932\u093E \u0928\u093F\u091A\u0930\u093E \u0939\u094B\u0923\u093E\u0930\u0940 \u092A\u094B\u092F\u091F\u094D\u092F\u093E\u091A\u0940 \u092E\u093E\u0924\u0940",
    "110\u2013140 days": "110\u2013140 \u0926\u093F\u0935\u0938",
    "120\u2013150 days": "120\u2013150 \u0926\u093F\u0935\u0938",
    "100\u2013120 days": "100\u2013120 \u0926\u093F\u0935\u0938",
    "Today": "\u0906\u091C",
    "Sun": "\u0930\u0935\u093F",
    "Mon": "\u0938\u094B\u092E",
    "Tue": "\u092E\u0902\u0917\u0933",
    "Wed": "\u092C\u0941\u0927",
    "Thu": "\u0917\u0941\u0930\u0941",
    "Fri": "\u0936\u0941\u0915\u094D\u0930",
    "Clear sky": "\u0928\u093F\u0930\u092D\u094D\u0930 \u0906\u0915\u093E\u0936",
    "Partly cloudy": "\u0905\u0902\u0936\u0924\u0903 \u0922\u0917\u093E\u0933",
    "Overcast": "\u0922\u0917\u093E\u0933",
    "Fog": "\u0927\u0941\u0915\u0947",
    "Drizzle or rain": "\u0930\u093F\u092E\u091D\u093F\u092E \u0915\u093F\u0902\u0935\u093E \u092A\u093E\u090A\u0938",
    "Rain showers": "\u092A\u093E\u0935\u0938\u093E\u091A\u094D\u092F\u093E \u0938\u0930\u0940",
    "Thunderstorms": "\u0935\u093E\u0926\u0933\u0940 \u092A\u093E\u090A\u0938",
    "Snow": "\u0939\u093F\u092E\u0935\u0943\u0937\u094D\u091F\u0940",
    "Snow showers": "\u0939\u093F\u092E\u0935\u0943\u0937\u094D\u091F\u0940\u091A\u094D\u092F\u093E \u0938\u0930\u0940",
    "Current conditions": "\u0938\u0927\u094D\u092F\u093E\u091A\u0940 \u0938\u094D\u0925\u093F\u0924\u0940",
    "Loading weather": "\u0939\u0935\u093E\u092E\u093E\u0928 \u0932\u094B\u0921 \u0939\u094B\u0924 \u0906\u0939\u0947",
    "Conditions look mostly dry. Check soil moisture before your next irrigation.": "\u0939\u0935\u093E\u092E\u093E\u0928 \u092C\u0939\u0941\u0924\u0947\u0915 \u0915\u094B\u0930\u0921\u0947 \u0906\u0939\u0947. \u092A\u0941\u0922\u0940\u0932 \u0938\u093F\u0902\u091A\u0928\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u091C\u092E\u093F\u0928\u0940\u0924\u0940\u0932 \u0913\u0932\u093E\u0935\u093E \u0924\u092A\u093E\u0938\u093E.",
    "Rain is likely on": "\u092F\u093E \u0926\u093F\u0935\u0936\u0940 \u092A\u093E\u0935\u0938\u093E\u091A\u0940 \u0936\u0915\u094D\u092F\u0924\u093E \u0906\u0939\u0947:",
    "Avoid spraying pesticides before or during the showers.": "\u092A\u093E\u0935\u0938\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u0915\u093F\u0902\u0935\u093E \u092A\u093E\u090A\u0938 \u0938\u0941\u0930\u0942 \u0905\u0938\u0924\u093E\u0928\u093E \u0915\u0940\u091F\u0915\u0928\u093E\u0936\u0915\u093E\u0902\u091A\u0940 \u092B\u0935\u093E\u0930\u0923\u0940 \u0915\u0930\u0942 \u0928\u0915\u093E.",
    "Ask": "\u0935\u093F\u091A\u093E\u0930\u093E",
    "What should I consider before growing {crop} near {location}?": "{location} \u091C\u0935\u0933 {crop} \u0932\u093E\u0935\u0923\u094D\u092F\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u092E\u0940 \u0915\u094B\u0923\u0924\u094D\u092F\u093E \u0917\u094B\u0937\u094D\u091F\u0940\u0902\u091A\u093E \u0935\u093F\u091A\u093E\u0930 \u0915\u0930\u093E\u0935\u093E?",
    Wheat: "\u0917\u0939\u0942",
    Rice: "\u092D\u093E\u0924",
    Onion: "\u0915\u093E\u0902\u0926\u093E",
    Cotton: "\u0915\u093E\u092A\u0942\u0938",
    Tomato: "\u091F\u094B\u092E\u0945\u091F\u094B",
    Potato: "\u092C\u091F\u093E\u091F\u093E",
    rain: "\u092A\u093E\u090A\u0938",
    "AI crop health doctor": "\u090F\u0906\u092F \u092A\u0940\u0915 \u0906\u0930\u094B\u0917\u094D\u092F \u0921\u0949\u0915\u094D\u091F\u0930",
    "Take a clear photo of a leaf or affected plant. We'll help you understand what might be happening.": "\u092A\u093E\u0928\u093E\u091A\u093E \u0915\u093F\u0902\u0935\u093E \u092C\u093E\u0927\u093F\u0924 \u0930\u094B\u092A\u093E\u091A\u093E \u0938\u094D\u092A\u0937\u094D\u091F \u092B\u094B\u091F\u094B \u0918\u094D\u092F\u093E. \u0938\u0902\u092D\u093E\u0935\u094D\u092F \u0938\u092E\u0938\u094D\u092F\u093E \u0938\u092E\u091C\u0942\u0928 \u0918\u0947\u0923\u094D\u092F\u093E\u0938 \u0906\u092E\u094D\u0939\u0940 \u092E\u0926\u0924 \u0915\u0930\u0942.",
    "What crop are you checking?": "\u0924\u0941\u092E\u094D\u0939\u0940 \u0915\u094B\u0923\u0924\u0947 \u092A\u0940\u0915 \u0924\u092A\u093E\u0938\u0924 \u0906\u0939\u093E\u0924?",
    "Diagnosis history": "\u092A\u0940\u0915 \u0924\u092A\u093E\u0938\u0923\u0940\u091A\u093E \u0907\u0924\u093F\u0939\u093E\u0938",
    "Past crop checks are saved to your account. Uploaded photos are not stored.": "\u092E\u093E\u0917\u0940\u0932 \u092A\u0940\u0915 \u0924\u092A\u093E\u0938\u0923\u094D\u092F\u093E \u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0916\u093E\u0924\u094D\u092F\u093E\u0924 \u091C\u0924\u0928 \u0915\u0947\u0932\u094D\u092F\u093E \u091C\u093E\u0924\u093E\u0924. \u0905\u092A\u0932\u094B\u0921 \u0915\u0947\u0932\u0947\u0932\u0947 \u092B\u094B\u091F\u094B \u091C\u0924\u0928 \u0915\u0947\u0932\u0947 \u091C\u093E\u0924 \u0928\u093E\u0939\u0940\u0924.",
    "No saved diagnoses yet": "\u0905\u0926\u094D\u092F\u093E\u092A \u0924\u092A\u093E\u0938\u0923\u0940\u091A\u0947 \u0928\u093F\u0915\u093E\u0932 \u091C\u0924\u0928 \u0915\u0947\u0932\u0947\u0932\u0947 \u0928\u093E\u0939\u0940\u0924",
    "Your recent crop checks will appear here.": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0905\u0932\u0940\u0915\u0921\u0940\u0932 \u092A\u0940\u0915 \u0924\u092A\u093E\u0938\u0923\u094D\u092F\u093E \u092F\u0947\u0925\u0947 \u0926\u093F\u0938\u0924\u0940\u0932.",
    "Loading diagnosis history...": "\u092A\u0940\u0915 \u0924\u092A\u093E\u0938\u0923\u0940\u091A\u093E \u0907\u0924\u093F\u0939\u093E\u0938 \u0932\u094B\u0921 \u0939\u094B\u0924 \u0906\u0939\u0947...",
    "Upload or take a photo": "\u092B\u094B\u091F\u094B \u0905\u092A\u0932\u094B\u0921 \u0915\u0930\u093E \u0915\u093F\u0902\u0935\u093E \u0915\u093E\u0922\u093E",
    "Drop an image here, or browse \xB7 JPG, PNG or WebP \xB7 up to 10 MB": "\u092A\u094D\u0930\u0924\u093F\u092E\u093E \u092F\u0947\u0925\u0947 \u091F\u093E\u0915\u093E \u0915\u093F\u0902\u0935\u093E \u0928\u093F\u0935\u0921\u093E \xB7 JPG, PNG \u0915\u093F\u0902\u0935\u093E WebP \xB7 \u0915\u092E\u093E\u0932 10 MB",
    "Checking your crop...": "\u0924\u0941\u092E\u091A\u0947 \u092A\u0940\u0915 \u0924\u092A\u093E\u0938\u0924 \u0906\u0939\u0947...",
    "Check crop health": "\u092A\u0940\u0915 \u0906\u0930\u094B\u0917\u094D\u092F \u0924\u092A\u093E\u0938\u093E",
    "Record planting, irrigation, and fieldwork in one place.": "\u092A\u0947\u0930\u0923\u0940, \u0938\u093F\u0902\u091A\u0928 \u0906\u0923\u093F \u0936\u0947\u0924\u0915\u093E\u092E\u093E\u091A\u0940 \u0928\u094B\u0902\u0926 \u090F\u0915\u093E\u091A \u0920\u093F\u0915\u093E\u0923\u0940 \u0920\u0947\u0935\u093E.",
    "Add diary entry": "\u0921\u093E\u092F\u0930\u0940\u0924 \u0928\u094B\u0902\u0926 \u091C\u094B\u0921\u093E",
    "Activity": "\u0915\u093E\u092E",
    "Date": "\u0924\u093E\u0930\u0940\u0916",
    "Notes (optional)": "\u0928\u094B\u0902\u0926 (\u0910\u091A\u094D\u091B\u093F\u0915)",
    "Add a note about this field activity...": "\u092F\u093E \u0936\u0947\u0924\u0915\u093E\u092E\u093E\u092C\u0926\u094D\u0926\u0932 \u0928\u094B\u0902\u0926 \u0932\u093F\u0939\u093E...",
    "Save entry": "\u0928\u094B\u0902\u0926 \u091C\u0924\u0928 \u0915\u0930\u093E",
    "Saving...": "\u091C\u0924\u0928 \u0939\u094B\u0924 \u0906\u0939\u0947...",
    "Your recent field activity": "\u0924\u0941\u092E\u091A\u0940 \u0905\u0932\u0940\u0915\u0921\u0940\u0932 \u0936\u0947\u0924\u0915\u093E\u092E\u093E\u091A\u0940 \u0928\u094B\u0902\u0926",
    "No diary entries yet": "\u0905\u0926\u094D\u092F\u093E\u092A \u0921\u093E\u092F\u0930\u0940\u0924 \u0915\u094B\u0923\u0924\u0940\u0939\u0940 \u0928\u094B\u0902\u0926 \u0928\u093E\u0939\u0940",
    "Your saved field activities will appear here.": "\u0924\u0941\u092E\u091A\u0940 \u091C\u0924\u0928 \u0915\u0947\u0932\u0947\u0932\u0940 \u0936\u0947\u0924\u0915\u093E\u092E\u093E\u091A\u0940 \u0928\u094B\u0902\u0926 \u092F\u0947\u0925\u0947 \u0926\u093F\u0938\u0947\u0932.",
    "Loading diary...": "\u0921\u093E\u092F\u0930\u0940 \u0932\u094B\u0921 \u0939\u094B\u0924 \u0906\u0939\u0947...",
    "Sowing": "\u092A\u0947\u0930\u0923\u0940",
    "Irrigation": "\u0938\u093F\u0902\u091A\u0928",
    "Fertilizing": "\u0916\u0924 \u0926\u0947\u0923\u0947",
    "Spraying": "\u092B\u0935\u093E\u0930\u0923\u0940",
    "Weeding": "\u0928\u093F\u0902\u0926\u0923\u0940",
    "Harvest": "\u0915\u093E\u0922\u0923\u0940",
    "Other": "\u0907\u0924\u0930",
    "Add a reminder": "\u0938\u094D\u092E\u0930\u0923\u092A\u0924\u094D\u0930 \u091C\u094B\u0921\u093E",
    "Set a task and due date to keep track of upcoming farm work.": "\u092F\u0947\u0923\u093E\u0931\u094D\u092F\u093E \u0936\u0947\u0924\u0915\u093E\u092E\u093E\u091A\u093E \u092E\u093E\u0917\u094B\u0935\u093E \u0920\u0947\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0915\u093E\u092E \u0906\u0923\u093F \u0924\u093E\u0930\u0940\u0916 \u0920\u0930\u0935\u093E.",
    "Task": "\u0915\u093E\u092E",
    "Crop (optional)": "\u092A\u0940\u0915 (\u0910\u091A\u094D\u091B\u093F\u0915)",
    "General farm task": "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0936\u0947\u0924\u0915\u093E\u092E",
    "Due date": "\u0926\u0947\u092F \u0924\u093E\u0930\u0940\u0916",
    "Save reminder": "\u0938\u094D\u092E\u0930\u0923\u092A\u0924\u094D\u0930 \u091C\u0924\u0928 \u0915\u0930\u093E",
    "Upcoming and overdue": "\u092F\u0947\u0923\u093E\u0930\u0940 \u0906\u0923\u093F \u092C\u093E\u0915\u0940 \u0915\u093E\u092E\u0947",
    "No reminders yet": "\u0905\u0926\u094D\u092F\u093E\u092A \u0938\u094D\u092E\u0930\u0923\u092A\u0924\u094D\u0930 \u0928\u093E\u0939\u0940",
    "Your saved tasks will appear here.": "\u0924\u0941\u092E\u091A\u0940 \u091C\u0924\u0928 \u0915\u0947\u0932\u0947\u0932\u0940 \u0915\u093E\u092E\u0947 \u092F\u0947\u0925\u0947 \u0926\u093F\u0938\u0924\u0940\u0932.",
    "Loading reminders...": "\u0938\u094D\u092E\u0930\u0923\u092A\u0924\u094D\u0930\u0947 \u0932\u094B\u0921 \u0939\u094B\u0924 \u0906\u0939\u0947\u0924...",
    "Due today": "\u0906\u091C\u091A\u0947 \u0915\u093E\u092E",
    "Overdue": "\u092E\u0941\u0926\u0924 \u0938\u0902\u092A\u0932\u0940",
    "Upcoming": "\u092F\u0947\u0923\u093E\u0930\u0947",
    "Completed": "\u092A\u0942\u0930\u094D\u0923",
    "Mark complete": "\u092A\u0942\u0930\u094D\u0923 \u0915\u0930\u093E",
    "Reopen": "\u092A\u0941\u0928\u094D\u0939\u093E \u0938\u0941\u0930\u0942 \u0915\u0930\u093E",
    "Delete reminder": "\u0938\u094D\u092E\u0930\u0923\u092A\u0924\u094D\u0930 \u0939\u091F\u0935\u093E",
    "Your photo is used only to provide this result. This tool is a screening aid, not a confirmed diagnosis.": "\u0924\u0941\u092E\u091A\u093E \u092B\u094B\u091F\u094B \u092B\u0915\u094D\u0924 \u0939\u093E \u0928\u093F\u0915\u093E\u0932 \u0926\u0947\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0935\u093E\u092A\u0930\u0932\u093E \u091C\u093E\u0924\u094B. \u0939\u0947 \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0906\u0939\u0947, \u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0928\u093F\u0926\u093E\u0928 \u0928\u093E\u0939\u0940.",
    "Your crop check will appear here": "\u092A\u0940\u0915 \u0924\u092A\u093E\u0938\u0923\u0940\u091A\u093E \u0928\u093F\u0915\u093E\u0932 \u092F\u0947\u0925\u0947 \u0926\u093F\u0938\u0947\u0932",
    "Upload a clear photo in natural light. Try to include both healthy and affected leaves.": "\u0928\u0948\u0938\u0930\u094D\u0917\u093F\u0915 \u092A\u094D\u0930\u0915\u093E\u0936\u093E\u0924 \u0938\u094D\u092A\u0937\u094D\u091F \u092B\u094B\u091F\u094B \u0905\u092A\u0932\u094B\u0921 \u0915\u0930\u093E. \u0928\u093F\u0930\u094B\u0917\u0940 \u0906\u0923\u093F \u092C\u093E\u0927\u093F\u0924 \u0926\u094B\u0928\u094D\u0939\u0940 \u092A\u093E\u0928\u0947 \u0938\u092E\u093E\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E.",
    "Clear, close-up photo": "\u0938\u094D\u092A\u0937\u094D\u091F, \u091C\u0935\u0933\u0942\u0928 \u0918\u0947\u0924\u0932\u0947\u0932\u093E \u092B\u094B\u091F\u094B",
    "Good natural light": "\u091A\u093E\u0902\u0917\u0932\u093E \u0928\u0948\u0938\u0930\u094D\u0917\u093F\u0915 \u092A\u094D\u0930\u0915\u093E\u0936",
    "One plant at a time": "\u090F\u0915\u093E \u0935\u0947\u0933\u0940 \u090F\u0915 \u0930\u094B\u092A",
    "concern": "\u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u091A\u093F\u0902\u0924\u093E",
    "Sample screening": "\u0928\u092E\u0941\u0928\u093E \u092A\u0930\u0940\u0915\u094D\u0937\u0923",
    "confidence": "\u0935\u093F\u0936\u094D\u0935\u093E\u0938 \u092A\u093E\u0924\u0933\u0940",
    "What to look for": "\u0915\u093E\u092F \u092A\u093E\u0939\u093E\u0935\u0947",
    "Gentle first steps": "\u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u0909\u092A\u093E\u092F",
    "Chemical treatment": "\u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u0909\u092A\u091A\u093E\u0930",
    "Prevention": "\u092A\u094D\u0930\u0924\u093F\u092C\u0902\u0927",
    "Choose a nearby lab and a time that works for you.": "\u091C\u0935\u0933\u091A\u0940 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E \u0906\u0923\u093F \u0924\u0941\u092E\u094D\u0939\u093E\u0932\u093E \u0938\u094B\u092F\u0940\u091A\u0940 \u0935\u0947\u0933 \u0928\u093F\u0935\u0921\u093E.",
    "Request confirmed": "\u0935\u093F\u0928\u0902\u0924\u0940\u091A\u0940 \u092A\u0941\u0937\u094D\u091F\u0940 \u091D\u093E\u0932\u0940",
    "Demo request created": "\u0921\u0947\u092E\u094B \u0935\u093F\u0928\u0902\u0924\u0940 \u0924\u092F\u093E\u0930 \u091D\u093E\u0932\u0940",
    "Your appointment is saved. Show this token at the lab or mention it when arranging pickup.": "\u0924\u0941\u092E\u091A\u0940 \u092D\u0947\u091F \u091C\u0924\u0928 \u091D\u093E\u0932\u0940 \u0906\u0939\u0947. \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u0947\u0924 \u0939\u093E \u091F\u094B\u0915\u0928 \u0926\u093E\u0916\u0935\u093E \u0915\u093F\u0902\u0935\u093E \u0928\u092E\u0941\u0928\u093E \u0918\u0947\u0923\u094D\u092F\u093E\u091A\u0940 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E \u0915\u0930\u0924\u093E\u0928\u093E \u0938\u093E\u0902\u0917\u093E.",
    "This demo token is not saved yet. Connect a database to keep appointment records.": "\u0939\u093E \u0921\u0947\u092E\u094B \u091F\u094B\u0915\u0928 \u0905\u0926\u094D\u092F\u093E\u092A \u091C\u0924\u0928 \u091D\u093E\u0932\u0947\u0932\u093E \u0928\u093E\u0939\u0940. \u092D\u0947\u091F\u0940\u0902\u091A\u0940 \u0928\u094B\u0902\u0926 \u0920\u0947\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u091C\u094B\u0921\u093E.",
    "Your appointment token": "\u0924\u0941\u092E\u091A\u093E \u092D\u0947\u091F \u091F\u094B\u0915\u0928",
    "Book another test": "\u0926\u0941\u0938\u0930\u0940 \u0924\u092A\u093E\u0938\u0923\u0940 \u092C\u0941\u0915 \u0915\u0930\u093E",
    "Mobile number": "\u092E\u094B\u092C\u093E\u0907\u0932 \u0915\u094D\u0930\u092E\u093E\u0902\u0915",
    "Crop to test": "\u0924\u092A\u093E\u0938\u0923\u0940\u091A\u0947 \u092A\u0940\u0915",
    "Preferred date": "\u092A\u0938\u0902\u0924\u0940\u091A\u0940 \u0924\u093E\u0930\u0940\u0916",
    "Time slot": "\u0935\u0947\u0933",
    "How would you like to test?": "\u0924\u0941\u092E\u094D\u0939\u093E\u0932\u093E \u0924\u092A\u093E\u0938\u0923\u0940 \u0915\u0936\u0940 \u0915\u0930\u093E\u092F\u091A\u0940 \u0906\u0939\u0947?",
    "Visit the lab": "\u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u0947\u0932\u093E \u092D\u0947\u091F \u0926\u094D\u092F\u093E",
    "Bring your soil sample": "\u092E\u093E\u0924\u0940\u091A\u093E \u0928\u092E\u0941\u0928\u093E \u0906\u0923\u093E",
    "Sample pickup": "\u0928\u092E\u0941\u0928\u093E \u0918\u0947\u090A\u0928 \u091C\u093E\u0923\u0947",
    "Lab will confirm availability": "\u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E \u0909\u092A\u0932\u092C\u094D\u0927\u0924\u0947\u091A\u0940 \u092A\u0941\u0937\u094D\u091F\u0940 \u0915\u0930\u0947\u0932",
    "Soil testing lab": "\u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E",
    "Choose a nearby lab or enter a lab name": "\u091C\u0935\u0933\u091A\u0940 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E \u0928\u093F\u0935\u0921\u093E \u0915\u093F\u0902\u0935\u093E \u0928\u093E\u0935 \u092D\u0930\u093E",
    "Enter a soil testing lab name": "\u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u0947\u091A\u0947 \u0928\u093E\u0935 \u092D\u0930\u093E",
    "Request appointment": "\u092D\u0947\u091F\u0940\u091A\u0940 \u0935\u093F\u0928\u0902\u0924\u0940 \u0915\u0930\u093E",
    "Nearby soil labs": "\u091C\u0935\u0933\u091A\u094D\u092F\u093E \u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E",
    "Refresh": "\u0930\u0940\u092B\u094D\u0930\u0947\u0936 \u0915\u0930\u093E",
    "OpenStreetMap nearby-place results \xB7 ordered by distance": "OpenStreetMap \u0935\u0930\u0940\u0932 \u091C\u0935\u0933\u091A\u0940 \u0920\u093F\u0915\u093E\u0923\u0947 \xB7 \u0905\u0902\u0924\u0930\u093E\u0928\u0941\u0938\u093E\u0930",
    "Looking for agriculture and soil-testing facilities near your farm...": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u093E\u091C\u0935\u0933 \u0915\u0943\u0937\u0940 \u0906\u0923\u093F \u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0915\u0947\u0902\u0926\u094D\u0930\u0947 \u0936\u094B\u0927\u0924 \u0906\u0939\u0947...",
    "No soil-testing facilities were listed nearby.": "\u091C\u0935\u0933 \u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0915\u0947\u0902\u0926\u094D\u0930\u093E\u0902\u091A\u0940 \u0928\u094B\u0902\u0926 \u0906\u0922\u0933\u0932\u0940 \u0928\u093E\u0939\u0940.",
    "Address not listed": "\u092A\u0924\u094D\u0924\u093E \u0926\u093F\u0932\u0947\u0932\u093E \u0928\u093E\u0939\u0940",
    "Select for booking": "\u092C\u0941\u0915\u093F\u0902\u0917\u0938\u093E\u0920\u0940 \u0928\u093F\u0935\u0921\u093E",
    "Map": "\u0928\u0915\u093E\u0936\u093E",
    "Directions": "\u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928",
    "Search soil labs on Google Maps": "Google Maps \u0935\u0930 \u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0915\u0947\u0902\u0926\u094D\u0930\u0947 \u0936\u094B\u0927\u093E",
    "Why test your soil?": "\u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0915\u093E \u0915\u0930\u093E\u0935\u0947?",
    "Listings come from OpenStreetMap and may be incomplete or unverified. Call the facility to confirm soil testing services and availability.": "\u092F\u093E\u0926\u094D\u092F\u093E OpenStreetMap \u092E\u0927\u0942\u0928 \u0918\u0947\u0924\u0932\u094D\u092F\u093E \u0906\u0939\u0947\u0924 \u0906\u0923\u093F \u0905\u092A\u0942\u0930\u094D\u0923 \u0915\u093F\u0902\u0935\u093E \u0905\u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0905\u0938\u0942 \u0936\u0915\u0924\u093E\u0924. \u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0938\u0947\u0935\u093E \u0906\u0923\u093F \u0909\u092A\u0932\u092C\u094D\u0927\u0924\u0947\u091A\u0940 \u0916\u093E\u0924\u094D\u0930\u0940 \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0915\u0947\u0902\u0926\u094D\u0930\u093E\u0932\u093E \u092B\u094B\u0928 \u0915\u0930\u093E.",
    "A soil test measures pH and nutrients so you can make informed fertilizer choices and avoid unnecessary inputs. Ask the lab for a soil health card with your results.": "\u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923\u093E\u092E\u0941\u0933\u0947 pH \u0906\u0923\u093F \u092A\u094B\u0937\u0915\u0926\u094D\u0930\u0935\u094D\u092F\u0947 \u0938\u092E\u091C\u0924\u093E\u0924. \u0924\u094D\u092F\u093E\u092E\u0941\u0933\u0947 \u092F\u094B\u0917\u094D\u092F \u0916\u0924 \u0928\u093F\u0935\u0921\u0924\u093E \u092F\u0947\u0924\u0947 \u0906\u0923\u093F \u0905\u0928\u093E\u0935\u0936\u094D\u092F\u0915 \u0916\u0930\u094D\u091A \u091F\u093E\u0933\u0924\u093E \u092F\u0947\u0924\u094B. \u0928\u093F\u0915\u093E\u0932\u093E\u0902\u0938\u0939 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u0947\u0915\u0921\u0942\u0928 \u092E\u0943\u0926\u093E \u0906\u0930\u094B\u0917\u094D\u092F \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u093E\u0917\u093E.",
    "km away": "\u0915\u093F\u092E\u0940 \u0905\u0902\u0924\u0930\u093E\u0935\u0930",
    "Lab search radius": "\u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E \u0936\u094B\u0927\u0923\u094D\u092F\u093E\u091A\u0947 \u0905\u0902\u0924\u0930",
    "Close farm profile": "\u0936\u0947\u0924\u0940\u091A\u0940 \u092E\u093E\u0939\u093F\u0924\u0940 \u092C\u0902\u0926 \u0915\u0930\u093E",
    "Mandi market insights": "\u092E\u0902\u0921\u0940 \u092C\u093E\u091C\u093E\u0930 \u092E\u093E\u0939\u093F\u0924\u0940",
    "Search mandi prices for multiple crops across India.": "\u092D\u093E\u0930\u0924\u092D\u0930\u093E\u0924\u0940\u0932 \u0935\u093F\u0935\u093F\u0927 \u092A\u093F\u0915\u093E\u0902\u091A\u0947 \u092C\u093E\u091C\u093E\u0930\u092D\u093E\u0935 \u0936\u094B\u0927\u093E.",
    "Find crop prices": "\u092A\u093F\u0915\u093E\u0902\u091A\u0947 \u092D\u093E\u0935 \u0936\u094B\u0927\u093E",
    "Filter by commodity and mandi location. Leave blank to browse all available records.": "\u092A\u0940\u0915 \u0906\u0923\u093F \u092E\u0902\u0921\u0940 \u0920\u093F\u0915\u093E\u0923\u093E\u0928\u0941\u0938\u093E\u0930 \u092B\u093F\u0932\u094D\u091F\u0930 \u0915\u0930\u093E. \u0938\u0930\u094D\u0935 \u0928\u094B\u0902\u0926\u0940 \u092A\u093E\u0939\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0930\u093F\u0915\u093E\u092E\u0947 \u0920\u0947\u0935\u093E.",
    "State": "\u0930\u093E\u091C\u094D\u092F",
    "All states": "\u0938\u0930\u094D\u0935 \u0930\u093E\u091C\u094D\u092F\u0947",
    "Crop": "\u092A\u0940\u0915",
    "All crops": "\u0938\u0930\u094D\u0935 \u092A\u093F\u0915\u0947",
    "All districts": "\u0938\u0930\u094D\u0935 \u091C\u093F\u0932\u094D\u0939\u0947",
    "Select a state first": "\u092A\u094D\u0930\u0925\u092E \u0930\u093E\u091C\u094D\u092F \u0928\u093F\u0935\u0921\u093E",
    "Mandi": "\u092E\u0902\u0921\u0940",
    "All mandis in district": "\u091C\u093F\u0932\u094D\u0939\u094D\u092F\u093E\u0924\u0940\u0932 \u0938\u0930\u094D\u0935 \u092E\u0902\u0921\u094D\u092F\u093E",
    "All mandis in state": "\u0930\u093E\u091C\u094D\u092F\u093E\u0924\u0940\u0932 \u0938\u0930\u094D\u0935 \u092E\u0902\u0921\u094D\u092F\u093E",
    "Search all fields": "\u0938\u0930\u094D\u0935 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u093E\u0902\u0924 \u0936\u094B\u0927\u093E",
    "Crop, variety, location...": "\u092A\u0940\u0915, \u091C\u093E\u0924, \u0920\u093F\u0915\u093E\u0923...",
    "Loading available crops, districts, and mandis...": "\u0909\u092A\u0932\u092C\u094D\u0927 \u092A\u093F\u0915\u0947, \u091C\u093F\u0932\u094D\u0939\u0947 \u0906\u0923\u093F \u092E\u0902\u0921\u094D\u092F\u093E \u0932\u094B\u0921 \u0939\u094B\u0924 \u0906\u0939\u0947\u0924...",
    "Clear all filters": "\u0938\u0930\u094D\u0935 \u092B\u093F\u0932\u094D\u091F\u0930 \u0915\u093E\u0922\u093E",
    "Price trend": "\u092D\u093E\u0935\u093E\u091A\u093E \u0915\u0932",
    "Price alerts": "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F",
    "Create a price alert": "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u0924\u092F\u093E\u0930 \u0915\u0930\u093E",
    "Choose a market record and target price.": "\u092E\u0902\u0921\u0940 \u0928\u094B\u0902\u0926 \u0906\u0923\u093F \u0932\u0915\u094D\u0937\u094D\u092F \u092D\u093E\u0935 \u0928\u093F\u0935\u0921\u093E.",
    "Selected market record": "\u0928\u093F\u0935\u0921\u0932\u0947\u0932\u0940 \u092E\u0902\u0921\u0940 \u0928\u094B\u0902\u0926",
    "Alert direction": "\u0905\u0932\u0930\u094D\u091F\u091A\u0940 \u0926\u093F\u0936\u093E",
    "At or above": "\u092F\u093E \u092D\u093E\u0935\u093E\u0907\u0924\u0915\u093E \u0915\u093F\u0902\u0935\u093E \u091C\u093E\u0938\u094D\u0924",
    "At or below": "\u092F\u093E \u092D\u093E\u0935\u093E\u0907\u0924\u0915\u093E \u0915\u093F\u0902\u0935\u093E \u0915\u092E\u0940",
    "Target price (\u20B9 per quintal)": "\u0932\u0915\u094D\u0937\u094D\u092F \u092D\u093E\u0935 (\u20B9 \u092A\u094D\u0930\u0924\u093F \u0915\u094D\u0935\u093F\u0902\u091F\u0932)",
    "Save price alert": "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u091C\u0924\u0928 \u0915\u0930\u093E",
    "Current price": "\u0938\u0927\u094D\u092F\u093E\u091A\u093E \u092D\u093E\u0935",
    "Your saved alerts": "\u0924\u0941\u092E\u091A\u0947 \u091C\u0924\u0928 \u0915\u0947\u0932\u0947\u0932\u0947 \u0905\u0932\u0930\u094D\u091F",
    "No price alerts yet": "\u0905\u0926\u094D\u092F\u093E\u092A \u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u0928\u093E\u0939\u0940",
    "Create alerts from the current market list. Alerts are checked when matching prices are loaded; they do not send phone notifications.": "\u0938\u0927\u094D\u092F\u093E\u091A\u094D\u092F\u093E \u092C\u093E\u091C\u093E\u0930 \u092F\u093E\u0926\u0940\u0924\u0942\u0928 \u0905\u0932\u0930\u094D\u091F \u0924\u092F\u093E\u0930 \u0915\u0930\u093E. \u091C\u0941\u0933\u0923\u093E\u0930\u0947 \u092D\u093E\u0935 \u0932\u094B\u0921 \u091D\u093E\u0932\u094D\u092F\u093E\u0935\u0930 \u0905\u0932\u0930\u094D\u091F \u0924\u092A\u093E\u0938\u0932\u0947 \u091C\u093E\u0924\u093E\u0924; \u092B\u094B\u0928\u0935\u0930 \u0938\u0942\u091A\u0928\u093E \u092A\u093E\u0920\u0935\u0932\u0940 \u091C\u093E\u0924 \u0928\u093E\u0939\u0940.",
    "Triggered": "\u0932\u0915\u094D\u0937\u094D\u092F \u0917\u093E\u0920\u0932\u0947",
    "Not reached": "\u0932\u0915\u094D\u0937\u094D\u092F \u0917\u093E\u0920\u0932\u0947\u0932\u0947 \u0928\u093E\u0939\u0940",
    "No matching quote is loaded right now.": "\u0938\u0927\u094D\u092F\u093E \u092F\u093E \u092E\u0902\u0921\u0940\u091A\u093E \u091C\u0941\u0933\u0923\u093E\u0930\u093E \u092D\u093E\u0935 \u0932\u094B\u0921 \u0928\u093E\u0939\u0940.",
    "Remove price alert": "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u0915\u093E\u0922\u093E",
    "Loading price alerts...": "\u092D\u093E\u0935 \u0905\u0932\u0930\u094D\u091F \u0932\u094B\u0921 \u0939\u094B\u0924 \u0906\u0939\u0947\u0924...",
    "Recent mandi modal price \xB7 \u20B9 per quintal": "\u0905\u0932\u0940\u0915\u0921\u0940\u0932 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \xB7 \u20B9 \u092A\u094D\u0930\u0924\u093F \u0915\u094D\u0935\u093F\u0902\u091F\u0932",
    "Choose crop and mandi for price trend": "\u092D\u093E\u0935\u093E\u091A\u093E \u0915\u0932 \u092A\u093E\u0939\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u092A\u0940\u0915 \u0906\u0923\u093F \u092E\u0902\u0921\u0940 \u0928\u093F\u0935\u0921\u093E",
    "Modal price": "\u092A\u094D\u0930\u091A\u0932\u093F\u0924 \u092D\u093E\u0935",
    "Today's change": "\u0906\u091C\u091A\u093E \u092C\u0926\u0932",
    "Price history is not available for this record.": "\u092F\u093E \u0928\u094B\u0902\u0926\u0940\u0938\u093E\u0920\u0940 \u092D\u093E\u0935\u093E\u091A\u093E \u0907\u0924\u093F\u0939\u093E\u0938 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u093E\u0939\u0940.",
    "Markets on this page": "\u092F\u093E \u092A\u0943\u0937\u094D\u0920\u093E\u0935\u0930\u0940\u0932 \u092C\u093E\u091C\u093E\u0930",
    "Select any crop and mandi for the chart": "\u0906\u0932\u0947\u0916\u093E\u0938\u093E\u0920\u0940 \u0915\u094B\u0923\u0924\u0947\u0939\u0940 \u092A\u0940\u0915 \u0906\u0923\u093F \u092E\u0902\u0921\u0940 \u0928\u093F\u0935\u0921\u093E",
    "No matching mandi records.": "\u091C\u0941\u0933\u0923\u093E\u0931\u094D\u092F\u093E \u092E\u0902\u0921\u0940 \u0928\u094B\u0902\u0926\u0940 \u0906\u0922\u0933\u0932\u094D\u092F\u093E \u0928\u093E\u0939\u0940\u0924.",
    "Plan with your field in mind": "\u0936\u0947\u0924\u093E\u091A\u093E \u0935\u093F\u091A\u093E\u0930 \u0915\u0930\u0942\u0928 \u0928\u093F\u092F\u094B\u091C\u0928 \u0915\u0930\u093E",
    "Estimate inputs, check the forecast, and keep practical field notes together.": "\u0928\u093F\u0935\u093F\u0937\u094D\u0920\u093E\u0902\u091A\u093E \u0905\u0902\u0926\u093E\u091C \u0918\u094D\u092F\u093E, \u0939\u0935\u093E\u092E\u093E\u0928 \u0924\u092A\u093E\u0938\u093E \u0906\u0923\u093F \u0936\u0947\u0924\u093E\u091A\u094D\u092F\u093E \u0928\u094B\u0902\u0926\u0940 \u090F\u0915\u0924\u094D\u0930 \u0920\u0947\u0935\u093E.",
    "Field input calculator": "\u0936\u0947\u0924 \u0928\u093F\u0935\u093F\u0937\u094D\u0920\u093E \u0915\u0945\u0932\u094D\u0915\u094D\u092F\u0941\u0932\u0947\u091F\u0930",
    "Estimate amounts from your own per-acre recommendation.": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u092A\u094D\u0930\u0924\u093F \u090F\u0915\u0930 \u0936\u093F\u092B\u093E\u0930\u0938\u0940\u0928\u0941\u0938\u093E\u0930 \u092A\u094D\u0930\u092E\u093E\u0923\u093E\u091A\u093E \u0905\u0902\u0926\u093E\u091C \u0918\u094D\u092F\u093E.",
    "Farm area": "\u0936\u0947\u0924\u093E\u091A\u0947 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0933",
    "acres": "\u090F\u0915\u0930",
    "acre": "\u090F\u0915\u0930",
    "Fertilizer recommendation per acre (kg)": "\u092A\u094D\u0930\u0924\u093F \u090F\u0915\u0930 \u0916\u0924\u093E\u091A\u0940 \u0936\u093F\u092B\u093E\u0930\u0938 (\u0915\u093F\u0932\u094B)",
    "Reduce fertilizer rate": "\u0916\u0924\u093E\u091A\u0947 \u092A\u094D\u0930\u092E\u093E\u0923 \u0915\u092E\u0940 \u0915\u0930\u093E",
    "Increase fertilizer rate": "\u0916\u0924\u093E\u091A\u0947 \u092A\u094D\u0930\u092E\u093E\u0923 \u0935\u093E\u0922\u0935\u093E",
    "Input type": "\u0928\u093F\u0935\u093F\u0937\u094D\u0920\u0947\u091A\u093E \u092A\u094D\u0930\u0915\u093E\u0930",
    "NPK fertilizer": "\u090F\u0928\u092A\u0940\u0915\u0947 \u0916\u0924",
    "Compost / organic manure": "\u0915\u0902\u092A\u094B\u0938\u094D\u091F / \u0938\u0947\u0902\u0926\u094D\u0930\u093F\u092F \u0916\u0924",
    "Seed quantity": "\u092C\u093F\u092F\u093E\u0923\u094D\u092F\u093E\u0902\u091A\u0947 \u092A\u094D\u0930\u092E\u093E\u0923",
    "Estimated quantity for your farm": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u093E\u0938\u093E\u0920\u0940 \u0905\u0902\u0926\u093E\u091C\u093F\u0924 \u092A\u094D\u0930\u092E\u093E\u0923",
    "Based on": "\u0906\u0927\u093E\u0930\u093F\u0924",
    "kg / acre": "\u0915\u093F\u0932\u094B / \u090F\u0915\u0930",
    "Use the rate recommended for your crop and soil test. This calculator estimates total quantity only; it does not replace agronomic advice.": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u092A\u0940\u0915 \u0906\u0923\u093F \u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923\u093E\u0928\u0941\u0938\u093E\u0930 \u0936\u093F\u092B\u093E\u0930\u0938 \u0915\u0947\u0932\u0947\u0932\u0947 \u092A\u094D\u0930\u092E\u093E\u0923 \u0935\u093E\u092A\u0930\u093E. \u0939\u0947 \u0938\u093E\u0927\u0928 \u092B\u0915\u094D\u0924 \u090F\u0915\u0942\u0923 \u092A\u094D\u0930\u092E\u093E\u0923 \u092E\u094B\u091C\u0924\u0947; \u0915\u0943\u0937\u0940 \u0924\u091C\u094D\u091C\u094D\u091E\u093E\u0902\u091A\u094D\u092F\u093E \u0938\u0932\u094D\u0932\u094D\u092F\u093E\u091A\u093E \u092A\u0930\u094D\u092F\u093E\u092F \u0928\u093E\u0939\u0940.",
    "Plan around the forecast": "\u0939\u0935\u093E\u092E\u093E\u0928\u093E\u0928\u0941\u0938\u093E\u0930 \u0928\u093F\u092F\u094B\u091C\u0928 \u0915\u0930\u093E",
    "A few simple reminders for your fields.": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u093E\u0938\u093E\u0920\u0940 \u0915\u093E\u0939\u0940 \u0938\u094B\u092A\u094D\u092F\u093E \u0938\u0942\u091A\u0928\u093E.",
    "Check rain before spraying": "\u092B\u0935\u093E\u0930\u0923\u0940\u092A\u0942\u0930\u094D\u0935\u0940 \u092A\u093E\u090A\u0938 \u0924\u092A\u093E\u0938\u093E",
    "Rain can wash treatments off leaves. Follow the product label.": "\u092A\u093E\u0935\u0938\u093E\u092E\u0941\u0933\u0947 \u092A\u093E\u0928\u093E\u0902\u0935\u0930\u0940\u0932 \u0914\u0937\u0927 \u0927\u0941\u090A\u0928 \u091C\u093E\u090A \u0936\u0915\u0924\u0947. \u0909\u0924\u094D\u092A\u093E\u0926\u0928\u093E\u0935\u0930\u0940\u0932 \u0938\u0942\u091A\u0928\u093E \u092A\u093E\u0933\u093E.",
    "Check soil moisture": "\u091C\u092E\u093F\u0928\u0940\u0924\u0940\u0932 \u0913\u0932\u093E\u0935\u093E \u0924\u092A\u093E\u0938\u093E",
    "Avoid watering if the soil is still moist below the surface.": "\u092A\u0943\u0937\u094D\u0920\u092D\u093E\u0917\u093E\u0916\u093E\u0932\u0940 \u092E\u093E\u0924\u0940 \u0913\u0932\u0938\u0930 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u092A\u093E\u0923\u0940 \u0926\u0947\u0923\u0947 \u091F\u093E\u0933\u093E.",
    "Keep a field record": "\u0936\u0947\u0924\u093E\u091A\u0940 \u0928\u094B\u0902\u0926 \u0920\u0947\u0935\u093E",
    "Note what you used and when to plan your next crop cycle.": "\u092A\u0941\u0922\u0940\u0932 \u092A\u0940\u0915 \u091A\u0915\u094D\u0930\u093E\u091A\u0947 \u0928\u093F\u092F\u094B\u091C\u0928 \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0935\u093E\u092A\u0930\u0932\u0947\u0932\u0940 \u0938\u093E\u092E\u0917\u094D\u0930\u0940 \u0906\u0923\u093F \u0924\u093E\u0930\u0940\u0916 \u0928\u094B\u0902\u0926\u0935\u093E.",
    "Field efficiency checklist": "\u0936\u0947\u0924\u0940 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0937\u092E\u0924\u093E \u0924\u092A\u093E\u0938\u0923\u0940\u0938\u0942\u091A\u0940",
    "A practical starting point, not a farm score.": "\u0915\u093E\u092E \u0938\u0941\u0930\u0942 \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0909\u092A\u092F\u0941\u0915\u094D\u0924 \u0938\u0942\u091A\u0940, \u0936\u0947\u0924\u0940\u091A\u093E \u0917\u0941\u0923 \u0928\u093E\u0939\u0940.",
    "Soil test completed for this season": "\u092F\u093E \u0939\u0902\u0917\u093E\u092E\u093E\u0938\u093E\u0920\u0940 \u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u092A\u0942\u0930\u094D\u0923",
    "Irrigation checked against rainfall": "\u092A\u093E\u0935\u0938\u093E\u091A\u094D\u092F\u093E \u0905\u0902\u0926\u093E\u091C\u093E\u0928\u0941\u0938\u093E\u0930 \u0938\u093F\u0902\u091A\u0928 \u0924\u092A\u093E\u0938\u0932\u0947",
    "Input amounts recorded by field": "\u0936\u0947\u0924\u093E\u0928\u0941\u0938\u093E\u0930 \u0928\u093F\u0935\u093F\u0937\u094D\u0920\u093E\u0902\u091A\u0947 \u092A\u094D\u0930\u092E\u093E\u0923 \u0928\u094B\u0902\u0926\u0935\u0932\u0947",
    "Crop rotation planned after harvest": "\u0915\u093E\u092A\u0923\u0940\u0928\u0902\u0924\u0930 \u092A\u0940\u0915 \u092B\u0947\u0930\u092A\u093E\u0932\u091F\u093E\u091A\u0947 \u0928\u093F\u092F\u094B\u091C\u0928",
    "For your next growing season": "\u092A\u0941\u0922\u0940\u0932 \u0939\u0902\u0917\u093E\u092E\u093E\u0938\u093E\u0920\u0940",
    "Farm essentials": "\u0936\u0947\u0924\u0940\u0938\u093E\u0920\u0940 \u0906\u0935\u0936\u094D\u092F\u0915 \u0935\u0938\u094D\u0924\u0942",
    "Browse a small demo catalog of common farm supplies.": "\u0936\u0947\u0924\u0940\u091A\u094D\u092F\u093E \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0935\u0938\u094D\u0924\u0942\u0902\u091A\u0940 \u091B\u094B\u091F\u0940 \u0921\u0947\u092E\u094B \u0938\u0942\u091A\u0940 \u092A\u0939\u093E.",
    "Certified wheat seeds": "\u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0917\u0935\u094D\u0939\u093E\u091A\u0947 \u092C\u093F\u092F\u093E\u0923\u0947",
    "Neem-based bio-fertilizer": "\u0915\u0921\u0941\u0928\u093F\u0902\u092C\u093E\u0935\u0930 \u0906\u0927\u093E\u0930\u093F\u0924 \u091C\u0948\u0935\u0916\u0924",
    "Drip irrigation starter kit": "\u0920\u093F\u092C\u0915 \u0938\u093F\u0902\u091A\u0928 \u092A\u094D\u0930\u093E\u0930\u0902\u092D\u093F\u0915 \u0938\u0902\u091A",
    "Popular": "\u0932\u094B\u0915\u092A\u094D\u0930\u093F\u092F",
    "Organic": "\u0938\u0947\u0902\u0926\u094D\u0930\u093F\u092F",
    "Save 12%": "12% \u092C\u091A\u0924",
    "Add to basket": "\u091F\u094B\u092A\u0932\u0940\u0924 \u091C\u094B\u0921\u093E",
    "Community buying is coming soon": "\u0938\u093E\u092E\u0942\u0939\u093F\u0915 \u0916\u0930\u0947\u0926\u0940 \u0932\u0935\u0915\u0930\u091A \u092F\u0947\u0924 \u0906\u0939\u0947",
    "Group orders and local supplier listings will be available here.": "\u0917\u091F \u0911\u0930\u094D\u0921\u0930 \u0906\u0923\u093F \u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u092A\u0941\u0930\u0935\u0920\u093E\u0926\u093E\u0930\u093E\u0902\u091A\u0940 \u092F\u093E\u0926\u0940 \u092F\u0947\u0925\u0947 \u0909\u092A\u0932\u092C\u094D\u0927 \u0939\u094B\u0908\u0932.",
    "Your farm details": "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0936\u0947\u0924\u0940\u091A\u0940 \u092E\u093E\u0939\u093F\u0924\u0940",
    "Choose your state, district and village to get local weather.": "\u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u0939\u0935\u093E\u092E\u093E\u0928\u093E\u0938\u093E\u0920\u0940 \u0930\u093E\u091C\u094D\u092F, \u091C\u093F\u0932\u094D\u0939\u093E \u0906\u0923\u093F \u0917\u093E\u0935 \u0928\u093F\u0935\u0921\u093E.",
    "Your name": "\u0924\u0941\u092E\u091A\u0947 \u0928\u093E\u0935",
    "State / union territory": "\u0930\u093E\u091C\u094D\u092F / \u0915\u0947\u0902\u0926\u094D\u0930\u0936\u093E\u0938\u093F\u0924 \u092A\u094D\u0930\u0926\u0947\u0936",
    "Type a district or nearby town": "\u091C\u093F\u0932\u094D\u0939\u093E \u0915\u093F\u0902\u0935\u093E \u091C\u0935\u0933\u091A\u0947 \u0936\u0939\u0930 \u091F\u093E\u0907\u092A \u0915\u0930\u093E",
    "Searching districts...": "\u091C\u093F\u0932\u094D\u0939\u0947 \u0936\u094B\u0927\u0924 \u0906\u0939\u0947...",
    "near": "\u091C\u0935\u0933",
    "Selected district:": "\u0928\u093F\u0935\u0921\u0932\u0947\u0932\u093E \u091C\u093F\u0932\u094D\u0939\u093E:",
    "Village / town": "\u0917\u093E\u0935 / \u0936\u0939\u0930",
    "(optional)": "(\u0910\u091A\u094D\u091B\u093F\u0915)",
    "Type your village or town": "\u0924\u0941\u092E\u091A\u0947 \u0917\u093E\u0935 \u0915\u093F\u0902\u0935\u093E \u0936\u0939\u0930 \u091F\u093E\u0907\u092A \u0915\u0930\u093E",
    "Searching villages and towns...": "\u0917\u093E\u0935\u0947 \u0906\u0923\u093F \u0936\u0939\u0930\u0947 \u0936\u094B\u0927\u0924 \u0906\u0939\u0947...",
    "Select a district first": "\u092A\u094D\u0930\u0925\u092E \u091C\u093F\u0932\u094D\u0939\u093E \u0928\u093F\u0935\u0921\u093E",
    "Weather coordinates selected for": "\u0939\u0935\u093E\u092E\u093E\u0928\u093E\u0938\u093E\u0920\u0940 \u0920\u093F\u0915\u093E\u0923 \u0928\u093F\u0935\u0921\u0932\u0947:",
    "Farm size (acres)": "\u0936\u0947\u0924\u093E\u091A\u093E \u0906\u0915\u093E\u0930 (\u090F\u0915\u0930)",
    "Save my farm": "\u092E\u093E\u091D\u094D\u092F\u093E \u0936\u0947\u0924\u0940\u091A\u0940 \u092E\u093E\u0939\u093F\u0924\u0940 \u091C\u0924\u0928 \u0915\u0930\u093E",
    "Locations are searched from a global geocoding directory. You can update these details anytime.": "\u0920\u093F\u0915\u093E\u0923\u0947 \u091C\u093E\u0917\u0924\u093F\u0915 \u091C\u093F\u0913\u0915\u094B\u0921\u093F\u0902\u0917 \u0928\u093F\u0930\u094D\u0926\u0947\u0936\u093F\u0915\u0947\u0924\u0942\u0928 \u0936\u094B\u0927\u0932\u0940 \u091C\u093E\u0924\u093E\u0924. \u0939\u0940 \u092E\u093E\u0939\u093F\u0924\u0940 \u0915\u0927\u0940\u0939\u0940 \u092C\u0926\u0932\u0942 \u0936\u0915\u0924\u093E.",
    "Click or drop to change": "\u092C\u0926\u0932\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0915\u094D\u0932\u093F\u0915 \u0915\u0930\u093E \u0915\u093F\u0902\u0935\u093E \u092B\u094B\u091F\u094B \u091F\u093E\u0915\u093E",
    "Close-up of healthy green crop leaves": "\u0928\u093F\u0930\u094B\u0917\u0940 \u0939\u093F\u0930\u0935\u094D\u092F\u093E \u092A\u093F\u0915\u093E\u091A\u094D\u092F\u093E \u092A\u093E\u0928\u093E\u0902\u091A\u0947 \u091C\u0935\u0933\u091A\u0947 \u0926\u0943\u0936\u094D\u092F",
    "Selected crop leaf preview": "\u0928\u093F\u0935\u0921\u0932\u0947\u0932\u094D\u092F\u093E \u092A\u093F\u0915\u093E\u091A\u094D\u092F\u093E \u092A\u093E\u0928\u093E\u091A\u0947 \u092A\u0942\u0930\u094D\u0935\u093E\u0935\u0932\u094B\u0915\u0928",
    "Gemini AI screening": "Gemini \u090F\u0906\u092F \u092A\u0930\u0940\u0915\u094D\u0937\u0923",
    "Crop image submitted for screening": "\u0924\u092A\u093E\u0938\u0923\u0940\u0938\u093E\u0920\u0940 \u092A\u093E\u0920\u0935\u0932\u0947\u0932\u093E \u092A\u093F\u0915\u093E\u091A\u093E \u092B\u094B\u091F\u094B",
    "Soil testing and lab services": "\u092E\u093E\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0906\u0923\u093F \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E \u0938\u0947\u0935\u093E",
    "10-digit mobile number": "10 \u0905\u0902\u0915\u0940 \u092E\u094B\u092C\u093E\u0907\u0932 \u0915\u094D\u0930\u092E\u093E\u0902\u0915",
    "Refresh nearby labs": "\u091C\u0935\u0933\u091A\u094D\u092F\u093E \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E \u0930\u0940\u092B\u094D\u0930\u0947\u0936 \u0915\u0930\u093E",
    "Map listings may be incomplete. Search a wider area or check the map for local government and university labs.": "\u0928\u0915\u093E\u0936\u093E\u0935\u0930\u0940\u0932 \u092F\u093E\u0926\u0940 \u0905\u092A\u0942\u0930\u094D\u0923 \u0905\u0938\u0942 \u0936\u0915\u0924\u0947. \u092E\u094B\u0920\u094D\u092F\u093E \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u093E\u0924 \u0936\u094B\u0927\u093E \u0915\u093F\u0902\u0935\u093E \u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u0938\u0930\u0915\u093E\u0930\u0940 \u0906\u0923\u093F \u0935\u093F\u0926\u094D\u092F\u093E\u092A\u0940\u0920 \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E \u0928\u0915\u093E\u0936\u093E\u0935\u0930 \u0924\u092A\u093E\u0938\u093E.",
    "Expanded sample data": "\u0935\u093F\u0938\u094D\u0924\u093E\u0930\u093F\u0924 \u0928\u092E\u0941\u0928\u093E \u092E\u093E\u0939\u093F\u0924\u0940",
    "Data.gov.in live": "Data.gov.in \u0925\u0947\u091F",
    "results": "\u0928\u093F\u0915\u093E\u0932",
    "Mandi rates across India": "\u092D\u093E\u0930\u0924\u092D\u0930\u093E\u0924\u0940\u0932 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935",
    "records": "\u0928\u094B\u0902\u0926\u0940",
    "These are sample prices for demonstration, not live mandi quotes. Add Data.gov.in API credentials to see official records. The sample directory covers 16 crops across 18 markets and states.": "\u0939\u0947 \u092A\u094D\u0930\u093E\u0924\u094D\u092F\u0915\u094D\u0937\u093F\u0915\u093E\u0938\u093E\u0920\u0940 \u0928\u092E\u0941\u0928\u093E \u092D\u093E\u0935 \u0906\u0939\u0947\u0924, \u0925\u0947\u091F \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u0928\u093E\u0939\u0940\u0924. \u0905\u0927\u093F\u0915\u0943\u0924 \u0928\u094B\u0902\u0926\u0940 \u092A\u093E\u0939\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 Data.gov.in API \u0915\u094D\u0930\u0947\u0921\u0947\u0928\u094D\u0936\u093F\u092F\u0932\u094D\u0938 \u091C\u094B\u0921\u093E. \u0928\u092E\u0941\u0928\u093E \u092F\u093E\u0926\u0940\u0924 18 \u092C\u093E\u091C\u093E\u0930 \u0906\u0923\u093F \u0930\u093E\u091C\u094D\u092F\u093E\u0902\u0924\u0940\u0932 16 \u092A\u093F\u0915\u0947 \u0906\u0939\u0947\u0924.",
    "Crop & variety": "\u092A\u0940\u0915 \u0906\u0923\u093F \u091C\u093E\u0924",
    "Change": "\u092C\u0926\u0932",
    "Loading mandi rates...": "\u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u0932\u094B\u0921 \u0939\u094B\u0924 \u0906\u0939\u0947\u0924...",
    "No mandi records match these filters. Try clearing a filter or selecting another crop.": "\u092F\u093E \u092B\u093F\u0932\u094D\u091F\u0930\u0936\u0940 \u091C\u0941\u0933\u0923\u093E\u0931\u094D\u092F\u093E \u092E\u0902\u0921\u0940 \u0928\u094B\u0902\u0926\u0940 \u0928\u093E\u0939\u0940\u0924. \u092B\u093F\u0932\u094D\u091F\u0930 \u0915\u093E\u0922\u093E \u0915\u093F\u0902\u0935\u093E \u0926\u0941\u0938\u0930\u0947 \u092A\u0940\u0915 \u0928\u093F\u0935\u0921\u093E.",
    "Page": "\u092A\u0943\u0937\u094D\u0920",
    "of": "\u092A\u0948\u0915\u0940",
    "Previous": "\u092E\u093E\u0917\u0940\u0932",
    "Next": "\u092A\u0941\u0922\u0940\u0932",
    "Select a state to narrow the crop, district, and mandi options.": "\u092A\u0940\u0915, \u091C\u093F\u0932\u094D\u0939\u093E \u0906\u0923\u093F \u092E\u0902\u0921\u0940\u091A\u0947 \u092A\u0930\u094D\u092F\u093E\u092F \u092E\u0930\u094D\u092F\u093E\u0926\u093F\u0924 \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0930\u093E\u091C\u094D\u092F \u0928\u093F\u0935\u0921\u093E.",
    "Crop and district options for {state}; mandis follow the selected district.": "{state} \u0938\u093E\u0920\u0940 \u092A\u0940\u0915 \u0906\u0923\u093F \u091C\u093F\u0932\u094D\u0939\u093E \u092A\u0930\u094D\u092F\u093E\u092F; \u092E\u0902\u0921\u094D\u092F\u093E \u0928\u093F\u0935\u0921\u0932\u0947\u0932\u094D\u092F\u093E \u091C\u093F\u0932\u094D\u0939\u094D\u092F\u093E\u0928\u0941\u0938\u093E\u0930 \u0906\u0939\u0947\u0924.",
    "9:00 am \u2013 11:00 am": "\u0938\u0915\u093E\u0933\u0940 9:00 \u2013 11:00",
    "11:00 am \u2013 1:00 pm": "\u0938\u0915\u093E\u0933\u0940 11:00 \u2013 \u0926\u0941\u092A\u093E\u0930\u0940 1:00",
    "2:00 pm \u2013 4:00 pm": "\u0926\u0941\u092A\u093E\u0930\u0940 2:00 \u2013 4:00",
    "e.g. Ravi Patil": "\u0909\u0926\u093E. \u0930\u0935\u0940 \u092A\u093E\u091F\u0940\u0932",
    "For up to 1 acre": "1 \u090F\u0915\u0930\u092A\u0930\u094D\u092F\u0902\u0924",
    "HD 2967 \xB7 40 kg bag": "HD 2967 \xB7 40 \u0915\u093F\u0932\u094B\u091A\u0940 \u092A\u093F\u0936\u0935\u0940",
    "Organic \xB7 5 litre pack": "\u0938\u0947\u0902\u0926\u094D\u0930\u093F\u092F \xB7 5 \u0932\u093F\u091F\u0930 \u092A\u0945\u0915",
    kg: "\u0915\u093F\u0932\u094B",
    "per acre": "\u092A\u094D\u0930\u0924\u093F \u090F\u0915\u0930",
    "Market outlook": "\u092C\u093E\u091C\u093E\u0930\u093E\u091A\u093E \u0915\u0932",
    "WATCH THE MARKET": "\u092C\u093E\u091C\u093E\u0930\u093E\u0935\u0930 \u0932\u0915\u094D\u0937 \u0920\u0947\u0935\u093E",
    "{crop} prices are up recently in {market}. Compare nearby markets and storage costs before deciding when to sell.": "{market} \u092F\u0947\u0925\u0947 \u0905\u0932\u0940\u0915\u0921\u0947 {crop} \u091A\u0947 \u092D\u093E\u0935 \u0935\u093E\u0922\u0932\u0947 \u0906\u0939\u0947\u0924. \u0935\u093F\u0915\u094D\u0930\u0940\u091A\u0940 \u0935\u0947\u0933 \u0920\u0930\u0935\u0923\u094D\u092F\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u091C\u0935\u0933\u091A\u0947 \u092C\u093E\u091C\u093E\u0930 \u0906\u0923\u093F \u0938\u093E\u0920\u0935\u0923 \u0916\u0930\u094D\u091A \u0924\u092A\u093E\u0938\u093E.",
    "{crop} prices are moving gradually. Check arrivals and local prices again before making a sale decision.": "{crop} \u091A\u0947 \u092D\u093E\u0935 \u0939\u0933\u0942\u0939\u0933\u0942 \u092C\u0926\u0932\u0924 \u0906\u0939\u0947\u0924. \u0935\u093F\u0915\u094D\u0930\u0940\u091A\u093E \u0928\u093F\u0930\u094D\u0923\u092F \u0918\u0947\u0923\u094D\u092F\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u0906\u0935\u0915 \u0906\u0923\u093F \u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u092D\u093E\u0935 \u092A\u0941\u0928\u094D\u0939\u093E \u0924\u092A\u093E\u0938\u093E.",
    "This is a simple trend summary, not a guaranteed forecast. Prices can change quickly and vary by quality and market.": "\u0939\u093E \u092B\u0915\u094D\u0924 \u0915\u0932\u093E\u091A\u093E \u0938\u093E\u0930\u093E\u0902\u0936 \u0906\u0939\u0947, \u0916\u093E\u0924\u094D\u0930\u0940\u0936\u0940\u0930 \u0905\u0902\u0926\u093E\u091C \u0928\u093E\u0939\u0940. \u092D\u093E\u0935 \u0932\u0935\u0915\u0930 \u092C\u0926\u0932\u0942 \u0936\u0915\u0924\u093E\u0924 \u0906\u0923\u093F \u0917\u0941\u0923\u0935\u0924\u094D\u0924\u093E \u0935 \u092C\u093E\u091C\u093E\u0930\u093E\u0928\u0941\u0938\u093E\u0930 \u0935\u0947\u0917\u0933\u0947 \u0905\u0938\u0942 \u0936\u0915\u0924\u093E\u0924.",
    "Showing": "\u0926\u093E\u0916\u0935\u0924 \u0906\u0939\u0947",
    "Voice input isn't available in this browser. You can type your question instead.": "\u092F\u093E \u092C\u094D\u0930\u093E\u0909\u091D\u0930\u092E\u0927\u094D\u092F\u0947 \u0906\u0935\u093E\u091C\u093E\u0926\u094D\u0935\u093E\u0930\u0947 \u092A\u094D\u0930\u0936\u094D\u0928 \u0935\u093F\u091A\u093E\u0930\u0924\u093E \u092F\u0947\u0924 \u0928\u093E\u0939\u0940. \u0924\u0941\u092E\u094D\u0939\u0940 \u092A\u094D\u0930\u0936\u094D\u0928 \u091F\u093E\u0907\u092A \u0915\u0930\u0942 \u0936\u0915\u0924\u093E.",
    "I couldn't hear that clearly. Please try again.": "\u0924\u0941\u092E\u091A\u093E \u0906\u0935\u093E\u091C \u0938\u094D\u092A\u0937\u094D\u091F \u0910\u0915\u0942 \u0906\u0932\u093E \u0928\u093E\u0939\u0940. \u0915\u0943\u092A\u092F\u093E \u092A\u0941\u0928\u094D\u0939\u093E \u092A\u094D\u0930\u092F\u0924\u094D\u0928 \u0915\u0930\u093E."
  }
};
const crops = ["Wheat", "Rice", "Cotton", "Tomato", "Potato", "Onion"];
const money = (value) => `\u20B9${Math.round(value).toLocaleString("en-IN")}`;
const marketKey = (record) => [record.crop, record.variety, record.market, record.state, record.district ?? "", record.recordedAt ?? ""].join("|").toLowerCase();
const matchesPriceAlert = (alert, record) => alert.crop.trim().toLowerCase() === record.crop.trim().toLowerCase() && alert.variety.trim().toLowerCase() === record.variety.trim().toLowerCase() && alert.market.trim().toLowerCase() === record.market.trim().toLowerCase() && alert.state.trim().toLowerCase() === record.state.trim().toLowerCase() && alert.district.trim().toLowerCase() === (record.district ?? "").trim().toLowerCase();
function WeatherIcon({ kind, size = 20 }) {
  if (kind === "rain") return /* @__PURE__ */ jsx(CloudRain, { size });
  if (kind === "cloud") return /* @__PURE__ */ jsx(Cloud, { size });
  return /* @__PURE__ */ jsx(Sun, { size });
}
function CropPhoto({ guide }) {
  const [failed, setFailed] = useState(false);
  return /* @__PURE__ */ jsx("div", { className: "crop-photo h-40 overflow-hidden bg-[#EAF2E6]", children: failed ? /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-2 text-[#3F8554]", role: "img", "aria-label": guide.imageAlt, children: [
    /* @__PURE__ */ jsx(Sprout, { size: 30 }),
    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: guide.crop })
  ] }) : /* @__PURE__ */ jsx(
    "img",
    {
      src: guide.image,
      alt: guide.imageAlt,
      loading: "lazy",
      onError: () => setFailed(true)
    }
  ) });
}
function SectionPhoto({
  src,
  alt,
  className,
  imageClassName,
  fallback
}) {
  const [failed, setFailed] = useState(false);
  return /* @__PURE__ */ jsx("div", { className, children: failed ? /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-[#EAF2E6]", children: fallback }) : /* @__PURE__ */ jsx(
    "img",
    {
      src,
      alt,
      loading: "lazy",
      onError: () => setFailed(true),
      className: imageClassName ?? "h-full w-full object-cover"
    }
  ) });
}
function DashboardClient({ account, onSignedOut }) {
  const navigate = useNavigate();
  const profileStorageKey = `kisan-care-profile:${encodeURIComponent(account.email.toLowerCase())}`;
  const savedFarmProfile = account.farmProfile;
  const initialDistrict = savedFarmProfile?.district || "Nashik";
  const initialState = savedFarmProfile?.state && indianStates.includes(savedFarmProfile.state) ? savedFarmProfile.state : "Maharashtra";
  const [tab, setTab] = useState("dashboard");
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [marketRecords, setMarketRecords] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [priceAlertsLoading, setPriceAlertsLoading] = useState(false);
  const [priceAlertSaving, setPriceAlertSaving] = useState(false);
  const [priceAlertDeletingId, setPriceAlertDeletingId] = useState("");
  const [priceAlertError, setPriceAlertError] = useState("");
  const [priceAlertDirection, setPriceAlertDirection] = useState("ABOVE");
  const [priceAlertTarget, setPriceAlertTarget] = useState("");
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
  const [marketTrend, setMarketTrend] = useState([]);
  const [marketTrendLoading, setMarketTrendLoading] = useState(false);
  const [marketOptions, setMarketOptions] = useState({
    states: [],
    crops: [],
    districts: [],
    mandis: []
  });
  const [marketOptionsLoading, setMarketOptionsLoading] = useState(false);
  const [marketOptionsError, setMarketOptionsError] = useState("");
  const [farmerName, setFarmerName] = useState(account.name);
  const [farmSize, setFarmSize] = useState(savedFarmProfile?.acreage ?? 4);
  const [farmLocation, setFarmLocation] = useState(savedFarmProfile?.location || "Nashik, Maharashtra");
  const [farmCoordinates, setFarmCoordinates] = useState({ lat: 19.99727, lon: 73.79096 });
  const [primaryCrop, setPrimaryCrop] = useState(savedFarmProfile?.primaryCrops[0] || "Onion");
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [diaryLoading, setDiaryLoading] = useState(false);
  const [diarySaving, setDiarySaving] = useState(false);
  const [diaryError, setDiaryError] = useState("");
  const [diaryForm, setDiaryForm] = useState({ crop: savedFarmProfile?.primaryCrops[0] || "Onion", activity: "Sowing", date: "", notes: "" });
  const [reminders, setReminders] = useState([]);
  const [remindersLoading, setRemindersLoading] = useState(false);
  const [reminderSaving, setReminderSaving] = useState(false);
  const [reminderActionId, setReminderActionId] = useState("");
  const [reminderError, setReminderError] = useState("");
  const [reminderForm, setReminderForm] = useState({ title: "", crop: savedFarmProfile?.primaryCrops[0] || "Onion", dueDate: "" });
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("light");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardName, setOnboardName] = useState(account.name);
  const [onboardSize, setOnboardSize] = useState("4");
  const [onboardCrop, setOnboardCrop] = useState("Wheat");
  const [onboardState, setOnboardState] = useState(initialState);
  const [districtInput, setDistrictInput] = useState(initialDistrict);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedDistrictPlace, setSelectedDistrictPlace] = useState({
    name: initialDistrict,
    district: initialDistrict,
    state: initialState,
    latitude: 19.99727,
    longitude: 73.79096
  });
  const [districtResults, setDistrictResults] = useState([]);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [villageInput, setVillageInput] = useState(initialDistrict);
  const [selectedVillage, setSelectedVillage] = useState({
    name: initialDistrict,
    district: initialDistrict,
    state: initialState,
    latitude: 19.99727,
    longitude: 73.79096
  });
  const [villageResults, setVillageResults] = useState([]);
  const [villageLoading, setVillageLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechPaused, setSpeechPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const [imageData, setImageData] = useState("");
  const [imageName, setImageName] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [diagnosisError, setDiagnosisError] = useState("");
  const [diagnosing, setDiagnosing] = useState(false);
  const diagnosisRequestId = useRef(0);
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [diagnosisHistoryLoading, setDiagnosisHistoryLoading] = useState(false);
  const [diagnosisHistoryError, setDiagnosisHistoryError] = useState("");
  const [booking, setBooking] = useState({ name: account.name, phone: account.phone, crop: "Wheat", visitType: "lab", date: "", slot: "09:00-11:00", lab: "" });
  const [bookingToken, setBookingToken] = useState("");
  const [bookingPersisted, setBookingPersisted] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [nearbyLabs, setNearbyLabs] = useState([]);
  const [labsLoading, setLabsLoading] = useState(false);
  const [labsError, setLabsError] = useState("");
  const [labRadius, setLabRadius] = useState(25e3);
  const [acres, setAcres] = useState(4);
  const [fertilizerRate, setFertilizerRate] = useState(45);
  const [cartCount, setCartCount] = useState(0);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [uploadFocused, setUploadFocused] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Namaste! I'm your farm assistant. Ask me about crops, weather, or growing practices." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const fileRef = useRef(null);
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
    const welcome = language === "Hindi" ? "\u0928\u092E\u0938\u094D\u0924\u0947! \u092E\u0948\u0902 \u0906\u092A\u0915\u093E \u0915\u0943\u0937\u093F \u0938\u0939\u093E\u092F\u0915 \u0939\u0942\u0901\u0964 \u092B\u0938\u0932, \u092E\u094C\u0938\u092E \u092F\u093E \u0916\u0947\u0924\u0940 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092A\u0942\u091B\u0947\u0902\u0964" : language === "Marathi" ? "\u0928\u092E\u0938\u094D\u0915\u093E\u0930! \u092E\u0940 \u0924\u0941\u092E\u091A\u093E \u0936\u0947\u0924\u0940 \u0938\u0939\u093E\u092F\u094D\u092F\u0915 \u0906\u0939\u0947. \u092A\u093F\u0915\u0947, \u0939\u0935\u093E\u092E\u093E\u0928 \u0915\u093F\u0902\u0935\u093E \u0936\u0947\u0924\u0940\u0935\u093F\u0937\u092F\u0940 \u0935\u093F\u091A\u093E\u0930\u093E." : "Namaste! I'm your farm assistant. Ask me about crops, weather, or growing practices.";
    setChatMessages(
      (messages) => messages.length === 1 && messages[0].role === "assistant" ? [{ role: "assistant", text: welcome }] : messages
    );
  }, [language]);
  useEffect(() => {
    let savedCoordinates;
    try {
      let stored = window.localStorage.getItem(profileStorageKey);
      if (!stored) {
        const legacyProfile = window.localStorage.getItem("kisan-care-profile");
        if (legacyProfile) {
          window.localStorage.setItem(profileStorageKey, legacyProfile);
          window.localStorage.removeItem("kisan-care-profile");
          stored = legacyProfile;
        }
      }
      if (stored) {
        const profile = JSON.parse(stored);
        if (profile.name) setFarmerName(profile.name);
        if (profile.acres) setFarmSize(profile.acres);
        if (profile.location) setFarmLocation(profile.location);
        if (profile.crop) setPrimaryCrop(profile.crop);
        if (profile.state && indianStates.includes(profile.state)) {
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
      } else if (!savedFarmProfile) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Farmer profile could not be loaded:", error);
    }
    if ("serviceWorker" in navigator) {
      if (false) {
        navigator.serviceWorker.register("/sw.js").catch((error) => {
          console.error("Offline support could not be registered:", error);
        });
      } else {
        navigator.serviceWorker.getRegistrations().then(
          (registrations) => Promise.all(registrations.map((registration) => registration.unregister()))
        ).catch((error) => {
          console.error("Development service worker could not be removed:", error);
        });
        caches.delete("kisan-care-shell-v1").catch((error) => {
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
        if (active) setDistrictResults(result.results);
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
        if (active) setVillageResults(result.results);
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
  async function loadWeather(coords) {
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
      setWeather(result);
      window.localStorage.setItem("kisan-care-weather", JSON.stringify(result));
    } catch (error) {
      const savedWeather = window.localStorage.getItem("kisan-care-weather");
      if (savedWeather) {
        try {
          setWeather(JSON.parse(savedWeather));
          setWeatherError("Live weather is unavailable; showing your last saved forecast.");
          return;
        } catch (storageError) {
          console.error("Saved weather could not be loaded:", storageError);
        }
      }
      setWeatherError(error instanceof Error ? error.message : "Weather information could not be loaded.");
    }
  }
  async function loadMarkets(filters = {}) {
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
      setMarketRecords(result.records);
      setMarketSource(result.source);
      setMarketTotal(result.total);
      const records = result.records;
      setMarketFocus(
        (current) => records.some((record) => marketKey(record) === current) ? current : records[0] ? marketKey(records[0]) : ""
      );
    } catch (error) {
      if (filters.signal?.aborted) return;
      setMarketError(error instanceof Error ? error.message : "Market prices could not be loaded.");
    } finally {
      if (!filters.signal?.aborted) setMarketLoading(false);
    }
  }
  async function loadPriceAlerts(signal) {
    setPriceAlertsLoading(true);
    setPriceAlertError("");
    try {
      const response = await fetch("/api/mandi/alerts", { signal });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Price alerts could not be loaded.");
      if (!Array.isArray(result.alerts)) throw new Error("The price alert response was invalid.");
      if (!signal?.aborted) setPriceAlerts(result.alerts);
    } catch (error) {
      if (!signal?.aborted) {
        console.error("Mandi price alerts could not be loaded:", error);
        setPriceAlertError(error instanceof Error ? error.message : "Price alerts could not be loaded.");
      }
    } finally {
      if (!signal?.aborted) setPriceAlertsLoading(false);
    }
  }
  async function savePriceAlert(event) {
    event.preventDefault();
    if (priceAlertSaving) return;
    const record = marketRecords.find((item) => marketKey(item) === marketFocus);
    const targetPrice = Number(priceAlertTarget);
    if (!record || !Number.isInteger(targetPrice) || targetPrice < 1) {
      setPriceAlertError("Choose a market record and enter a whole-number target price.");
      return;
    }
    setPriceAlertSaving(true);
    setPriceAlertError("");
    try {
      const response = await fetch("/api/mandi/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: record.crop,
          variety: record.variety,
          state: record.state,
          district: record.district ?? "",
          market: record.market,
          direction: priceAlertDirection,
          targetPrice
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Price alert could not be saved.");
      setPriceAlerts((alerts) => [result.alert, ...alerts]);
      setPriceAlertTarget("");
    } catch (error) {
      setPriceAlertError(error instanceof Error ? error.message : "Price alert could not be saved.");
    } finally {
      setPriceAlertSaving(false);
    }
  }
  async function deletePriceAlert(id) {
    setPriceAlertDeletingId(id);
    setPriceAlertError("");
    try {
      const response = await fetch("/api/mandi/alerts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Price alert could not be deleted.");
      setPriceAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
    } catch (error) {
      setPriceAlertError(error instanceof Error ? error.message : "Price alert could not be deleted.");
    } finally {
      setPriceAlertDeletingId("");
    }
  }
  useEffect(() => {
    if (tab !== "market") return;
    const controller = new AbortController();
    void loadPriceAlerts(controller.signal);
    return () => controller.abort();
  }, [tab]);
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
        if (active) setMarketOptions(result);
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
  async function loadNearbyLabs(coords, radius, signal) {
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
      setNearbyLabs(result.results);
    } catch (error) {
      if (signal?.aborted) return;
      setLabsError(error instanceof Error ? error.message : "Nearby labs could not be loaded.");
    } finally {
      if (!signal?.aborted) setLabsLoading(false);
    }
  }
  function saveProfile(event) {
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
      location: [village, selectedDistrict, onboardState].filter(Boolean).filter(
        (item, index, items) => items.findIndex((candidate) => candidate.toLowerCase() === item.toLowerCase()) === index
      ).join(", "),
      acres: Math.max(0.1, Number(onboardSize) || 1),
      crop: onboardCrop,
      state: onboardState,
      district: selectedDistrict,
      village,
      lat: coordinates.latitude,
      lon: coordinates.longitude
    };
    window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
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
  async function signOut() {
    setSigningOut(true);
    setSignOutError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Sign out failed. Please try again.");
      }
      if (typeof onSignedOut === "function") {
        onSignedOut();
      }
      navigate("/", { replace: true });
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Sign out failed. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }
  function selectDistrict(place) {
    const district = place.district || place.name;
    setSelectedDistrict(district);
    setSelectedDistrictPlace(place);
    setDistrictInput(district);
    setDistrictResults([]);
    setVillageInput("");
    setSelectedVillage(null);
    setLocationError("");
  }
  function selectVillage(place) {
    setVillageInput(place.name);
    setSelectedVillage(place);
    setVillageResults([]);
    setLocationError("");
  }
  function startBriefing() {
    if (!weather || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const greeting = language === "Hindi" ? "\u0938\u0941\u092A\u094D\u0930\u092D\u093E\u0924" : language === "Marathi" ? "\u0936\u0941\u092D \u0938\u0915\u093E\u0933" : "Good morning";
    const weatherLine = language === "Hindi" ? `${weather.location} \u092E\u0947\u0902 \u0924\u093E\u092A\u092E\u093E\u0928 ${weather.temperature} \u0921\u093F\u0917\u094D\u0930\u0940 \u0939\u0948` : language === "Marathi" ? `${weather.location} \u092F\u0947\u0925\u0947 \u0924\u093E\u092A\u092E\u093E\u0928 ${weather.temperature} \u0905\u0902\u0936 \u0906\u0939\u0947` : `In ${weather.location}, it is ${weather.temperature} degrees`;
    const text = `${greeting}. ${weatherLine}. ${weather.condition}. ${weather.advisory}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-IN";
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeechPaused(false);
    };
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
  function loadCropImage(file) {
    diagnosisRequestId.current += 1;
    setDiagnosing(false);
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
  function selectImage(event) {
    loadCropImage(event.target.files?.[0]);
    event.target.value = "";
  }
  async function runDiagnosis() {
    return diagnoseInLanguage(language);
  }
  async function loadDiagnosisHistory(signal) {
    setDiagnosisHistoryLoading(true);
    setDiagnosisHistoryError("");
    try {
      const response = await fetch("/api/diagnoses", { signal });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Diagnosis history could not be loaded.");
      if (!Array.isArray(result.records)) throw new Error("The diagnosis history response was invalid.");
      if (!signal?.aborted) {
        setDiagnosisHistory((current) => {
          const records = new Map(
            result.records.map((record) => [record.id, record])
          );
          current.forEach((record) => {
            if (!records.has(record.id)) records.set(record.id, record);
          });
          return Array.from(records.values()).sort((left, right) => right.createdAt.localeCompare(left.createdAt)).slice(0, 50);
        });
      }
    } catch (error) {
      if (!signal?.aborted) {
        console.error("Diagnosis history could not be loaded:", error);
        setDiagnosisHistoryError(error instanceof Error ? error.message : "Diagnosis history could not be loaded.");
      }
    } finally {
      if (!signal?.aborted) setDiagnosisHistoryLoading(false);
    }
  }
  async function loadDiaryEntries(signal) {
    setDiaryLoading(true);
    setDiaryError("");
    try {
      const response = await fetch("/api/diary", { signal });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Crop diary could not be loaded.");
      if (!signal?.aborted) setDiaryEntries(result.entries);
    } catch (error) {
      if (!signal?.aborted) {
        console.error("Crop diary could not be loaded:", error);
        setDiaryError(error instanceof Error ? error.message : "Crop diary could not be loaded.");
      }
    } finally {
      if (!signal?.aborted) setDiaryLoading(false);
    }
  }
  async function saveDiaryEntry(event) {
    event.preventDefault();
    if (diarySaving) return;
    setDiarySaving(true);
    setDiaryError("");
    try {
      const response = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diaryForm)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Crop diary entry could not be saved.");
      setDiaryEntries((entries) => [result.entry, ...entries].sort((left, right) => right.date.localeCompare(left.date) || right.createdAt.localeCompare(left.createdAt)));
      setDiaryForm((form) => ({ ...form, notes: "" }));
    } catch (error) {
      setDiaryError(error instanceof Error ? error.message : "Crop diary entry could not be saved.");
    } finally {
      setDiarySaving(false);
    }
  }
  async function loadReminders(signal) {
    setRemindersLoading(true);
    setReminderError("");
    try {
      const response = await fetch("/api/reminders", { signal });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Reminders could not be loaded.");
      if (!signal?.aborted) setReminders(result.reminders);
    } catch (error) {
      if (!signal?.aborted) {
        console.error("Farm reminders could not be loaded:", error);
        setReminderError(error instanceof Error ? error.message : "Reminders could not be loaded.");
      }
    } finally {
      if (!signal?.aborted) setRemindersLoading(false);
    }
  }
  async function saveReminder(event) {
    event.preventDefault();
    if (reminderSaving) return;
    setReminderSaving(true);
    setReminderError("");
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reminderForm,
          title: reminderForm.title.trim(),
          crop: reminderForm.crop.trim() || null
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Reminder could not be saved.");
      setReminders((items) => [...items, result.reminder].sort(
        (left, right) => Number(left.completed) - Number(right.completed) || left.dueDate.localeCompare(right.dueDate) || right.createdAt.localeCompare(left.createdAt)
      ));
      setReminderForm((form) => ({ ...form, title: "", dueDate: "" }));
    } catch (error) {
      setReminderError(error instanceof Error ? error.message : "Reminder could not be saved.");
    } finally {
      setReminderSaving(false);
    }
  }
  async function setReminderCompleted(reminder, completed) {
    setReminderActionId(reminder.id);
    setReminderError("");
    try {
      const response = await fetch("/api/reminders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reminder.id, completed })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Reminder could not be updated.");
      setReminders((items) => items.map((item) => item.id === reminder.id ? { ...item, completed } : item).sort(
        (left, right) => Number(left.completed) - Number(right.completed) || left.dueDate.localeCompare(right.dueDate) || right.createdAt.localeCompare(left.createdAt)
      ));
    } catch (error) {
      setReminderError(error instanceof Error ? error.message : "Reminder could not be updated.");
    } finally {
      setReminderActionId("");
    }
  }
  async function deleteReminder(id) {
    setReminderActionId(id);
    setReminderError("");
    try {
      const response = await fetch("/api/reminders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Reminder could not be deleted.");
      setReminders((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      setReminderError(error instanceof Error ? error.message : "Reminder could not be deleted.");
    } finally {
      setReminderActionId("");
    }
  }
  async function diagnoseInLanguage(targetLanguage, saveHistory = true) {
    if (!imageData) {
      setDiagnosisError("Add a clear photo of the affected plant first.");
      return;
    }
    const requestId = ++diagnosisRequestId.current;
    setDiagnosing(true);
    setDiagnosisError("");
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, crop: primaryCrop, language: targetLanguage, saveHistory })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The crop scan failed.");
      if (requestId === diagnosisRequestId.current) {
        setDiagnosis(result.diagnosis);
        if (result.record) {
          setDiagnosisHistory((records) => [result.record, ...records].filter((record, index, entries) => entries.findIndex((entry) => entry.id === record.id) === index).sort((left, right) => right.createdAt.localeCompare(left.createdAt)).slice(0, 50));
        }
      }
    } catch (error) {
      if (requestId === diagnosisRequestId.current) {
        setDiagnosisError(error instanceof Error ? error.message : "The crop scan failed.");
      }
    } finally {
      if (requestId === diagnosisRequestId.current) setDiagnosing(false);
    }
  }
  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    if ((diagnosis || diagnosing) && imageData) void diagnoseInLanguage(nextLanguage, false);
  }
  async function submitBooking(event) {
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
  async function sendQuestion(event) {
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
        body: JSON.stringify({ question: text, language, location: farmLocation })
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
    const browserWindow = window;
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
  useEffect(() => {
    if (tab !== "diary") return;
    const controller = new AbortController();
    void loadDiaryEntries(controller.signal);
    return () => controller.abort();
  }, [tab]);
  useEffect(() => {
    if (tab !== "doctor") return;
    const controller = new AbortController();
    void loadDiagnosisHistory(controller.signal);
    return () => controller.abort();
  }, [tab]);
  useEffect(() => {
    if (tab !== "reminders") return;
    const controller = new AbortController();
    void loadReminders(controller.signal);
    return () => controller.abort();
  }, [tab]);
  useEffect(() => {
    if (marketSource !== "data.gov.in" || !marketRecord) {
      setMarketTrend([]);
      return;
    }
    const controller = new AbortController();
    const params = new URLSearchParams({
      crop: marketRecord.crop,
      variety: marketRecord.variety,
      market: marketRecord.market,
      state: marketRecord.state,
      district: marketRecord.district ?? ""
    });
    setMarketTrendLoading(true);
    fetch(`/api/mandi/trend?${params.toString()}`, { signal: controller.signal }).then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Price history could not be loaded.");
      setMarketTrend(Array.isArray(result.history) ? result.history : []);
    }).catch((error) => {
      if (!controller.signal.aborted) {
        console.error("Mandi trend could not be loaded:", error);
        setMarketTrend([]);
      }
    }).finally(() => {
      if (!controller.signal.aborted) setMarketTrendLoading(false);
    });
    return () => controller.abort();
  }, [marketFocus, marketSource, marketRecord?.recordedAt]);
  const filteredRecords = useMemo(
    () => marketRecords,
    [marketRecords]
  );
  const marketSnapshot = useMemo(
    () => Array.from(new Map(marketRecords.map((record) => [record.crop.toLowerCase(), record])).values()).slice(0, 4),
    [marketRecords]
  );
  const availableMandis = useMemo(
    () => marketOptions.mandis.filter((item) => !marketFilterDistrict || item.district.toLowerCase() === marketFilterDistrict.toLowerCase()).map((item) => item.market).filter((market, index, markets) => markets.findIndex((value) => value.toLowerCase() === market.toLowerCase()) === index),
    [marketOptions.mandis, marketFilterDistrict]
  );
  const uniqueDistrictResults = useMemo(
    () => Array.from(new Map(districtResults.map((place) => [place.district || place.name, place])).values()),
    [districtResults]
  );
  const chartData = marketSource === "data.gov.in" ? marketTrend.map((point) => ({
    day: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(/* @__PURE__ */ new Date(`${point.date}T00:00:00Z`)),
    price: point.price
  })) : (marketRecord?.history ?? []).map((price, index) => ({
    day: ["1 Oct", "4 Oct", "7 Oct", "10 Oct", "13 Oct", "16 Oct", "19 Oct", "22 Oct", "Today"][index] ?? `Day ${index + 1}`,
    price
  }));
  const t = (label) => translations[language][label] ?? translations[language][label.charAt(0).toUpperCase() + label.slice(1)] ?? label;
  const cropQuestion = (crop) => t("What should I consider before growing {crop} near {location}?").replace("{crop}", t(crop)).replace("{location}", farmLocation);
  const weatherAdvisory = (message) => {
    const advisory = message ?? "Checking today's forecast and field conditions...";
    const rainMessage = advisory.match(
      /^Rain is likely on (.+)\. Avoid spraying pesticides before or during the showers\.$/
    );
    if (rainMessage) {
      return `${t("Rain is likely on")} ${t(rainMessage[1])}. ${t("Avoid spraying pesticides before or during the showers.")}`;
    }
    return t(advisory);
  };
  const navLabel = (label) => t(label);
  const todayKey = localDateKey();
  const primaryCropMarketRecord = marketRecords.find(
    (record) => record.crop.toLowerCase() === primaryCrop.toLowerCase()
  );
  return /* @__PURE__ */ jsxs("div", { className: "app-shell min-h-screen bg-[#F7F8F2] text-[#202B24]", children: [
    /* @__PURE__ */ jsxs("aside", { className: `fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-[#e9eee9] bg-white px-5 py-6 transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-9 flex items-center gap-3 px-1", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF2E6] text-[#245C3A]", children: /* @__PURE__ */ jsx(Sprout, { size: 25 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold tracking-tight text-[#202B24]", children: "Smart Crop Care" }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-[11px] text-[#718076]", children: "Kisan Care 360" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setMenuOpen(false), className: "ml-auto rounded-lg p-2 text-slate-500 lg:hidden", "aria-label": "Close menu", children: /* @__PURE__ */ jsx(X, { size: 19 }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a1aaa4]", children: t("YOUR FARM") }),
      /* @__PURE__ */ jsx("nav", { className: "min-h-0 flex-1 space-y-1 overflow-y-auto", "aria-label": "Main navigation", children: navItems.map(({ id, label, icon: Icon }) => /* @__PURE__ */ jsxs("button", { onClick: () => {
        setTab(id);
        setMenuOpen(false);
      }, className: `flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition ${tab === id ? "bg-[#eaf5ec] text-[#147343]" : "text-[#647269] hover:bg-[#f5f7f4] hover:text-[#18352a]"}`, children: [
        /* @__PURE__ */ jsx(Icon, { size: 19, strokeWidth: tab === id ? 2.4 : 1.9 }),
        /* @__PURE__ */ jsx("span", { className: "flex-1", children: navLabel(label) }),
        id === "shop" && cartCount > 0 && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#14804a] px-2 py-0.5 text-[10px] text-white", children: cartCount })
      ] }, id)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-auto rounded-2xl bg-[#f3f8f2] p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#14804a]", children: /* @__PURE__ */ jsx(Heart, { size: 18 }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[#254635]", children: t("Here for your farm") }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-5 text-[#77857b]", children: t("Talk to our agronomist assistant whenever you need a hand.") }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setAssistantOpen(true), className: "mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#14804a] px-3 text-xs font-semibold text-white hover:bg-[#0f6b3c]", children: [
          t("Ask a question"),
          " ",
          /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-3 border-t border-[#edf0ed] pt-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e8d7] text-sm font-bold text-[#81532c]", children: account.name.slice(0, 1).toUpperCase() }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-semibold", children: account.name }),
          /* @__PURE__ */ jsx("div", { className: "truncate text-xs text-[#8a978f]", children: account.email })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: openFarmProfile, className: "rounded-lg p-2 text-[#8a978f] hover:bg-[#f5f7f4]", "aria-label": "Edit farm profile", children: /* @__PURE__ */ jsx(UserRound, { size: 17 }) })
      ] })
    ] }),
    menuOpen && /* @__PURE__ */ jsx("button", { className: "fixed inset-0 z-30 bg-black/25 lg:hidden", "aria-label": "Close navigation", onClick: () => setMenuOpen(false) }),
    /* @__PURE__ */ jsxs("main", { className: "min-h-screen lg:pl-[260px]", children: [
      /* @__PURE__ */ jsxs("header", { className: "app-header sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-2 border-b border-[#E3E9DF] bg-white/95 px-2 backdrop-blur sm:gap-3 sm:px-7 xl:px-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setMenuOpen(true), className: "rounded-lg p-2 text-[#526258] lg:hidden", "aria-label": "Open navigation", children: /* @__PURE__ */ jsx(Menu, { size: 21 }) }),
          /* @__PURE__ */ jsxs("button", { onClick: openFarmProfile, className: "group flex min-h-11 min-w-0 max-w-[88px] items-center gap-1 rounded-xl px-0.5 text-left transition hover:bg-[#f4f8f3] sm:max-w-none sm:gap-3 sm:px-2", "aria-label": `Change farm location: ${farmLocation}`, children: [
            /* @__PURE__ */ jsx(
              SectionPhoto,
              {
                src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=160&q=75",
                alt: "",
                className: "hidden h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#EAF3E9] sm:block",
                fallback: /* @__PURE__ */ jsx(Sprout, { size: 17, className: "text-[#3F8757]" })
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF3E9] text-[#246B45] sm:hidden", children: /* @__PURE__ */ jsx(MapPin, { size: 17 }) }),
            /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("span", { className: "hidden text-[10px] font-semibold uppercase tracking-[0.1em] text-[#718076] sm:block", children: t("Your farm") }),
              /* @__PURE__ */ jsxs("span", { className: "flex max-w-[62px] items-center gap-1 truncate text-[11px] font-semibold text-[#202B25] sm:max-w-[180px] sm:text-sm", children: [
                farmLocation,
                /* @__PURE__ */ jsx(ChevronDown, { size: 13, className: "shrink-0 text-[#718076] transition group-hover:translate-y-0.5" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold xl:flex ${weather?.source === "live" ? "bg-[#EAF3E9] text-[#246B45]" : "bg-[#f2f4f0] text-[#68756D]"}`, children: [
              /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${weather?.source === "live" ? "bg-[#3F8757]" : "bg-[#9AA59C]"}` }),
              weather?.source === "live" ? t("Local weather") : weather ? t("Saved forecast") : t("Weather loading")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: (event) => {
          event.preventDefault();
          setMarketSearch(headerSearch);
          setTab("market");
        }, className: "hidden min-w-0 max-w-[380px] flex-1 items-center rounded-xl border border-[#E3E9DF] bg-[#F7F8F2] px-3 focus-within:border-[#83B85A] focus-within:bg-white md:flex", children: [
          /* @__PURE__ */ jsx(Search, { size: 17, className: "shrink-0 text-[#718076]" }),
          /* @__PURE__ */ jsx("input", { "aria-label": t("Search crops and markets"), value: headerSearch, onChange: (event) => setHeaderSearch(event.target.value), placeholder: t("Search crops, markets..."), className: "min-h-10 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "rounded-lg bg-[#245C3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#19492d]", children: t("Search") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 sm:gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-2 rounded-xl border border-[#E2E8E2] bg-[#F6F8F5] px-3 py-2 text-xs text-[#246B45] xl:flex", children: [
            /* @__PURE__ */ jsx(Sun, { size: 16 }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: weather ? `${weather.temperature}\xB0` : "\u2014" }),
            /* @__PURE__ */ jsx("span", { className: "max-w-[100px] truncate text-[#68756D]", children: t(weather?.condition ?? "Weather") })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex h-9 items-center gap-1 rounded-lg border border-[#e8eee8] px-1.5 text-xs text-[#6d7b72] sm:h-10 sm:gap-2 sm:px-3", children: [
            /* @__PURE__ */ jsx(Globe2, { size: 15, className: "text-[#14804a]" }),
            /* @__PURE__ */ jsxs("select", { "aria-label": t("Choose language"), value: language, onChange: (event) => changeLanguage(event.target.value), className: "max-w-[58px] bg-transparent outline-none sm:max-w-none", children: [
              /* @__PURE__ */ jsx("option", { value: "English", children: "English" }),
              /* @__PURE__ */ jsx("option", { value: "Hindi", children: "\u0939\u093F\u0928\u094D\u0926\u0940" }),
              /* @__PURE__ */ jsx("option", { value: "Marathi", children: "\u092E\u0930\u093E\u0920\u0940" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setTheme((current) => current === "light" ? "dark" : "light"), className: "flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8eee8] text-[#526258] hover:bg-[#f3f6f2] sm:h-10 sm:w-10", "aria-label": t(theme === "light" ? "Dark mode" : "Light mode"), title: t(theme === "light" ? "Dark mode" : "Light mode"), children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 18 }) : /* @__PURE__ */ jsx(Sun, { size: 18 }) }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setAssistantOpen(true), className: "relative rounded-xl p-1.5 text-[#68766d] hover:bg-[#f3f6f2] sm:p-2", "aria-label": t("Notifications"), children: [
            /* @__PURE__ */ jsx(Bell, { size: 19 }),
            /* @__PURE__ */ jsx("span", { className: "absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#e7a63c]" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden h-8 w-px bg-[#e9eee9] sm:block" }),
          /* @__PURE__ */ jsxs("div", { className: "hidden min-w-0 max-w-44 sm:block", children: [
            /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-semibold", children: account.name }),
            /* @__PURE__ */ jsx("p", { className: "truncate text-[10px] text-[#839087]", children: account.email })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => void signOut(), disabled: signingOut, className: "flex h-9 items-center gap-2 rounded-xl border border-[#e8eee8] px-2.5 text-xs font-semibold text-[#526258] hover:bg-[#f3f6f2] disabled:opacity-60 sm:h-10 sm:px-3", "aria-label": "Sign out", children: [
            /* @__PURE__ */ jsx(LogOut, { size: 16 }),
            /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: signingOut ? "Signing out..." : "Sign out" })
          ] })
        ] })
      ] }),
      signOutError && /* @__PURE__ */ jsx("div", { className: "mx-4 mt-4 rounded-xl border border-[#f1d6b7] bg-[#fff8e9] px-4 py-3 text-sm text-[#755c2d] sm:mx-7 lg:mx-9", role: "alert", children: signOutError }),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-7 flex flex-wrap items-end justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm text-[#718076]", children: new Intl.DateTimeFormat(language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-IN", { weekday: "long", day: "numeric", month: "long" }).format(/* @__PURE__ */ new Date()) }),
            /* @__PURE__ */ jsxs("h1", { className: "flex items-center gap-2 text-[26px] font-bold tracking-tight text-[#202B24] sm:text-[30px]", children: [
              t("Welcome back"),
              ", ",
              farmerName,
              " ",
              /* @__PURE__ */ jsx(Leaf, { size: 23, className: "text-[#3F8757]", "aria-hidden": "true" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[#718076]", children: t("Your farm overview, crop recommendations, and market insights in one place.") })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: openFarmProfile, className: "flex min-h-11 items-center gap-2 rounded-xl border border-[#dce6dc] bg-white px-4 text-sm font-semibold text-[#3a5945] hover:bg-[#f7faf6]", children: [
            /* @__PURE__ */ jsx(Sprout, { size: 17 }),
            " ",
            t("My farm"),
            " ",
            /* @__PURE__ */ jsx(ChevronDown, { size: 15 })
          ] })
        ] }),
        tab === "dashboard" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("section", { className: "hero-banner relative overflow-hidden rounded-2xl p-6 text-white shadow-sm sm:min-h-[265px] sm:p-9 lg:p-11", children: [
            !heroImageFailed && /* @__PURE__ */ jsx("img", { src: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1600&q=85", alt: "", fetchPriority: "high", onError: () => setHeroImageFailed(true) }),
            /* @__PURE__ */ jsxs("div", { className: "relative max-w-2xl py-2 sm:py-4", children: [
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90", children: [
                /* @__PURE__ */ jsx(Sprout, { size: 14 }),
                " ",
                t("Practical insights for your farm")
              ] }),
              /* @__PURE__ */ jsx("h2", { className: "mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[42px]", children: t("Grow Smarter. Sell Better.") }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base", children: t("Your intelligent companion for healthier crops, smarter farming decisions, and better market opportunities.") }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
                /* @__PURE__ */ jsxs("button", { onClick: () => document.getElementById("crop-guides")?.scrollIntoView({ behavior: "smooth", block: "start" }), className: "flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#245C3A] hover:bg-[#EAF2E6]", children: [
                  t("Explore crop insights"),
                  " ",
                  /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: () => setTab("market"), className: "flex min-h-11 items-center gap-2 rounded-xl border border-white/55 bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20", children: [
                  /* @__PURE__ */ jsx(TrendingUp, { size: 16 }),
                  " ",
                  t("Check market prices")
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { "aria-label": "Farm overview", className: "grid gap-4 sm:grid-cols-2 2xl:grid-cols-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#E3E9DF] bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2E6] text-[#245C3A]", children: /* @__PURE__ */ jsx(Sprout, { size: 19 }) }),
                /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#EAF2E6] px-2.5 py-1 text-[10px] font-semibold text-[#3F8554]", children: t("SEASONAL GUIDE") })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-4 text-2xl font-bold text-[#202B24]", children: "03" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold", children: t("Crop ideas to explore") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#718076]", children: t("General growing guides, not a soil diagnosis") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#E3E9DF] bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5DF] text-[#A87718]", children: /* @__PURE__ */ jsx(TrendingUp, { size: 19 }) }),
                /* @__PURE__ */ jsx("span", { className: `rounded-full px-2.5 py-1 text-[10px] font-semibold ${marketSource === "sample" ? "bg-[#FFF5DF] text-[#8E671D]" : "bg-[#EAF2E6] text-[#3F8554]"}`, children: marketSource === "sample" ? t("SAMPLE") : t("LIVE") })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-4 text-2xl font-bold text-[#202B24]", children: primaryCropMarketRecord ? money(primaryCropMarketRecord.price) : "\u2014" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm font-semibold", children: [
                t(primaryCrop),
                " ",
                t("market price")
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#718076]", children: primaryCropMarketRecord ? `${primaryCropMarketRecord.market} \xB7 ${t("per quintal")}` : t("Open mandi insights for available prices") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#E3E9DF] bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2E6] text-[#245C3A]", children: /* @__PURE__ */ jsx(Sun, { size: 19 }) }),
                /* @__PURE__ */ jsx("span", { className: `rounded-full px-2.5 py-1 text-[10px] font-semibold ${weather?.source === "live" ? "bg-[#EAF2E6] text-[#3F8554]" : "bg-[#FFF5DF] text-[#8E671D]"}`, children: weather?.source === "live" ? t("LIVE") : t("SAMPLE") })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-4 text-2xl font-bold text-[#202B24]", children: weather ? `${weather.temperature}\xB0C` : "\u2014" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold", children: weather ? t(weather.condition) : t("Weather conditions") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#718076]", children: weather?.location ?? farmLocation })
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setTab("doctor"), className: "rounded-2xl border border-[#E3E9DF] bg-white p-5 text-left shadow-sm transition hover:border-[#83B85A] hover:shadow-md", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCEEE9] text-[#B45B44]", children: /* @__PURE__ */ jsx(Bug, { size: 19 }) }),
                /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "text-[#718076]" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-4 text-2xl font-bold text-[#202B24]", children: diagnosis ? "1" : "\u2014" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold", children: diagnosis ? t("Screening result ready") : t("No crop scans yet") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#718076]", children: diagnosis ? t("Screening aid \xB7 not a confirmed diagnosis") : t("Scan a plant to check for possible issues") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { id: "crop-guides", className: "scroll-mt-24", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-end justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.12em] text-[#3F8554]", children: t("EXPLORE YOUR OPTIONS") }),
                /* @__PURE__ */ jsx("h2", { className: "mt-1 text-xl font-bold text-[#202B24]", children: t("Seasonal crop guide") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[#718076]", children: t("Starting points for planning. Confirm local suitability with your soil report or KVK.") })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#EAF2E6] px-3 py-1.5 text-xs font-semibold text-[#3F8554]", children: t("General guidance \xB7 not personalized") })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 2xl:grid-cols-3", children: cropGuides.map((guide) => {
              const priceRecord = marketRecords.find((record) => record.crop.toLowerCase() === guide.crop.toLowerCase());
              return /* @__PURE__ */ jsxs("article", { className: "crop-card overflow-hidden rounded-2xl border border-[#E3E9DF] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md", children: [
                /* @__PURE__ */ jsx(CropPhoto, { guide }),
                /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#202B24]", children: t(guide.crop) }),
                    /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#EAF2E6] px-2.5 py-1 text-[10px] font-semibold text-[#3F8554]", children: t(guide.season) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-2 gap-y-3 text-xs", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[#718076]", children: t("Soil guide") }),
                      /* @__PURE__ */ jsx("p", { className: "mt-0.5 font-semibold text-[#34463a]", children: t(guide.soil) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[#718076]", children: t("Growing duration") }),
                      /* @__PURE__ */ jsx("p", { className: "mt-0.5 font-semibold text-[#34463a]", children: t(guide.duration) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "col-span-2 border-t border-[#E3E9DF] pt-3", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[#718076]", children: t("Indicative mandi modal price \xB7 \u20B9/quintal") }),
                      /* @__PURE__ */ jsx("p", { className: "mt-0.5 font-semibold text-[#34463a]", children: priceRecord ? `${money(priceRecord.price)} \xB7 ${marketSource === "sample" ? t("sample data") : t("live data")}` : t("No price available for this crop") })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("button", { onClick: () => {
                    setPrimaryCrop(guide.crop);
                    setQuestion(cropQuestion(guide.crop));
                    setAssistantOpen(true);
                  }, className: "mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#D8E5D4] text-sm font-semibold text-[#245C3A] hover:bg-[#EAF2E6]", children: [
                    t("Ask about"),
                    " ",
                    t(guide.crop),
                    " ",
                    /* @__PURE__ */ jsx(ArrowRight, { size: 15 })
                  ] })
                ] })
              ] }, guide.crop);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "grid gap-5 xl:grid-cols-[1.2fr_0.8fr]", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#DDE8D8] bg-[#EAF2E6] p-5 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#245C3A]", children: /* @__PURE__ */ jsx(Sprout, { size: 21 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-[#202B24]", children: t("Your Smart Farming Assistant") }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-xl text-sm leading-6 text-[#617267]", children: t("Get guidance on crop selection, soil health, pest management, irrigation, and market opportunities.") })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: ["Which crop is suitable for my soil?", "How can I identify crop diseases?", "Which mandi offers a better price?", "When should I irrigate my crops?"].map((suggestion) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setQuestion(t(suggestion)), className: "min-h-9 rounded-full border border-[#D6E2D2] bg-white px-3 text-xs font-medium text-[#3F5A46] hover:border-[#83B85A]", children: t(suggestion) }, suggestion)) }),
              /* @__PURE__ */ jsxs("form", { onSubmit: (event) => {
                setAssistantOpen(true);
                void sendQuestion(event);
              }, className: "mt-4 flex gap-2 rounded-xl border border-[#D6E2D2] bg-white p-2", children: [
                /* @__PURE__ */ jsx("input", { value: question, onChange: (event) => setQuestion(event.target.value), maxLength: 1e3, placeholder: t("Ask about your farm..."), className: "min-h-10 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none", "aria-label": t("Ask the farming assistant") }),
                /* @__PURE__ */ jsxs("button", { type: "submit", disabled: !question.trim() || chatLoading, className: "flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-[#245C3A] px-4 text-sm font-semibold text-white hover:bg-[#19492d] disabled:cursor-not-allowed disabled:opacity-50", children: [
                  /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: t("Ask") }),
                  /* @__PURE__ */ jsx(Send, { size: 15 })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-[11px] text-[#718076]", children: t("Answers are general information. Confirm important decisions with local agricultural experts.") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-[#E3E9DF] bg-white", children: [
              /* @__PURE__ */ jsx("div", { className: "h-32 overflow-hidden bg-[#EAF2E6]", children: /* @__PURE__ */ jsx("img", { src: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80", alt: "Farmer tending crops in a green field", loading: "lazy", className: "h-full w-full object-cover", onError: (event) => {
                event.currentTarget.style.display = "none";
              } }) }),
              /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.12em] text-[#3F8554]", children: t("PLANT HEALTH") }),
                /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold text-[#202B24]", children: t("A closer look can help") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-5 text-[#718076]", children: t("Upload a clear leaf photo for an AI screening. Results are a starting point, not a confirmed diagnosis.") }),
                /* @__PURE__ */ jsxs("button", { onClick: () => setTab("doctor"), className: "mt-4 flex min-h-10 items-center gap-2 rounded-xl bg-[#245C3A] px-4 text-sm font-semibold text-white hover:bg-[#19492d]", children: [
                  t("Open crop doctor"),
                  " ",
                  /* @__PURE__ */ jsx(ArrowRight, { size: 15 })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "grid gap-5 xl:grid-cols-[1.55fr_1fr]", children: [
            /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e7348] to-[#145b3c] p-5 text-white shadow-sm sm:p-7", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("button", { onClick: openFarmProfile, className: "flex items-center gap-2 text-left text-sm text-white/80 hover:text-white", children: [
                    /* @__PURE__ */ jsx(MapPin, { size: 15 }),
                    " ",
                    farmLocation,
                    /* @__PURE__ */ jsx(ChevronDown, { size: 14 }),
                    /* @__PURE__ */ jsx("span", { className: "rounded-full bg-white/15 px-2 py-0.5 text-[10px]", children: weather?.source === "live" ? t("LIVE") : t("SAMPLE") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-5xl font-semibold tracking-tight", children: [
                      weather?.temperature ?? "\u2014",
                      "\xB0"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-sm leading-5 text-white/80", children: [
                      weather ? t(weather.condition) : t("Loading weather"),
                      /* @__PURE__ */ jsx("br", {}),
                      language === "Hindi" ? "\u092E\u0939\u0938\u0942\u0938:" : language === "Marathi" ? "\u091C\u093E\u0923\u0935\u0924\u0947:" : t("Feels like"),
                      " ",
                      weather?.feelsLike ?? "\u2014",
                      "\xB0"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-white/70", children: t("Good day to check your crop rows.") })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-white/10 p-3", children: /* @__PURE__ */ jsx(Sun, { size: 42, strokeWidth: 1.5, className: "text-[#f6d88b]" }) })
              ] }),
              weatherError && /* @__PURE__ */ jsx("p", { role: "alert", className: "mt-3 rounded-lg bg-white/10 px-3 py-2 text-xs text-white", children: weatherError }),
              /* @__PURE__ */ jsx("div", { className: "mt-6 grid grid-cols-3 gap-2 border-t border-white/15 pt-5 sm:gap-4", children: [{ icon: Droplets, label: "Humidity", value: `${weather?.humidity ?? "\u2014"}%` }, { icon: CloudRain, label: "Rain chance", value: `${weather?.rainChance ?? "\u2014"}%` }, { icon: Wind, label: "Wind", value: `${weather?.wind ?? "\u2014"} km/h` }].map(({ icon: Icon, label, value }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsx(Icon, { size: 18, className: "text-white/70" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/65", children: t(label) }),
                  /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm font-semibold", children: value })
                ] })
              ] }, label)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.13em] text-[#929e95]", children: t("YOUR DAILY BRIEF") }),
                    /* @__PURE__ */ jsx("h2", { className: "mt-2 text-lg font-bold text-[#274535]", children: t("Farm weather, in a minute") })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f7ef] text-[#14804a]", children: /* @__PURE__ */ jsx(AudioLines, { size: 21 }) })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-6 text-[#728077]", children: weatherAdvisory(weather?.advisory) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("button", { onClick: toggleBriefing, className: "flex min-h-11 items-center gap-2 rounded-xl bg-[#14804a] px-4 text-sm font-semibold text-white hover:bg-[#0f6b3c]", children: [
                  /* @__PURE__ */ jsx(Volume2, { size: 17 }),
                  " ",
                  t(speechPaused ? "Resume briefing" : isSpeaking ? "Pause briefing" : "Listen to briefing")
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: startBriefing, className: "flex min-h-11 items-center gap-2 rounded-xl border border-[#e5ebe5] px-3 text-sm font-medium text-[#647269] hover:bg-[#f8faf7]", children: [
                  /* @__PURE__ */ jsx(AudioLines, { size: 16 }),
                  " ",
                  t("Replay")
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "grid gap-5 xl:grid-cols-[1.55fr_1fr]", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsx(
                SectionPhoto,
                {
                  src: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80",
                  alt: "Green farm fields with irrigation channels",
                  className: "mb-5 h-28 overflow-hidden rounded-xl bg-[#EAF2E6] sm:h-36",
                  fallback: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-[#3F8554]", children: [
                    /* @__PURE__ */ jsx(Sprout, { size: 19 }),
                    " Local weather for your fields"
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "font-bold text-[#234332]", children: t("7-day forecast") }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8a978f]", children: t("Plan field work around the weather") })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsxs("button", { onClick: openFarmProfile, className: "flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]", children: [
                    /* @__PURE__ */ jsx(MapPin, { size: 14 }),
                    " ",
                    t("Choose farm")
                  ] }),
                  /* @__PURE__ */ jsxs("button", { onClick: () => {
                    if (!navigator.geolocation) {
                      setWeatherError("Location access isn't available in this browser.");
                      return;
                    }
                    navigator.geolocation.getCurrentPosition((position) => void loadWeather({ lat: position.coords.latitude, lon: position.coords.longitude }), () => setWeatherError("We couldn't access your location. Check browser permissions."));
                  }, className: "flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]", children: [
                    /* @__PURE__ */ jsx(MapPin, { size: 14 }),
                    " ",
                    t("Use my location")
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2 sm:grid-cols-7", children: (weather?.forecast ?? []).map((day) => /* @__PURE__ */ jsxs("div", { className: `rounded-xl px-1.5 py-3 text-center ${day.day === "Today" ? "bg-[#f0f7ee]" : "bg-white"}`, children: [
                /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium text-[#68786e]", children: t(day.day) }),
                /* @__PURE__ */ jsx("div", { className: "my-3 flex justify-center text-[#d3982f]", children: /* @__PURE__ */ jsx(WeatherIcon, { kind: day.icon, size: 20 }) }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-[#3b5142]", children: [
                  day.high,
                  "\xB0 ",
                  /* @__PURE__ */ jsxs("span", { className: "font-normal text-[#9aa59c]", children: [
                    day.low,
                    "\xB0"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[10px] text-[#7590a3]", children: [
                  day.rain,
                  "% ",
                  t("rain")
                ] })
              ] }, day.day)) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-start gap-2 rounded-xl bg-[#fff8e9] px-3.5 py-3 text-xs leading-5 text-[#755c2d]", children: [
                /* @__PURE__ */ jsx(ThermometerSun, { size: 16, className: "mt-0.5 shrink-0 text-[#c38b2d]" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("strong", { children: t("Field tip:") }),
                  " ",
                  weather ? weatherAdvisory(weather.advisory) : t("Check the latest forecast before field work.")
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "font-bold text-[#234332]", children: t("Your farm at a glance") }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8a978f]", children: t("A quick look at your fields") })
                ] }),
                /* @__PURE__ */ jsx("button", { onClick: () => setTab("efficiency"), className: "rounded-lg p-2 text-[#14804a] hover:bg-[#f1f7ef]", "aria-label": t("View farm planner"), children: /* @__PURE__ */ jsx(ArrowRight, { size: 18 }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-[#f7f9f6] p-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[#14804a]", children: [
                    /* @__PURE__ */ jsx(MapPin, { size: 16 }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-[#7b8980]", children: t("Cultivated area") })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xl font-bold", children: [
                    farmSize,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-[#859188]", children: language === "Hindi" ? "\u090F\u0915\u0921\u093C" : language === "Marathi" ? "\u090F\u0915\u0930" : "acres" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-[#f7f9f6] p-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[#14804a]", children: [
                    /* @__PURE__ */ jsx(Leaf, { size: 16 }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-[#7b8980]", children: t("Main crop") })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-xl font-bold", children: t(primaryCrop) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl border border-[#e9eee9] p-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
                    /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-[#5aae73]" }),
                    t("Next field task")
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-[#8a978f]", children: t("Tomorrow") })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 pl-4 text-xs text-[#7c8980]", children: t("Walk the field and check soil moisture before irrigation.") })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "grid gap-5 xl:grid-cols-[1.55fr_1fr]", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "font-bold text-[#234332]", children: t("Today's mandi snapshot") }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#8a978f]", children: [
                    marketSource === "sample" ? t("Sample modal prices") : t("Live modal prices"),
                    " \xB7 \u20B9 ",
                    t("per quintal")
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: () => setTab("market"), className: "flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]", children: [
                  t("All prices"),
                  " ",
                  /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-[#edf0ed]", children: marketSnapshot.map((record) => /* @__PURE__ */ jsxs("button", { onClick: () => {
                setMarketFocus(marketKey(record));
                setTab("market");
              }, className: "flex min-h-[58px] w-full items-center gap-3 text-left hover:bg-[#fbfcfa]", children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f7ef] text-[#14804a]", children: /* @__PURE__ */ jsx(Leaf, { size: 17 }) }),
                /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "block text-sm font-semibold", children: t(record.crop) }),
                  /* @__PURE__ */ jsxs("span", { className: "block text-[11px] text-[#8a978f]", children: [
                    record.market,
                    ", ",
                    record.state
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("span", { className: "block text-sm font-bold", children: money(record.price) }),
                  /* @__PURE__ */ jsxs("span", { className: `text-[11px] ${record.change >= 0 ? "text-[#258654]" : "text-[#c05948]"}`, children: [
                    record.change >= 0 ? "+" : "",
                    record.change,
                    "% ",
                    t("today")
                  ] })
                ] })
              ] }, marketKey(record))) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "font-bold text-[#234332]", children: t("Quick actions") }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8a978f]", children: t("Tools for your next field visit") })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-[#f1f7ef] p-2 text-[#14804a]", children: /* @__PURE__ */ jsx(CalendarDays, { size: 17 }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: [{ id: "doctor", icon: Bug, title: "Scan a crop problem", sub: "Get a quick plant health check" }, { id: "soil", icon: FlaskConical, title: "Book a soil test", sub: "Find a nearby testing lab" }, { id: "efficiency", icon: Activity, title: "Plan fertilizer use", sub: "Estimate amounts for your fields" }].map(({ id, icon: Icon, title, sub }) => /* @__PURE__ */ jsxs("button", { onClick: () => setTab(id), className: "flex min-h-[62px] w-full items-center gap-3 rounded-xl border border-[#edf0ed] px-3 text-left hover:border-[#d3e4d4] hover:bg-[#f9fbf8]", children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f7ee] text-[#14804a]", children: /* @__PURE__ */ jsx(Icon, { size: 17 }) }),
                /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "block text-sm font-semibold", children: t(title) }),
                  /* @__PURE__ */ jsx("span", { className: "mt-0.5 block text-[11px] text-[#89958c]", children: t(sub) })
                ] }),
                /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "text-[#9aa59c]" })
              ] }, title)) })
            ] })
          ] })
        ] }),
        tab === "doctor" && /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("section", { className: "grid gap-5 xl:grid-cols-[1fr_0.9fr]", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-7", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff3e6] text-[#bf771d]", children: /* @__PURE__ */ jsx(Bug, { size: 22 }) }),
                /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-bold", children: t("AI crop health doctor") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-lg text-sm leading-6 text-[#77857b]", children: t("Take a clear photo of a leaf or affected plant. We'll help you understand what might be happening.") })
              ] }),
              /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm font-semibold", children: t("What crop are you checking?") }),
              /* @__PURE__ */ jsxs("select", { value: primaryCrop, onChange: (event) => setPrimaryCrop(event.target.value), className: "mb-5 min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white px-3 text-sm", children: [
                /* @__PURE__ */ jsx("option", { value: primaryCrop, children: t(primaryCrop) }),
                crops.filter((crop) => crop !== primaryCrop).map((crop) => /* @__PURE__ */ jsx("option", { children: t(crop) }, crop))
              ] }),
              /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/jpeg,image/png,image/webp", capture: "environment", onChange: selectImage, className: "hidden" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => fileRef.current?.click(),
                  onDragEnter: (event) => {
                    event.preventDefault();
                    setUploadFocused(true);
                  },
                  onDragOver: (event) => event.preventDefault(),
                  onDragLeave: (event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setUploadFocused(false);
                  },
                  onDrop: (event) => {
                    event.preventDefault();
                    setUploadFocused(false);
                    loadCropImage(event.dataTransfer.files[0]);
                  },
                  className: `upload-dropzone flex min-h-[190px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-4 text-center transition ${uploadFocused ? "border-[#246B45] ring-2 ring-[#246B45]/20" : "border-[#d9e5d9] hover:border-[#85b894]"}`,
                  children: imageData ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("img", { src: imageData, alt: t("Selected crop leaf preview"), className: "max-h-40 rounded-xl object-contain" }),
                    /* @__PURE__ */ jsxs("span", { className: "mt-2 text-xs text-[#6e7d73]", children: [
                      imageName,
                      " \xB7 ",
                      t("Click or drop to change")
                    ] })
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf3e9] text-[#246B45]", children: /* @__PURE__ */ jsx(Upload, { size: 21 }) }),
                    /* @__PURE__ */ jsx("span", { className: "mt-3 text-sm font-semibold", children: t("Upload or take a photo") }),
                    /* @__PURE__ */ jsx("span", { className: "mt-1 text-xs text-[#68756D]", children: t("Drop an image here, or browse \xB7 JPG, PNG or WebP \xB7 up to 10 MB") })
                  ] })
                }
              ),
              diagnosisError && /* @__PURE__ */ jsx("p", { role: "alert", className: "mt-3 text-sm text-[#b54136]", children: diagnosisError }),
              /* @__PURE__ */ jsx("button", { disabled: diagnosing, onClick: () => void runDiagnosis(), className: "mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#14804a] px-4 text-sm font-semibold text-white hover:bg-[#0f6b3c] disabled:cursor-wait disabled:opacity-60", children: diagnosing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" }),
                " ",
                t("Checking your crop...")
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Search, { size: 17 }),
                " ",
                t("Check crop health")
              ] }) }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-center text-[11px] leading-5 text-[#8b978e]", children: t("Your photo is used only to provide this result. This tool is a screening aid, not a confirmed diagnosis.") })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-7", children: !diagnosis ? /* @__PURE__ */ jsxs("div", { className: "h-full min-h-[390px] text-center", children: [
              /* @__PURE__ */ jsx(SectionPhoto, { src: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1100&q=80", alt: t("Close-up of healthy green crop leaves"), className: "h-44 overflow-hidden rounded-xl bg-[#eaf3e9] sm:h-52", fallback: /* @__PURE__ */ jsx(Leaf, { size: 36, className: "text-[#3F8757]" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center px-2 pb-3 pt-6", children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3e9] text-[#246B45]", children: /* @__PURE__ */ jsx(Leaf, { size: 24 }) }),
                /* @__PURE__ */ jsx("h3", { className: "mt-3 font-bold", children: t("Your crop check will appear here") }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-xs text-sm leading-6 text-[#68756D]", children: t("Upload a clear photo in natural light. Try to include both healthy and affected leaves.") }),
                /* @__PURE__ */ jsxs("div", { className: "mt-5 grid w-full max-w-sm grid-cols-3 gap-2 text-[11px] text-[#68756D]", children: [
                  /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-[#f6f8f5] p-3", children: t("Clear, close-up photo") }),
                  /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-[#f6f8f5] p-3", children: t("Good natural light") }),
                  /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-[#f6f8f5] p-3", children: t("One plant at a time") })
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-[#fff4e5] px-3 py-1 text-xs font-semibold text-[#9a651b]", children: [
                    t(diagnosis.severity),
                    " ",
                    t("concern")
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-4 text-xl font-bold", children: diagnosis.disease }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-[#7c8980]", children: [
                    diagnosis.source === "gemini" ? t("Gemini AI screening") : t("Sample screening"),
                    " \xB7 ",
                    diagnosis.confidence,
                    "% ",
                    t("confidence")
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1f7ef] text-[#14804a]", children: /* @__PURE__ */ jsx(FileText, { size: 20 }) })
              ] }),
              imageData && /* @__PURE__ */ jsx("img", { src: imageData, alt: t("Crop image submitted for screening"), className: "mt-5 h-48 w-full rounded-xl object-cover" }),
              /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: [{ title: "What to look for", body: diagnosis.symptoms }, { title: "Gentle first steps", body: diagnosis.organic }, { title: "Chemical treatment", body: diagnosis.chemical }, { title: "Prevention", body: diagnosis.prevention }].map(({ title, body }) => /* @__PURE__ */ jsxs("div", { className: "border-t border-[#edf0ed] pt-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: t(title) }),
                /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm leading-6 text-[#718077]", children: body })
              ] }, title)) }),
              /* @__PURE__ */ jsx("p", { className: "mt-5 rounded-xl bg-[#fff8e9] p-3 text-xs leading-5 text-[#755c2d]", children: diagnosis.note })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Diagnosis history") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#89958c]", children: t("Past crop checks are saved to your account. Uploaded photos are not stored.") })
              ] }),
              diagnosisHistory.length > 0 && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#eff7ed] px-2.5 py-1 text-[11px] font-semibold text-[#397d4d]", children: diagnosisHistory.length })
            ] }),
            diagnosisHistoryError && /* @__PURE__ */ jsx("p", { role: "alert", className: "mt-3 text-sm text-[#b54136]", children: diagnosisHistoryError }),
            diagnosisHistoryLoading ? /* @__PURE__ */ jsx("p", { role: "status", className: "py-8 text-center text-sm text-[#89958c]", children: t("Loading diagnosis history...") }) : diagnosisHistory.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-8 text-center", children: [
              /* @__PURE__ */ jsx(FileText, { size: 25, className: "mx-auto text-[#8a978f]" }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-semibold", children: t("No saved diagnoses yet") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#89958c]", children: t("Your recent crop checks will appear here.") })
            ] }) : /* @__PURE__ */ jsx("div", { className: "mt-4 divide-y divide-[#edf0ed]", children: diagnosisHistory.map((record) => /* @__PURE__ */ jsxs("article", { className: "py-4 first:pt-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: record.disease }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#68766d]", children: [
                    t(record.crop),
                    " \xB7 ",
                    record.confidence,
                    "% ",
                    t("confidence"),
                    " \xB7 ",
                    record.severity
                  ] })
                ] }),
                /* @__PURE__ */ jsx("time", { className: "shrink-0 text-xs text-[#89958c]", children: new Intl.DateTimeFormat(language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(record.createdAt)) })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-5 text-[#718077]", children: record.symptoms })
            ] }, record.id)) })
          ] })
        ] }),
        tab === "diary" && /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.13em] text-[#929e95]", children: t("YOUR FARM") }),
            /* @__PURE__ */ jsx("h2", { className: "mt-2 text-2xl font-bold", children: t("Crop diary") }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[#718077]", children: t("Record planting, irrigation, and fieldwork in one place.") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid items-start gap-5 xl:grid-cols-[0.85fr_1.15fr]", children: [
            /* @__PURE__ */ jsxs("form", { onSubmit: (event) => void saveDiaryEntry(event), className: "space-y-4 rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Add diary entry") }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Crop"),
                /* @__PURE__ */ jsx("input", { required: true, maxLength: 80, value: diaryForm.crop, onChange: (event) => setDiaryForm((form) => ({ ...form, crop: event.target.value })), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#dfe7df] px-3 text-sm font-normal" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Activity"),
                /* @__PURE__ */ jsx("select", { value: diaryForm.activity, onChange: (event) => setDiaryForm((form) => ({ ...form, activity: event.target.value })), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#dfe7df] bg-white px-3 text-sm font-normal", children: ["Sowing", "Irrigation", "Fertilizing", "Spraying", "Weeding", "Harvest", "Other"].map((activity) => /* @__PURE__ */ jsx("option", { value: activity, children: t(activity) }, activity)) })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Date"),
                /* @__PURE__ */ jsx("input", { required: true, type: "date", value: diaryForm.date, onChange: (event) => setDiaryForm((form) => ({ ...form, date: event.target.value })), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#dfe7df] px-3 text-sm font-normal" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Notes (optional)"),
                /* @__PURE__ */ jsx("textarea", { maxLength: 1e3, rows: 4, value: diaryForm.notes, onChange: (event) => setDiaryForm((form) => ({ ...form, notes: event.target.value })), placeholder: t("Add a note about this field activity..."), className: "mt-1.5 w-full resize-y rounded-xl border border-[#dfe7df] px-3 py-2 text-sm font-normal" })
              ] }),
              diaryError && /* @__PURE__ */ jsx("p", { role: "alert", className: "text-sm text-[#b54136]", children: diaryError }),
              /* @__PURE__ */ jsxs("button", { type: "submit", disabled: diarySaving, className: "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#14804a] px-4 text-sm font-semibold text-white hover:bg-[#0f6b3c] disabled:cursor-wait disabled:opacity-60", children: [
                /* @__PURE__ */ jsx(Plus, { size: 16 }),
                " ",
                diarySaving ? t("Saving...") : t("Save entry")
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Your recent field activity") }),
              diaryLoading ? /* @__PURE__ */ jsx("p", { role: "status", className: "py-8 text-center text-sm text-[#89958c]", children: t("Loading diary...") }) : diaryEntries.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-10 text-center", children: [
                /* @__PURE__ */ jsx(BookOpen, { size: 28, className: "mx-auto text-[#8a978f]" }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-semibold", children: t("No diary entries yet") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#89958c]", children: t("Your saved field activities will appear here.") })
              ] }) : /* @__PURE__ */ jsx("div", { className: "mt-4 divide-y divide-[#edf0ed]", children: diaryEntries.map((entry) => /* @__PURE__ */ jsxs("article", { className: "py-4 first:pt-1", children: [
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-start justify-between gap-2", children: /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold", children: [
                    t(entry.crop),
                    " \xB7 ",
                    t(entry.activity)
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-1 flex items-center gap-1.5 text-xs text-[#89958c]", children: [
                    /* @__PURE__ */ jsx(CalendarDays, { size: 13 }),
                    new Intl.DateTimeFormat(language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" }).format(/* @__PURE__ */ new Date(`${entry.date}T00:00:00`))
                  ] })
                ] }) }),
                entry.notes && /* @__PURE__ */ jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm leading-5 text-[#68766d]", children: entry.notes })
              ] }, entry.id)) })
            ] })
          ] })
        ] }),
        tab === "reminders" && /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.13em] text-[#929e95]", children: t("YOUR FARM") }),
            /* @__PURE__ */ jsx("h2", { className: "mt-2 text-2xl font-bold", children: t("Reminders") }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[#718077]", children: t("Set a task and due date to keep track of upcoming farm work.") })
          ] }),
          reminderError && /* @__PURE__ */ jsx("p", { role: "alert", className: "rounded-xl bg-[#fff1ef] p-3 text-sm text-[#a93f35]", children: reminderError }),
          /* @__PURE__ */ jsxs("div", { className: "grid items-start gap-5 xl:grid-cols-[0.85fr_1.15fr]", children: [
            /* @__PURE__ */ jsxs("form", { onSubmit: (event) => void saveReminder(event), className: "space-y-4 rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Add a reminder") }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Task"),
                /* @__PURE__ */ jsx("input", { required: true, maxLength: 120, value: reminderForm.title, onChange: (event) => setReminderForm((form) => ({ ...form, title: event.target.value })), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#dfe7df] px-3 text-sm font-normal" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Crop (optional)"),
                /* @__PURE__ */ jsx("input", { maxLength: 80, value: reminderForm.crop, onChange: (event) => setReminderForm((form) => ({ ...form, crop: event.target.value })), placeholder: t("General farm task"), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#dfe7df] px-3 text-sm font-normal" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Due date"),
                /* @__PURE__ */ jsx("input", { required: true, type: "date", value: reminderForm.dueDate, onChange: (event) => setReminderForm((form) => ({ ...form, dueDate: event.target.value })), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#dfe7df] px-3 text-sm font-normal" })
              ] }),
              /* @__PURE__ */ jsxs("button", { type: "submit", disabled: reminderSaving, className: "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#14804a] px-4 text-sm font-semibold text-white hover:bg-[#0f6b3c] disabled:cursor-wait disabled:opacity-60", children: [
                /* @__PURE__ */ jsx(Plus, { size: 16 }),
                " ",
                reminderSaving ? t("Saving...") : t("Save reminder")
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Upcoming and overdue") }),
              remindersLoading ? /* @__PURE__ */ jsx("p", { role: "status", className: "py-8 text-center text-sm text-[#89958c]", children: t("Loading reminders...") }) : reminders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-10 text-center", children: [
                /* @__PURE__ */ jsx(Bell, { size: 28, className: "mx-auto text-[#8a978f]" }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-semibold", children: t("No reminders yet") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#89958c]", children: t("Your saved tasks will appear here.") })
              ] }) : /* @__PURE__ */ jsx("div", { className: "mt-4 divide-y divide-[#edf0ed]", children: reminders.map((reminder) => {
                const status = reminder.completed ? "Completed" : reminder.dueDate < todayKey ? "Overdue" : reminder.dueDate === todayKey ? "Due today" : "Upcoming";
                return /* @__PURE__ */ jsxs("article", { className: "flex items-start gap-3 py-4 first:pt-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                      /* @__PURE__ */ jsx("h4", { className: `text-sm font-semibold ${reminder.completed ? "text-[#89958c] line-through" : "text-[#263b2d]"}`, children: reminder.title }),
                      /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${status === "Overdue" ? "bg-[#fff1ef] text-[#a93f35]" : status === "Due today" ? "bg-[#fff8e9] text-[#8a681d]" : status === "Completed" ? "bg-[#f0f3f0] text-[#738078]" : "bg-[#eff7ed] text-[#397d4d]"}`, children: t(status) })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#89958c]", children: [
                      reminder.crop && /* @__PURE__ */ jsx("span", { children: t(reminder.crop) }),
                      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx(CalendarDays, { size: 13 }),
                        new Intl.DateTimeFormat(language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" }).format(/* @__PURE__ */ new Date(`${reminder.dueDate}T00:00:00`))
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 gap-1", children: [
                    /* @__PURE__ */ jsx("button", { type: "button", disabled: Boolean(reminderActionId), onClick: () => void setReminderCompleted(reminder, !reminder.completed), "aria-label": t(reminder.completed ? "Reopen" : "Mark complete"), title: t(reminder.completed ? "Reopen" : "Mark complete"), className: "flex h-9 w-9 items-center justify-center rounded-lg text-[#14804a] hover:bg-[#eff7ed] disabled:opacity-40", children: reminder.completed ? /* @__PURE__ */ jsx(Plus, { size: 16 }) : /* @__PURE__ */ jsx(Check, { size: 16 }) }),
                    /* @__PURE__ */ jsx("button", { type: "button", disabled: Boolean(reminderActionId), onClick: () => void deleteReminder(reminder.id), "aria-label": t("Delete reminder"), title: t("Delete reminder"), className: "flex h-9 w-9 items-center justify-center rounded-lg text-[#a93f35] hover:bg-[#fff1ef] disabled:opacity-40", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
                  ] })
                ] }, reminder.id);
              }) })
            ] })
          ] })
        ] }),
        tab === "soil" && /* @__PURE__ */ jsxs("section", { className: "grid gap-5 xl:grid-cols-[1.1fr_0.9fr]", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-7", children: [
            /* @__PURE__ */ jsx(
              SectionPhoto,
              {
                src: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80",
                alt: "Laboratory workspace for testing soil samples",
                className: "mb-5 h-32 overflow-hidden rounded-xl bg-[#eaf3e9]",
                fallback: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-[#3F8757]", children: [
                  /* @__PURE__ */ jsx(FlaskConical, { size: 20 }),
                  " ",
                  t("Soil testing and lab services")
                ] })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef5e8] text-[#678740]", children: /* @__PURE__ */ jsx(FlaskConical, { size: 22 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: t("Book a soil test") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[#7b8980]", children: t("Choose a nearby lab and a time that works for you.") })
              ] })
            ] }),
            bookingToken ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-[#eff8ef] p-6 text-center", children: [
              /* @__PURE__ */ jsx("span", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#14804a]", children: /* @__PURE__ */ jsx(Check, { size: 24 }) }),
              /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-bold text-[#214631]", children: bookingPersisted ? t("Request confirmed") : t("Demo request created") }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[#68796e]", children: bookingPersisted ? t("Your appointment is saved. Show this token at the lab or mention it when arranging pickup.") : t("This demo token is not saved yet. Connect a database to keep appointment records.") }),
              /* @__PURE__ */ jsxs("div", { className: "mx-auto mt-4 max-w-xs rounded-xl border border-[#d5e7d6] bg-white p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-wider text-[#859188]", children: t("Your appointment token") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xl font-bold tracking-wider text-[#14804a]", children: bookingToken })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => setBookingToken(""), className: "mt-5 text-sm font-semibold text-[#14804a]", children: t("Book another test") })
            ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: (event) => void submitBooking(event), className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "text-sm font-semibold", children: [
                  t("Your name"),
                  /* @__PURE__ */ jsx("input", { required: true, value: booking.name, onChange: (event) => setBooking({ ...booking, name: event.target.value }), className: "mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] px-3 font-normal", placeholder: "e.g. Ravi Patil" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "text-sm font-semibold", children: [
                  t("Mobile number"),
                  /* @__PURE__ */ jsx("input", { required: true, inputMode: "numeric", pattern: "[6-9][0-9]{9}", value: booking.phone, onChange: (event) => setBooking({ ...booking, phone: event.target.value }), className: "mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] px-3 font-normal", placeholder: t("10-digit mobile number") })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "text-sm font-semibold", children: [
                  t("Crop to test"),
                  /* @__PURE__ */ jsx("select", { value: booking.crop, onChange: (event) => setBooking({ ...booking, crop: event.target.value }), className: "mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white px-3 font-normal", children: crops.map((crop) => /* @__PURE__ */ jsx("option", { children: t(crop) }, crop)) })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "text-sm font-semibold", children: [
                  t("Preferred date"),
                  /* @__PURE__ */ jsx("input", { required: true, type: "date", min: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), value: booking.date, onChange: (event) => setBooking({ ...booking, date: event.target.value }), className: "mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] px-3 font-normal" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Time slot"),
                /* @__PURE__ */ jsxs("select", { value: booking.slot, onChange: (event) => setBooking({ ...booking, slot: event.target.value }), className: "mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white px-3 font-normal", children: [
                  /* @__PURE__ */ jsx("option", { value: "09:00-11:00", children: "9:00 am \u2013 11:00 am" }),
                  /* @__PURE__ */ jsx("option", { value: "11:00-13:00", children: "11:00 am \u2013 1:00 pm" }),
                  /* @__PURE__ */ jsx("option", { value: "14:00-16:00", children: "2:00 pm \u2013 4:00 pm" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("fieldset", { children: [
                /* @__PURE__ */ jsx("legend", { className: "mb-2 text-sm font-semibold", children: t("How would you like to test?") }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxs("label", { className: `flex min-h-[62px] cursor-pointer items-center gap-3 rounded-xl border px-3 ${booking.visitType === "lab" ? "border-[#7db58a] bg-[#f3f9f2]" : "border-[#e3e9e3]"}`, children: [
                    /* @__PURE__ */ jsx("input", { type: "radio", name: "visitType", value: "lab", checked: booking.visitType === "lab", onChange: (event) => setBooking({ ...booking, visitType: event.target.value }), className: "accent-[#14804a]" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      /* @__PURE__ */ jsx("span", { className: "block text-sm font-semibold", children: t("Visit the lab") }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-[#8b978e]", children: t("Bring your soil sample") })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("label", { className: `flex min-h-[62px] cursor-pointer items-center gap-3 rounded-xl border px-3 ${booking.visitType === "pickup" ? "border-[#7db58a] bg-[#f3f9f2]" : "border-[#e3e9e3]"}`, children: [
                    /* @__PURE__ */ jsx("input", { type: "radio", name: "visitType", value: "pickup", checked: booking.visitType === "pickup", onChange: (event) => setBooking({ ...booking, visitType: event.target.value }), className: "accent-[#14804a]" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      /* @__PURE__ */ jsx("span", { className: "block text-sm font-semibold", children: t("Sample pickup") }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-[#8b978e]", children: t("Lab will confirm availability") })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Soil testing lab"),
                /* @__PURE__ */ jsx("input", { required: true, list: "nearby-lab-options", value: booking.lab, onChange: (event) => setBooking({ ...booking, lab: event.target.value }), className: "mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] px-3 font-normal", placeholder: nearbyLabs.length ? t("Choose a nearby lab or enter a lab name") : t("Enter a soil testing lab name") }),
                /* @__PURE__ */ jsx("datalist", { id: "nearby-lab-options", children: nearbyLabs.map((lab) => /* @__PURE__ */ jsxs("option", { value: lab.name, children: [
                  lab.distanceKm,
                  " km away"
                ] }, lab.id)) })
              ] }),
              bookingError && /* @__PURE__ */ jsx("p", { role: "alert", className: "text-sm text-[#b54136]", children: bookingError }),
              /* @__PURE__ */ jsxs("button", { type: "submit", className: "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#14804a] text-sm font-semibold text-white hover:bg-[#0f6b3c]", children: [
                t("Request appointment"),
                " ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "font-bold", children: t("Nearby soil labs") }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#8a978f]", children: [
                    /* @__PURE__ */ jsx(MapPin, { size: 12, className: "mr-1 inline" }),
                    farmLocation
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("select", { "aria-label": t("Lab search radius"), value: labRadius, onChange: (event) => setLabRadius(Number(event.target.value)), className: "min-h-10 rounded-lg border border-[#e4eae4] bg-white px-2 text-xs", children: [
                    /* @__PURE__ */ jsx("option", { value: 1e4, children: "10 km" }),
                    /* @__PURE__ */ jsx("option", { value: 25e3, children: "25 km" }),
                    /* @__PURE__ */ jsx("option", { value: 5e4, children: "50 km" })
                  ] }),
                  /* @__PURE__ */ jsxs("button", { onClick: () => void loadNearbyLabs(farmCoordinates, labRadius), className: "flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]", "aria-label": t("Refresh nearby labs"), children: [
                    /* @__PURE__ */ jsx(Activity, { size: 15 }),
                    " ",
                    t("Refresh")
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-[11px] text-[#8a978f]", children: t("OpenStreetMap nearby-place results \xB7 ordered by distance") }),
              labsLoading && /* @__PURE__ */ jsx("p", { role: "status", className: "mt-4 rounded-xl bg-[#f7f9f6] p-4 text-sm text-[#69786f]", children: t("Looking for agriculture and soil-testing facilities near your farm...") }),
              labsError && /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-xl bg-[#fff8e9] p-4", children: /* @__PURE__ */ jsx("p", { role: "alert", className: "text-sm text-[#755c2d]", children: labsError }) }),
              !labsLoading && !labsError && nearbyLabs.length === 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl bg-[#f7f9f6] p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: t("No soil-testing facilities were listed nearby.") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-5 text-[#7d8a81]", children: t("Map listings may be incomplete. Search a wider area or check the map for local government and university labs.") })
              ] }),
              !labsLoading && nearbyLabs.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: nearbyLabs.map((lab) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#edf0ed] p-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f7ef] text-[#14804a]", children: /* @__PURE__ */ jsx(MapPin, { size: 17 }) }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: lab.name }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#89958c]", children: lab.address || t("Address not listed") }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#78867d]", children: [
                      lab.distanceKm,
                      " ",
                      t("km away"),
                      " \xB7 ",
                      lab.source
                    ] }),
                    lab.phone && /* @__PURE__ */ jsx("a", { href: `tel:${lab.phone}`, className: "mt-1 block text-xs text-[#14804a]", children: lab.phone })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f2f0] pt-3", children: [
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setBooking((current) => ({ ...current, lab: lab.name })), className: "min-h-9 rounded-lg bg-[#f1f7ef] px-3 text-xs font-semibold text-[#14804a] hover:bg-[#e7f2e7]", children: t("Select for booking") }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxs("a", { href: lab.mapUrl, target: "_blank", rel: "noreferrer", className: "flex min-h-9 items-center gap-1 text-xs font-semibold text-[#14804a]", children: [
                      t("Map"),
                      " ",
                      /* @__PURE__ */ jsx(ExternalLink, { size: 12 })
                    ] }),
                    /* @__PURE__ */ jsxs("a", { href: lab.directionsUrl, target: "_blank", rel: "noreferrer", className: "flex min-h-9 items-center gap-1 text-xs font-semibold text-[#14804a]", children: [
                      t("Directions"),
                      " ",
                      /* @__PURE__ */ jsx(ExternalLink, { size: 12 })
                    ] })
                  ] })
                ] })
              ] }, lab.id)) }),
              /* @__PURE__ */ jsxs("a", { href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`soil testing lab agricultural laboratory near ${farmLocation}`)}`, target: "_blank", rel: "noreferrer", className: "mt-4 flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#e4eae4] text-xs font-semibold text-[#14804a] hover:bg-[#f8faf7]", children: [
                t("Search soil labs on Google Maps"),
                " ",
                /* @__PURE__ */ jsx(ExternalLink, { size: 13 })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-[10px] leading-4 text-[#929e95]", children: t("Listings come from OpenStreetMap and may be incomplete or unverified. Call the facility to confirm soil testing services and availability.") })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-[#f0f6e9] p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#688442]", children: /* @__PURE__ */ jsx(BookOpen, { size: 18 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#38522c]", children: t("Why test your soil?") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-5 text-[#6f7e60]", children: t("A soil test measures pH and nutrients so you can make informed fertilizer choices and avoid unnecessary inputs. Ask the lab for a soil health card with your results.") })
              ] })
            ] }) })
          ] })
        ] }),
        tab === "market" && /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: t("Mandi market insights") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[#7b8980]", children: t("Search mandi prices for multiple crops across India.") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#eff6ec] px-3 py-1.5 text-xs font-semibold text-[#527342]", children: marketSource === "sample" ? t("Expanded sample data") : t("Data.gov.in live") }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#7b8980]", children: [
                marketTotal.toLocaleString("en-IN"),
                " ",
                t("results")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Find crop prices") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8a978f]", children: t("Filter by commodity and mandi location. Leave blank to browse all available records.") })
              ] }),
              /* @__PURE__ */ jsx(Search, { size: 18, className: "text-[#14804a]" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-5", children: [
              /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-[#68766d]", children: [
                t("State"),
                /* @__PURE__ */ jsxs("select", { value: marketFilterState, onChange: (event) => {
                  setMarketFilterState(event.target.value);
                  setMarketFilterCrop("");
                  setMarketFilterDistrict("");
                  setMarketFilterMarket("");
                  setMarketPage(0);
                }, className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] bg-white px-3 text-sm font-normal", children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: t("All states") }),
                  (marketOptions.states.length ? marketOptions.states : indianStates).map((state) => /* @__PURE__ */ jsx("option", { children: state }, state))
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-[#68766d]", children: [
                t("Crop"),
                /* @__PURE__ */ jsxs("select", { value: marketFilterCrop, onChange: (event) => {
                  setMarketFilterCrop(event.target.value);
                  setMarketPage(0);
                }, disabled: marketOptionsLoading || marketOptions.crops.length === 0, className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] bg-white px-3 text-sm font-normal disabled:bg-[#f5f7f4]", children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: t("All crops") }),
                  marketOptions.crops.map((crop) => /* @__PURE__ */ jsx("option", { children: t(crop) }, crop))
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-[#68766d]", children: [
                t("District"),
                /* @__PURE__ */ jsxs("select", { value: marketFilterDistrict, onChange: (event) => {
                  setMarketFilterDistrict(event.target.value);
                  setMarketFilterMarket("");
                  setMarketPage(0);
                }, disabled: !marketFilterState || marketOptionsLoading || marketOptions.districts.length === 0, className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] bg-white px-3 text-sm font-normal disabled:bg-[#f5f7f4]", children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: marketFilterState ? t("All districts") : t("Select a state first") }),
                  marketOptions.districts.map((district) => /* @__PURE__ */ jsx("option", { children: district }, district))
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-[#68766d]", children: [
                t("Mandi"),
                /* @__PURE__ */ jsxs("select", { value: marketFilterMarket, onChange: (event) => {
                  setMarketFilterMarket(event.target.value);
                  setMarketPage(0);
                }, disabled: !marketFilterState || marketOptionsLoading || availableMandis.length === 0, className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] bg-white px-3 text-sm font-normal disabled:bg-[#f5f7f4]", children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: marketFilterDistrict ? t("All mandis in district") : marketFilterState ? t("All mandis in state") : t("Select a state first") }),
                  availableMandis.map((market) => /* @__PURE__ */ jsx("option", { children: market }, market))
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-[#68766d]", children: [
                t("Search all fields"),
                /* @__PURE__ */ jsx("input", { value: marketSearch, onChange: (event) => {
                  setMarketSearch(event.target.value);
                  setMarketPage(0);
                }, placeholder: t("Crop, variety, location..."), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] px-3 text-sm font-normal" })
              ] })
            ] }),
            marketOptionsError && /* @__PURE__ */ jsx("p", { role: "alert", className: "mt-3 text-xs text-[#a93f35]", children: marketOptionsError }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#89958c]", children: marketOptionsLoading ? t("Loading available crops, districts, and mandis...") : marketFilterState ? t("Crop and district options for {state}; mandis follow the selected district.").replace("{state}", marketFilterState) : t("Select a state to narrow the crop, district, and mandi options.") }),
              /* @__PURE__ */ jsx("button", { onClick: () => {
                setMarketFilterCrop("");
                setMarketFilterState("");
                setMarketFilterDistrict("");
                setMarketFilterMarket("");
                setMarketSearch("");
                setMarketPage(0);
              }, className: "min-h-9 shrink-0 rounded-lg px-2 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]", children: t("Clear all filters") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid items-start gap-5 xl:grid-cols-[0.85fr_1.15fr]", children: [
            /* @__PURE__ */ jsxs("form", { onSubmit: (event) => void savePriceAlert(event), className: "space-y-4 rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Create a price alert") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#89958c]", children: t("Choose a market record and target price.") })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-xs font-semibold text-[#68766d]", children: [
                t("Selected market record"),
                /* @__PURE__ */ jsxs("select", { value: marketFocus, onChange: (event) => setMarketFocus(event.target.value), disabled: marketRecords.length === 0, className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] bg-white px-3 text-sm font-normal disabled:bg-[#f5f7f4]", children: [
                  marketRecords.length === 0 && /* @__PURE__ */ jsx("option", { value: "", children: t("No matching mandi records.") }),
                  marketRecords.map((record) => /* @__PURE__ */ jsxs("option", { value: marketKey(record), children: [
                    t(record.crop),
                    " \xB7 ",
                    record.market,
                    ", ",
                    record.state,
                    " \xB7 ",
                    money(record.price)
                  ] }, marketKey(record)))
                ] })
              ] }),
              marketRecord && /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#78867d]", children: [
                t("Current price"),
                ": ",
                money(marketRecord.price),
                " / ",
                t("per quintal")
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-xs font-semibold text-[#68766d]", children: [
                t("Alert direction"),
                /* @__PURE__ */ jsxs("select", { value: priceAlertDirection, onChange: (event) => setPriceAlertDirection(event.target.value), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] bg-white px-3 text-sm font-normal", children: [
                  /* @__PURE__ */ jsx("option", { value: "ABOVE", children: t("At or above") }),
                  /* @__PURE__ */ jsx("option", { value: "BELOW", children: t("At or below") })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-xs font-semibold text-[#68766d]", children: [
                t("Target price (\u20B9 per quintal)"),
                /* @__PURE__ */ jsx("input", { required: true, type: "number", min: "1", max: "10000000", step: "1", value: priceAlertTarget, onChange: (event) => setPriceAlertTarget(event.target.value), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e2e9e2] px-3 text-sm font-normal" })
              ] }),
              /* @__PURE__ */ jsxs("button", { type: "submit", disabled: priceAlertSaving || !marketRecord, className: "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#14804a] px-4 text-sm font-semibold text-white hover:bg-[#0f6b3c] disabled:cursor-wait disabled:opacity-60", children: [
                /* @__PURE__ */ jsx(Bell, { size: 16 }),
                " ",
                priceAlertSaving ? t("Saving...") : t("Save price alert")
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Your saved alerts") }),
                /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#eff7ed] px-2.5 py-1 text-[11px] font-semibold text-[#397d4d]", children: priceAlerts.length })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-5 text-[#89958c]", children: t("Create alerts from the current market list. Alerts are checked when matching prices are loaded; they do not send phone notifications.") }),
              priceAlertError && /* @__PURE__ */ jsx("p", { role: "alert", className: "mt-3 text-sm text-[#b54136]", children: priceAlertError }),
              priceAlertsLoading ? /* @__PURE__ */ jsx("p", { role: "status", className: "py-8 text-center text-sm text-[#89958c]", children: t("Loading price alerts...") }) : priceAlerts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-8 text-center", children: [
                /* @__PURE__ */ jsx(Bell, { size: 24, className: "mx-auto text-[#8a978f]" }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-semibold", children: t("No price alerts yet") })
              ] }) : /* @__PURE__ */ jsx("div", { className: "mt-3 divide-y divide-[#edf0ed]", children: priceAlerts.map((alert) => {
                const quote = marketRecords.find((record) => matchesPriceAlert(alert, record));
                const triggered = quote ? alert.direction === "ABOVE" ? quote.price >= alert.targetPrice : quote.price <= alert.targetPrice : false;
                const status = quote ? triggered ? "Triggered" : "Not reached" : "No matching quote is loaded right now.";
                return /* @__PURE__ */ jsxs("article", { className: "flex items-start gap-3 py-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                      /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold", children: [
                        t(alert.crop),
                        " \xB7 ",
                        alert.market
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${triggered ? "bg-[#eff7ed] text-[#397d4d]" : status === "Not reached" ? "bg-[#f3f5f3] text-[#718077]" : "bg-[#fff8e9] text-[#8a681d]"}`, children: t(status) })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#89958c]", children: [
                      alert.district ? `${alert.district}, ` : "",
                      alert.state,
                      " \xB7 ",
                      alert.variety
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#68766d]", children: [
                      alert.direction === "ABOVE" ? t("At or above") : t("At or below"),
                      " ",
                      money(alert.targetPrice),
                      " / ",
                      t("per quintal")
                    ] }),
                    quote && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs font-medium text-[#526359]", children: [
                      t("Current price"),
                      ": ",
                      money(quote.price)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("button", { type: "button", disabled: Boolean(priceAlertDeletingId), onClick: () => void deletePriceAlert(alert.id), "aria-label": t("Remove price alert"), title: t("Remove price alert"), className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#a93f35] hover:bg-[#fff1ef] disabled:opacity-40", children: /* @__PURE__ */ jsx(X, { size: 15 }) })
                ] }, alert.id);
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[1.45fr_0.8fr]", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Price trend") }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8a978f]", children: t("Recent mandi modal price \xB7 \u20B9 per quintal") })
                ] }),
                /* @__PURE__ */ jsx("select", { "aria-label": t("Choose crop and mandi for price trend"), value: marketRecord ? marketKey(marketRecord) : "", onChange: (event) => setMarketFocus(event.target.value), className: "min-h-10 max-w-full rounded-lg border border-[#e4eae4] bg-white px-3 text-sm", children: marketRecords.map((record) => /* @__PURE__ */ jsxs("option", { value: marketKey(record), children: [
                  t(record.crop),
                  " \u2014 ",
                  record.market,
                  ", ",
                  record.state
                ] }, marketKey(record))) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-6 h-[255px] w-full", children: marketTrendLoading ? /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-sm text-[#87938a]", children: t("Loading mandi trend...") }) : marketRecord && chartData.length > 0 ? /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: chartData, margin: { top: 8, right: 8, left: -15, bottom: 0 }, children: [
                /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "priceFill", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#14804a", stopOpacity: 0.18 }),
                  /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#14804a", stopOpacity: 0 })
                ] }) }),
                /* @__PURE__ */ jsx(CartesianGrid, { stroke: "#edf1ed", strokeDasharray: "4 4", vertical: false }),
                /* @__PURE__ */ jsx(XAxis, { dataKey: "day", axisLine: false, tickLine: false, tick: { fill: "#89958c", fontSize: 11 } }),
                /* @__PURE__ */ jsx(YAxis, { axisLine: false, tickLine: false, tick: { fill: "#89958c", fontSize: 11 }, tickFormatter: (value) => `\u20B9${value}` }),
                /* @__PURE__ */ jsx(Tooltip, { formatter: (value) => [money(Number(value)), t("Modal price")], contentStyle: { borderRadius: 12, borderColor: "#e8eee8", fontSize: 12 } }),
                /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "price", stroke: "#14804a", strokeWidth: 2.5, fill: "url(#priceFill)" })
              ] }) }) : /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-sm text-[#87938a]", children: t("Price history is not available for this record.") }) }),
              marketRecord && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2 border-t border-[#edf0ed] pt-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#8a978f]", children: t("Modal price") }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 font-bold", children: money(marketRecord.price) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#8a978f]", children: t("Today's change") }),
                  /* @__PURE__ */ jsxs("p", { className: `mt-1 font-bold ${marketRecord.change >= 0 ? "text-[#258654]" : "text-[#c05948]"}`, children: [
                    marketRecord.change >= 0 ? "+" : "",
                    marketRecord.change,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#8a978f]", children: t("Market") }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 truncate font-bold", children: marketRecord.market })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0f7ee] text-[#14804a]", children: /* @__PURE__ */ jsx(Activity, { size: 18 }) }),
                  /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Market outlook") })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl bg-[#f2f8f0] p-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#3a7d4d]", children: t("WATCH THE MARKET") }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-6 text-[#5f7165]", children: marketRecord?.change && marketRecord.change > 2 ? t("{crop} prices are up recently in {market}. Compare nearby markets and storage costs before deciding when to sell.").replace("{crop}", t(marketRecord.crop)).replace("{market}", marketRecord.market) : t("{crop} prices are moving gradually. Check arrivals and local prices again before making a sale decision.").replace("{crop}", t(marketRecord?.crop ?? "Crop")) })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-[11px] leading-5 text-[#89958c]", children: t("This is a simple trend summary, not a guaranteed forecast. Prices can change quickly and vary by quality and market.") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Markets on this page") }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8a978f]", children: t("Select any crop and mandi for the chart") })
                  ] }),
                  /* @__PURE__ */ jsx(Search, { size: 18, className: "text-[#14804a]" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 max-h-[260px] space-y-1 overflow-y-auto", children: [
                  filteredRecords.slice(0, 30).map((record) => /* @__PURE__ */ jsxs("button", { onClick: () => setMarketFocus(marketKey(record)), className: `flex min-h-12 w-full items-center justify-between gap-2 rounded-lg px-2 text-left hover:bg-[#f7f9f6] ${marketFocus === marketKey(record) ? "bg-[#f2f8f0]" : ""}`, children: [
                    /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxs("span", { className: "block truncate text-sm font-semibold", children: [
                        t(record.crop),
                        " \xB7 ",
                        record.market
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-[#89958c]", children: [
                        record.district ? `${record.district}, ` : "",
                        record.state
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "shrink-0 text-sm font-bold", children: money(record.price) })
                  ] }, marketKey(record))),
                  filteredRecords.length === 0 && !marketLoading && /* @__PURE__ */ jsx("p", { className: "py-4 text-center text-xs text-[#89958c]", children: t("No matching mandi records.") })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Mandi rates across India") }),
                /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#8a978f]", children: [
                  t("Showing"),
                  " ",
                  marketTotal === 0 ? 0 : marketPage * marketLimit + 1,
                  "\u2013",
                  Math.min((marketPage + 1) * marketLimit, marketTotal),
                  " ",
                  t("of"),
                  " ",
                  marketTotal.toLocaleString("en-IN"),
                  " ",
                  t("records"),
                  " \xB7 \u20B9 ",
                  t("per quintal")
                ] })
              ] }),
              /* @__PURE__ */ jsxs("button", { onClick: () => void loadMarkets({ crop: marketFilterCrop, state: marketFilterState, district: marketFilterDistrict, market: marketFilterMarket, search: marketSearch, offset: marketPage * marketLimit }), className: "flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-[#14804a] hover:bg-[#f4f8f3]", children: [
                /* @__PURE__ */ jsx(Activity, { size: 15 }),
                " ",
                t("Refresh")
              ] })
            ] }),
            marketSource === "sample" && /* @__PURE__ */ jsx("p", { className: "mb-4 rounded-xl bg-[#fff8e9] p-3 text-xs leading-5 text-[#755c2d]", children: t("These are sample prices for demonstration, not live mandi quotes. Add Data.gov.in API credentials to see official records. The sample directory covers 16 crops across 18 markets and states.") }),
            marketError && /* @__PURE__ */ jsx("p", { role: "alert", className: "mb-4 rounded-xl bg-[#fff1ef] p-3 text-sm text-[#a93f35]", children: marketError }),
            /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
              /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[760px] text-left text-sm", children: [
                /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#edf0ed] text-[11px] uppercase tracking-wide text-[#8a978f]", children: [
                  /* @__PURE__ */ jsx("th", { className: "pb-3 font-semibold", children: t("Crop & variety") }),
                  /* @__PURE__ */ jsx("th", { className: "pb-3 font-semibold", children: t("Mandi") }),
                  /* @__PURE__ */ jsx("th", { className: "pb-3 font-semibold", children: t("District") }),
                  /* @__PURE__ */ jsx("th", { className: "pb-3 font-semibold", children: t("State") }),
                  /* @__PURE__ */ jsx("th", { className: "pb-3 text-right font-semibold", children: t("Modal price") }),
                  /* @__PURE__ */ jsx("th", { className: "pb-3 text-right font-semibold", children: t("Change") })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { children: filteredRecords.map((record) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#f1f3f1] last:border-0", children: [
                  /* @__PURE__ */ jsxs("td", { className: "py-3.5", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: t(record.crop) }),
                    /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-[#89958c]", children: record.variety })
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "py-3.5 text-[#69786f]", children: record.market }),
                  /* @__PURE__ */ jsx("td", { className: "py-3.5 text-[#69786f]", children: record.district || "\u2014" }),
                  /* @__PURE__ */ jsx("td", { className: "py-3.5 text-[#69786f]", children: record.state }),
                  /* @__PURE__ */ jsx("td", { className: "py-3.5 text-right font-semibold", children: money(record.price) }),
                  /* @__PURE__ */ jsxs("td", { className: `py-3.5 text-right font-medium ${record.change >= 0 ? "text-[#258654]" : "text-[#c05948]"}`, children: [
                    record.change >= 0 ? "+" : "",
                    record.change,
                    "%"
                  ] })
                ] }, marketKey(record))) })
              ] }),
              marketLoading && /* @__PURE__ */ jsx("p", { role: "status", className: "py-8 text-center text-sm text-[#89958c]", children: t("Loading mandi rates...") }),
              filteredRecords.length === 0 && !marketLoading && /* @__PURE__ */ jsx("p", { className: "py-8 text-center text-sm text-[#89958c]", children: t("No mandi records match these filters. Try clearing a filter or selecting another crop.") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0ed] pt-4", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#8a978f]", children: [
                t("Page"),
                " ",
                marketPage + 1,
                " ",
                t("of"),
                " ",
                Math.max(1, Math.ceil(marketTotal / marketLimit))
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("button", { disabled: marketPage === 0 || marketLoading, onClick: () => setMarketPage((page) => Math.max(0, page - 1)), className: "min-h-10 rounded-lg border border-[#e3e9e3] px-4 text-xs font-semibold text-[#526359] disabled:opacity-40", children: t("Previous") }),
                /* @__PURE__ */ jsx("button", { disabled: (marketPage + 1) * marketLimit >= marketTotal || marketLoading, onClick: () => setMarketPage((page) => page + 1), className: "min-h-10 rounded-lg border border-[#e3e9e3] px-4 text-xs font-semibold text-[#526359] disabled:opacity-40", children: t("Next") })
              ] })
            ] })
          ] })
        ] }),
        tab === "efficiency" && /* @__PURE__ */ jsxs("section", { className: "grid gap-5 xl:grid-cols-[1fr_0.85fr]", children: [
          /* @__PURE__ */ jsxs("div", { className: "planner-photo relative overflow-hidden rounded-2xl p-5 text-white sm:col-span-2 sm:p-7", children: [
            /* @__PURE__ */ jsx(
              SectionPhoto,
              {
                src: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1600&q=80",
                alt: "Farmer working among crops in a green field",
                className: "absolute inset-0",
                fallback: /* @__PURE__ */ jsx("span", { className: "text-[#245C3A]", children: /* @__PURE__ */ jsx(Sprout, { size: 30 }) })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "planner-photo-overlay absolute inset-0" }),
            /* @__PURE__ */ jsxs("div", { className: "relative max-w-xl", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.14em] text-white/80", children: t("Farm planner") }),
              /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold sm:text-3xl", children: t("Plan with your field in mind") }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-white/85", children: t("Estimate inputs, check the forecast, and keep practical field notes together.") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-7", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff6e9] text-[#658442]", children: /* @__PURE__ */ jsx(Sprout, { size: 22 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: t("Field input calculator") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[#7b8980]", children: t("Estimate amounts from your own per-acre recommendation.") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-7 space-y-6", children: [
              /* @__PURE__ */ jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-between text-sm font-semibold", children: [
                  /* @__PURE__ */ jsx("span", { children: t("Farm area") }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[#14804a]", children: [
                    acres,
                    " ",
                    t("acres")
                  ] })
                ] }),
                /* @__PURE__ */ jsx("input", { type: "range", min: "0.5", max: "50", step: "0.5", value: acres, onChange: (event) => setAcres(Number(event.target.value)), className: "mt-4 w-full accent-[#14804a]" }),
                /* @__PURE__ */ jsxs("span", { className: "mt-1 flex justify-between text-[11px] text-[#89958c]", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    "0.5 ",
                    t("acre")
                  ] }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "50 ",
                    t("acres")
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Fertilizer recommendation per acre (kg)"),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex min-h-12 items-center rounded-xl border border-[#dfe7df]", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setFertilizerRate(Math.max(1, fertilizerRate - 5)), className: "flex h-11 w-12 items-center justify-center text-[#69786f]", "aria-label": t("Reduce fertilizer rate"), children: /* @__PURE__ */ jsx(Minus, { size: 16 }) }),
                  /* @__PURE__ */ jsx("input", { type: "number", min: "1", value: fertilizerRate, onChange: (event) => setFertilizerRate(Math.max(0, Number(event.target.value))), className: "min-w-0 flex-1 text-center font-semibold outline-none" }),
                  /* @__PURE__ */ jsx("span", { className: "pr-3 text-xs text-[#89958c]", children: t("kg / acre") }),
                  /* @__PURE__ */ jsx("button", { onClick: () => setFertilizerRate(fertilizerRate + 5), className: "flex h-11 w-12 items-center justify-center text-[#69786f]", "aria-label": t("Increase fertilizer rate"), children: /* @__PURE__ */ jsx(Plus, { size: 16 }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
                t("Input type"),
                /* @__PURE__ */ jsxs("select", { className: "mt-2 min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white px-3 text-sm font-normal", children: [
                  /* @__PURE__ */ jsx("option", { children: t("NPK fertilizer") }),
                  /* @__PURE__ */ jsx("option", { children: t("Compost / organic manure") }),
                  /* @__PURE__ */ jsx("option", { children: t("Seed quantity") })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-7 rounded-2xl bg-[#eff7ed] p-5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-[#71856b]", children: t("Estimated quantity for your farm") }),
              /* @__PURE__ */ jsxs("p", { className: "mt-2 text-3xl font-bold text-[#1e633b]", children: [
                (acres * fertilizerRate).toLocaleString("en-IN"),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-base font-semibold", children: t("kg") })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#768674]", children: [
                t("Based on"),
                " ",
                fertilizerRate,
                " kg ",
                t("per acre"),
                " \xD7 ",
                acres,
                " ",
                t("acres")
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs leading-5 text-[#89958c]", children: t("Use the rate recommended for your crop and soil test. This calculator estimates total quantity only; it does not replace agronomic advice.") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Plan around the forecast") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8a978f]", children: t("A few simple reminders for your fields.") }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: [{ icon: CloudRain, title: "Check rain before spraying", desc: "Rain can wash treatments off leaves. Follow the product label.", tint: "text-[#55849e] bg-[#eef6f8]" }, { icon: Droplets, title: "Check soil moisture", desc: "Avoid watering if the soil is still moist below the surface.", tint: "text-[#4c88a1] bg-[#eef6f8]" }, { icon: FileText, title: "Keep a field record", desc: "Note what you used and when to plan your next crop cycle.", tint: "text-[#8c7940] bg-[#fbf7e9]" }].map(({ icon: Icon, title, desc, tint }) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 rounded-xl bg-[#fafbf9] p-3", children: [
                /* @__PURE__ */ jsx("span", { className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tint}`, children: /* @__PURE__ */ jsx(Icon, { size: 17 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: t(title) }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-5 text-[#829087]", children: t(desc) })
                ] })
              ] }, title)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Activity, { size: 18, className: "text-[#14804a]" }),
                /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("Field efficiency checklist") })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8a978f]", children: t("A practical starting point, not a farm score.") }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: ["Soil test completed for this season", "Irrigation checked against rainfall", "Input amounts recorded by field", "Crop rotation planned after harvest"].map((item) => /* @__PURE__ */ jsxs("label", { className: "flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[#58695e]", children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", className: "h-4 w-4 accent-[#14804a]" }),
                t(item)
              ] }, item)) })
            ] })
          ] })
        ] }),
        tab === "shop" && /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-2xl", children: [
            /* @__PURE__ */ jsx(
              SectionPhoto,
              {
                src: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1500&q=80",
                alt: "Fresh crops in a sunlit agricultural field",
                className: "absolute inset-0",
                fallback: /* @__PURE__ */ jsx(ShoppingBag, { size: 32, className: "text-[#3F8554]" })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "shop-photo-overlay absolute inset-0" }),
            /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-44 flex-wrap items-end justify-between gap-4 p-5 text-white sm:min-h-52 sm:p-7", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.14em] text-white/80", children: t("For your next growing season") }),
                /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold sm:text-3xl", children: t("Farm essentials") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-xl text-sm text-white/85", children: t("Browse a small demo catalog of common farm supplies.") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-white/25 bg-white/15 px-3 py-2 text-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ jsx(ShoppingBag, { size: 17 }),
                " ",
                t("Basket"),
                " ",
                /* @__PURE__ */ jsx("span", { className: "rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#245C3A]", children: cartCount })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3", children: [
            { title: "Certified wheat seeds", details: "HD 2967 \xB7 40 kg bag", price: 1850, tag: "Popular", icon: Sprout, photo: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=900&q=80", alt: "Green crop rows for seed growing" },
            { title: "Neem-based bio-fertilizer", details: "Organic \xB7 5 litre pack", price: 690, tag: "Organic", icon: Leaf, photo: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80", alt: "Healthy crops in a green field" },
            { title: "Drip irrigation starter kit", details: "For up to 1 acre", price: 4290, tag: "Save 12%", icon: Droplets, photo: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80", alt: "Irrigation channels between crop rows" }
          ].map(({ title, details, price, tag, icon: Icon, photo, alt }) => /* @__PURE__ */ jsxs("article", { className: "overflow-hidden rounded-2xl border border-[#e8eee8] bg-white", children: [
            /* @__PURE__ */ jsx(SectionPhoto, { src: photo, alt, className: "h-40 bg-[#EAF2E6]", fallback: /* @__PURE__ */ jsx(Icon, { size: 44, strokeWidth: 1.4, className: "text-[#3F8554]" }) }),
            /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#f5f7f3] px-2.5 py-1 text-[10px] font-semibold text-[#718077]", children: t(tag) }),
              /* @__PURE__ */ jsx("h3", { className: "mt-3 font-bold", children: t(title) }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#89958c]", children: t(details) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg font-bold", children: money(price) }),
                /* @__PURE__ */ jsxs("button", { onClick: () => setCartCount((count) => count + 1), className: "flex min-h-10 items-center gap-1.5 rounded-lg bg-[#14804a] px-3 text-xs font-semibold text-white hover:bg-[#0f6b3c]", children: [
                  /* @__PURE__ */ jsx(Plus, { size: 15 }),
                  " ",
                  t("Add to basket")
                ] })
              ] })
            ] })
          ] }, title)) }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-[#d9e5d9] bg-[#f5f9f3] p-5 text-center", children: [
            /* @__PURE__ */ jsx(Package, { size: 22, className: "mx-auto text-[#71966e]" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold", children: t("Community buying is coming soon") }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#849187]", children: t("Group orders and local supplier listings will be available here.") })
          ] })
        ] }),
        tab === "schemes" && /* @__PURE__ */ jsx(GovernmentSchemesPanel, { language })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: () => setAssistantOpen((open) => !open), className: "fixed bottom-5 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-[#14804a] px-4 text-sm font-semibold text-white shadow-lg shadow-[#145b3c]/20 hover:bg-[#0f6b3c]", "aria-label": t("Open AI farm assistant"), children: [
      /* @__PURE__ */ jsx(Mic, { size: 19 }),
      /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: t("Ask an agronomist") })
    ] }),
    assistantOpen && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-[88px] right-4 z-40 flex h-[min(560px,calc(100vh-120px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[#e3eae3] bg-white shadow-2xl sm:right-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-[#176c43] px-4 py-3.5 text-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-white/15", children: /* @__PURE__ */ jsx(Sprout, { size: 19 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", children: t("Farm assistant") }),
            /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-[10px] text-white/70", children: t("Agriculture information, made simple") })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setAssistantOpen(false), className: "rounded-lg p-2 hover:bg-white/10", "aria-label": t("Close assistant"), children: /* @__PURE__ */ jsx(X, { size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "scrollbar-none flex-1 space-y-3 overflow-y-auto bg-[#f8faf7] p-4", children: [
        chatMessages.map((message, index) => /* @__PURE__ */ jsx("div", { className: `max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${message.role === "user" ? "ml-auto rounded-br-sm bg-[#14804a] text-white" : "rounded-bl-sm border border-[#e8eee8] bg-white text-[#526359]"}`, children: message.text }, `${message.role}-${index}`)),
        chatLoading && /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-white px-3 py-2 text-xs text-[#839087]", children: t("Thinking...") })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: (event) => void sendQuestion(event), className: "flex items-center gap-2 border-t border-[#edf0ed] bg-white p-3", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: startVoiceInput, className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f7f1] text-[#14804a]", "aria-label": t("Speak your question"), children: /* @__PURE__ */ jsx(Mic, { size: 17 }) }),
        /* @__PURE__ */ jsx("input", { value: question, onChange: (event) => setQuestion(event.target.value), placeholder: t("Ask about your crops..."), maxLength: 1e3, className: "min-w-0 flex-1 text-sm outline-none" }),
        /* @__PURE__ */ jsx("button", { disabled: !question.trim() || chatLoading, className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#14804a] text-white disabled:opacity-40", "aria-label": t("Send question"), children: /* @__PURE__ */ jsx(Send, { size: 16 }) })
      ] })
    ] }),
    showOnboarding && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-[#152b20]/45 p-4", role: "dialog", "aria-modal": "true", "aria-labelledby": "onboarding-title", children: /* @__PURE__ */ jsxs("form", { onSubmit: saveProfile, className: "max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            SectionPhoto,
            {
              src: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1200&q=80",
              alt: "Farmer standing among green crops",
              className: "mb-5 h-32 w-full overflow-hidden rounded-xl bg-[#EAF2E6] sm:h-40",
              fallback: /* @__PURE__ */ jsx(Sprout, { size: 28, className: "text-[#3F8554]" })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5eb] text-[#14804a]", children: /* @__PURE__ */ jsx(Sprout, { size: 22 }) }),
          /* @__PURE__ */ jsx("h2", { id: "onboarding-title", className: "mt-4 text-xl font-bold", children: t("Your farm details") }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-5 text-[#7b8980]", children: t("Choose your state, district and village to get local weather.") })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowOnboarding(false), className: "rounded-lg p-2 text-[#89958c] hover:bg-[#f5f7f4]", "aria-label": t("Close farm profile"), children: /* @__PURE__ */ jsx(X, { size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-4", children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
          t("Your name"),
          /* @__PURE__ */ jsx("input", { value: onboardName, onChange: (event) => setOnboardName(event.target.value), placeholder: farmerName, className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e0e7e0] px-3 text-sm font-normal" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
          t("State / union territory"),
          /* @__PURE__ */ jsx("select", { value: onboardState, onChange: (event) => {
            setOnboardState(event.target.value);
            setDistrictInput("");
            setSelectedDistrict("");
            setSelectedDistrictPlace(null);
            setDistrictResults([]);
            setVillageInput("");
            setSelectedVillage(null);
            setVillageResults([]);
            setLocationError("");
          }, className: "mt-1.5 min-h-12 w-full rounded-xl border border-[#e0e7e0] bg-white px-3 text-sm font-normal", children: indianStates.map((state) => /* @__PURE__ */ jsx("option", { children: state }, state)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "farm-district", className: "block text-sm font-semibold", children: t("District") }),
          /* @__PURE__ */ jsx("input", { id: "farm-district", required: true, autoComplete: "off", value: districtInput, onChange: (event) => {
            setDistrictInput(event.target.value);
            setSelectedDistrict("");
            setSelectedDistrictPlace(null);
            setDistrictResults([]);
            setVillageInput("");
            setSelectedVillage(null);
            setLocationError("");
          }, className: "mt-1.5 min-h-12 w-full rounded-xl border border-[#e0e7e0] px-3 text-sm font-normal", placeholder: t("Type a district or nearby town") }),
          districtLoading && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#87938a]", children: t("Searching districts...") }),
          districtResults.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-[#e2e9e2] bg-white p-1 shadow-lg", children: uniqueDistrictResults.map((place) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => selectDistrict(place), className: "flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm hover:bg-[#f1f7ef]", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 15, className: "shrink-0 text-[#14804a]" }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { children: place.district || place.name }),
              /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs text-[#839087]", children: [
                t("near"),
                " ",
                place.name
              ] })
            ] })
          ] }, `${place.district}-${place.latitude}`)) }),
          selectedDistrict && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#64816b]", children: [
            t("Selected district:"),
            " ",
            selectedDistrict
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "farm-village", className: "block text-sm font-semibold", children: [
            t("Village / town"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-normal text-[#8b978e]", children: t("(optional)") })
          ] }),
          /* @__PURE__ */ jsx("input", { id: "farm-village", autoComplete: "off", disabled: !selectedDistrict, value: villageInput, onChange: (event) => {
            setVillageInput(event.target.value);
            setSelectedVillage(null);
            setVillageResults([]);
            setLocationError("");
          }, className: "mt-1.5 min-h-12 w-full rounded-xl border border-[#e0e7e0] px-3 text-sm font-normal disabled:bg-[#f5f7f4]", placeholder: selectedDistrict ? t("Type your village or town") : t("Select a district first") }),
          villageLoading && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#87938a]", children: t("Searching villages and towns...") }),
          villageResults.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-[#e2e9e2] bg-white p-1 shadow-lg", children: villageResults.map((place) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => selectVillage(place), className: "flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm hover:bg-[#f1f7ef]", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 15, className: "shrink-0 text-[#14804a]" }),
            /* @__PURE__ */ jsxs("span", { children: [
              place.name,
              /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs text-[#839087]", children: place.district })
            ] })
          ] }, `${place.name}-${place.latitude}`)) }),
          selectedVillage && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#64816b]", children: [
            t("Weather coordinates selected for"),
            " ",
            selectedVillage.name,
            "."
          ] })
        ] }),
        locationError && /* @__PURE__ */ jsx("p", { role: "alert", className: "text-sm text-[#b54136]", children: locationError }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
            t("Farm size (acres)"),
            /* @__PURE__ */ jsx("input", { type: "number", min: "0.1", step: "0.1", value: onboardSize, onChange: (event) => setOnboardSize(event.target.value), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e0e7e0] px-3 text-sm font-normal" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
            t("Main crop"),
            /* @__PURE__ */ jsx("select", { value: onboardCrop, onChange: (event) => setOnboardCrop(event.target.value), className: "mt-1.5 min-h-11 w-full rounded-xl border border-[#e0e7e0] bg-white px-3 text-sm font-normal", children: crops.map((crop) => /* @__PURE__ */ jsx("option", { children: t(crop) }, crop)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#14804a] text-sm font-semibold text-white hover:bg-[#0f6b3c]", children: [
        /* @__PURE__ */ jsx(Check, { size: 17 }),
        " ",
        t("Save my farm")
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-center text-[11px] text-[#89958c]", children: t("Locations are searched from a global geocoding directory. You can update these details anytime.") })
    ] }) })
  ] });
}
export {
  DashboardClient as default
};
