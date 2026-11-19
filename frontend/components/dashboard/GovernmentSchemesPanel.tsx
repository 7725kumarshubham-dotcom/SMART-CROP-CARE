"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Landmark, Search } from "lucide-react";

type SchemeLanguage = "English" | "Hindi" | "Marathi";

type LocalizedText = Record<SchemeLanguage, string>;

type GovernmentScheme = {
  id: string;
  name: LocalizedText;
  categoryId: string;
  category: LocalizedText;
  summary: LocalizedText;
  eligibility: LocalizedText;
  url: string;
};

const schemes: GovernmentScheme[] = [
  {
    id: "pm-kisan",
    categoryId: "income",
    name: {
      English: "PM-KISAN Samman Nidhi",
      Hindi: "प्रधानमंत्री किसान सम्मान निधि",
      Marathi: "प्रधानमंत्री किसान सन्मान निधी"
    },
    category: {
      English: "Income support",
      Hindi: "आय सहायता",
      Marathi: "उत्पन्न सहाय्य"
    },
    summary: {
      English: "Income support for eligible landholding farmer families. The official portal offers e-KYC and beneficiary-status services.",
      Hindi: "पात्र भूमिधारक किसान परिवारों के लिए आय सहायता। आधिकारिक पोर्टल पर ई-केवाईसी और लाभार्थी स्थिति की सुविधा है।",
      Marathi: "पात्र जमीनधारक शेतकरी कुटुंबांसाठी उत्पन्न सहाय्य. अधिकृत पोर्टलवर ई-केवायसी आणि लाभार्थी स्थितीची सुविधा आहे."
    },
    eligibility: {
      English: "Exclusions and land-record checks apply. Confirm your status on the official portal or with your state agriculture office.",
      Hindi: "अपवाद और भूमि रिकॉर्ड की जांच लागू होती है। आधिकारिक पोर्टल या राज्य कृषि कार्यालय से अपनी स्थिति की पुष्टि करें।",
      Marathi: "अपवाद आणि जमीन नोंदींची तपासणी लागू होते. अधिकृत पोर्टल किंवा राज्य कृषी कार्यालयाकडून स्थितीची खात्री करा."
    },
    url: "https://pmkisan.gov.in/"
  },
  {
    id: "pmfby",
    categoryId: "insurance",
    name: {
      English: "Pradhan Mantri Fasal Bima Yojana",
      Hindi: "प्रधानमंत्री फसल बीमा योजना",
      Marathi: "प्रधानमंत्री पीक विमा योजना"
    },
    category: {
      English: "Crop insurance",
      Hindi: "फसल बीमा",
      Marathi: "पीक विमा"
    },
    summary: {
      English: "Government-supported crop insurance for notified crops and areas during specified seasons.",
      Hindi: "निर्धारित मौसम में अधिसूचित फसलों और क्षेत्रों के लिए सरकारी फसल बीमा सहायता।",
      Marathi: "ठरावीक हंगामात अधिसूचित पिके आणि क्षेत्रांसाठी सरकारी पीक विमा सहाय्य."
    },
    eligibility: {
      English: "Covered crops, areas, enrollment windows, and terms vary by season and state. Check the current notification before applying.",
      Hindi: "बीमित फसलें, क्षेत्र, आवेदन की अवधि और शर्तें मौसम व राज्य के अनुसार बदलती हैं। आवेदन से पहले वर्तमान अधिसूचना देखें।",
      Marathi: "विमा संरक्षित पिके, क्षेत्रे, अर्जाची मुदत आणि अटी हंगाम व राज्यानुसार बदलतात. अर्ज करण्यापूर्वी सध्याची अधिसूचना तपासा."
    },
    url: "https://pmfby.gov.in/"
  },
  {
    id: "pmksy-pdmc",
    categoryId: "irrigation",
    name: {
      English: "PMKSY · Per Drop More Crop",
      Hindi: "पीएमकेएसवाई · प्रति बूंद अधिक फसल",
      Marathi: "पीएमकेएसवाय · प्रति थेंब अधिक पीक"
    },
    category: {
      English: "Micro-irrigation",
      Hindi: "सूक्ष्म सिंचाई",
      Marathi: "सूक्ष्म सिंचन"
    },
    summary: {
      English: "Promotes drip and sprinkler irrigation to improve water-use efficiency on farms.",
      Hindi: "खेतों में पानी के बेहतर उपयोग के लिए ड्रिप और स्प्रिंकलर सिंचाई को बढ़ावा देता है।",
      Marathi: "शेतात पाण्याचा कार्यक्षम वापर करण्यासाठी ठिबक आणि तुषार सिंचनाला प्रोत्साहन देते."
    },
    eligibility: {
      English: "Implementation and assistance are handled through state agencies. Check eligible systems and current terms with your state agriculture department.",
      Hindi: "इसका कार्यान्वयन और सहायता राज्य एजेंसियां संभालती हैं। पात्र प्रणालियों और वर्तमान शर्तों के लिए राज्य कृषि विभाग से पूछें।",
      Marathi: "अंमलबजावणी आणि सहाय्य राज्य यंत्रणांमार्फत केले जाते. पात्र प्रणाली आणि सध्याच्या अटींसाठी राज्य कृषी विभागाशी संपर्क साधा."
    },
    url: "https://pmksy.gov.in/"
  },
  {
    id: "pm-kusum",
    categoryId: "solar",
    name: {
      English: "PM-KUSUM",
      Hindi: "पीएम-कुसुम",
      Marathi: "पीएम-कुसुम"
    },
    category: {
      English: "Solar energy",
      Hindi: "सौर ऊर्जा",
      Marathi: "सौर ऊर्जा"
    },
    summary: {
      English: "Supports approved solar-energy options for agricultural pumps and power supply.",
      Hindi: "कृषि पंपों और बिजली आपूर्ति के लिए स्वीकृत सौर ऊर्जा विकल्पों को सहायता देता है।",
      Marathi: "शेती पंप आणि वीजपुरवठ्यासाठी मंजूर सौर ऊर्जा पर्यायांना सहाय्य देते."
    },
    eligibility: {
      English: "Components, application windows, and terms depend on the state implementing agency. Confirm that applications are open in your area.",
      Hindi: "घटक, आवेदन की अवधि और शर्तें राज्य की कार्यान्वयन एजेंसी पर निर्भर करती हैं। अपने क्षेत्र में आवेदन खुले हैं या नहीं, इसकी पुष्टि करें।",
      Marathi: "घटक, अर्जाची मुदत आणि अटी राज्याच्या अंमलबजावणी यंत्रणेवर अवलंबून असतात. तुमच्या भागात अर्ज सुरू आहेत का ते तपासा."
    },
    url: "https://pmkusum.mnre.gov.in/"
  },
  {
    id: "soil-health-card",
    categoryId: "soil",
    name: {
      English: "Soil Health Card",
      Hindi: "मृदा स्वास्थ्य कार्ड",
      Marathi: "मृदा आरोग्य पत्रिका"
    },
    category: {
      English: "Soil health",
      Hindi: "मिट्टी का स्वास्थ्य",
      Marathi: "मातीचे आरोग्य"
    },
    summary: {
      English: "Government soil-testing services help farmers understand soil nutrient status and recommendations.",
      Hindi: "सरकारी मिट्टी जांच सेवाएं मिट्टी के पोषक तत्वों और सुझावों को समझने में मदद करती हैं।",
      Marathi: "सरकारी माती परीक्षण सेवा मातीतील पोषकद्रव्ये आणि शिफारसी समजून घेण्यास मदत करतात."
    },
    eligibility: {
      English: "Sampling and card services are organized locally. Ask your agriculture department or nearby Krishi Vigyan Kendra about availability.",
      Hindi: "नमूना जांच और कार्ड सेवाएं स्थानीय स्तर पर आयोजित होती हैं। उपलब्धता के लिए कृषि विभाग या पास के कृषि विज्ञान केंद्र से पूछें।",
      Marathi: "नमुना तपासणी आणि कार्ड सेवा स्थानिक पातळीवर आयोजित केल्या जातात. उपलब्धतेसाठी कृषी विभाग किंवा जवळच्या कृषी विज्ञान केंद्राशी संपर्क साधा."
    },
    url: "https://soilhealth.dac.gov.in/"
  }
];

const copy: Record<SchemeLanguage, Record<string, string>> = {
  English: {
    eyebrow: "GOVERNMENT SCHEMES",
    title: "Find government schemes",
    intro: "Explore a few central agriculture programs and use the official directory to find schemes for your state.",
    directoryTitle: "Explore central and state schemes",
    directoryDescription: "myScheme is the Government of India's directory for discovering central and state/UT schemes.",
    directoryAction: "Open myScheme",
    searchLabel: "Search schemes",
    searchPlaceholder: "Search by scheme or support type",
    categoryLabel: "Filter by support",
    allCategories: "All support types",
    official: "Official government website",
    eligibilityLabel: "Check before applying",
    schemeLink: "Open official scheme site",
    noResults: "No schemes match your search. Try another word or support type.",
    disclaimer: "These summaries are for discovery only. This app does not determine eligibility or submit applications. Eligibility, state availability, and deadlines can change; confirm current details on the official scheme website or with your state agriculture department."
  },
  Hindi: {
    eyebrow: "सरकारी योजनाएं",
    title: "सरकारी योजनाएं खोजें",
    intro: "कुछ केंद्रीय कृषि योजनाएं देखें और अपने राज्य की योजनाएं खोजने के लिए आधिकारिक निर्देशिका का उपयोग करें।",
    directoryTitle: "केंद्रीय और राज्य योजनाएं देखें",
    directoryDescription: "मायस्कीम केंद्र और राज्य/केंद्र शासित प्रदेश की योजनाओं की आधिकारिक सरकारी निर्देशिका है।",
    directoryAction: "मायस्कीम खोलें",
    searchLabel: "योजनाएं खोजें",
    searchPlaceholder: "योजना या सहायता के प्रकार से खोजें",
    categoryLabel: "सहायता के प्रकार से छांटें",
    allCategories: "सभी सहायता प्रकार",
    official: "आधिकारिक सरकारी वेबसाइट",
    eligibilityLabel: "आवेदन से पहले जांचें",
    schemeLink: "आधिकारिक योजना साइट खोलें",
    noResults: "आपकी खोज से कोई योजना नहीं मिली। दूसरा शब्द या सहायता प्रकार आजमाएं।",
    disclaimer: "ये विवरण केवल जानकारी खोजने के लिए हैं। यह ऐप पात्रता तय नहीं करता और आवेदन जमा नहीं करता। पात्रता, राज्य में उपलब्धता और अंतिम तारीखें बदल सकती हैं; आधिकारिक योजना वेबसाइट या राज्य कृषि विभाग से वर्तमान जानकारी की पुष्टि करें।"
  },
  Marathi: {
    eyebrow: "सरकारी योजना",
    title: "सरकारी योजना शोधा",
    intro: "काही केंद्रीय कृषी योजना पहा आणि तुमच्या राज्यातील योजना शोधण्यासाठी अधिकृत निर्देशिकेचा वापर करा.",
    directoryTitle: "केंद्रीय आणि राज्य योजना पहा",
    directoryDescription: "मायस्कीम ही केंद्र आणि राज्य/केंद्रशासित प्रदेश योजनांसाठी भारत सरकारची अधिकृत निर्देशिका आहे.",
    directoryAction: "मायस्कीम उघडा",
    searchLabel: "योजना शोधा",
    searchPlaceholder: "योजना किंवा सहाय्याच्या प्रकारानुसार शोधा",
    categoryLabel: "सहाय्याच्या प्रकारानुसार निवडा",
    allCategories: "सर्व सहाय्य प्रकार",
    official: "अधिकृत सरकारी संकेतस्थळ",
    eligibilityLabel: "अर्ज करण्यापूर्वी तपासा",
    schemeLink: "अधिकृत योजना संकेतस्थळ उघडा",
    noResults: "तुमच्या शोधाशी जुळणारी योजना सापडली नाही. दुसरा शब्द किंवा सहाय्य प्रकार वापरून पहा.",
    disclaimer: "हे सारांश फक्त योजना शोधण्यासाठी आहेत. हे अॅप पात्रता ठरवत नाही किंवा अर्ज सादर करत नाही. पात्रता, राज्यातील उपलब्धता आणि अंतिम तारखा बदलू शकतात; अधिकृत योजना संकेतस्थळ किंवा राज्य कृषी विभागाकडून सध्याची माहिती तपासा."
  }
};

export default function GovernmentSchemesPanel({ language }: { language: SchemeLanguage }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const text = copy[language];
  const categories = useMemo(
    () => Array.from(new Map(schemes.map((scheme) => [scheme.categoryId, scheme.category[language]])).entries()),
    [language]
  );
  const filteredSchemes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return schemes.filter((scheme) => {
      const matchesCategory = !category || scheme.categoryId === category;
      const searchableText = [
        scheme.name[language],
        scheme.name.English,
        scheme.category[language],
        scheme.summary[language],
        scheme.eligibility[language]
      ].join(" ").toLocaleLowerCase();
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [category, language, query]);

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#929e95]">{text.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold">{text.title}</h2>
        <p className="mt-1 text-sm text-[#718077]">{text.intro}</p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-[#176c43] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15"><Landmark size={22} /></span>
          <div>
            <h3 className="font-bold">{text.directoryTitle}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-white/80">{text.directoryDescription}</p>
          </div>
        </div>
        <a
          href="https://www.myscheme.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#176c43] hover:bg-[#f1f7ef]"
        >
          {text.directoryAction}<ExternalLink size={15} />
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[#dfe7df] bg-white px-3">
          <Search size={16} className="shrink-0 text-[#718076]" />
          <span className="sr-only">{text.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={text.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[#dfe7df] bg-white px-3 text-sm">
          <span className="shrink-0 text-[#718076]">{text.categoryLabel}</span>
          <select
            aria-label={text.categoryLabel}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-w-0 flex-1 bg-transparent py-2 font-semibold text-[#304539] outline-none"
          >
            <option value="">{text.allCategories}</option>
            {categories.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredSchemes.map((scheme) => (
          <article key={scheme.id} className="flex flex-col rounded-2xl border border-[#e8eee8] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="max-w-xl text-lg font-bold leading-6">{scheme.name[language]}</h3>
              <span className="rounded-full bg-[#eff7ed] px-2.5 py-1 text-[11px] font-semibold text-[#397d4d]">{scheme.category[language]}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#58695e]">{scheme.summary[language]}</p>
            <div className="mt-4 flex-1 rounded-xl bg-[#f7f9f6] p-3.5">
              <p className="text-xs font-bold text-[#3d5945]">{text.eligibilityLabel}</p>
              <p className="mt-1 text-xs leading-5 text-[#718077]">{scheme.eligibility[language]}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-[#89958c]">{text.official}</span>
              <a
                href={scheme.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-10 items-center gap-1.5 rounded-lg border border-[#dce8dc] px-3 text-xs font-semibold text-[#287146] hover:bg-[#f4f8f3]"
              >
                {text.schemeLink}<ExternalLink size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <p role="status" className="rounded-xl border border-dashed border-[#d9e5d9] bg-white p-6 text-center text-sm text-[#718077]">{text.noResults}</p>
      )}

      <p className="rounded-xl border border-[#eee5c9] bg-[#fffaf0] p-4 text-xs leading-5 text-[#75643b]">{text.disclaimer}</p>
    </section>
  );
}
