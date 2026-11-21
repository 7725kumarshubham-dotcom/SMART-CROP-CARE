"use client";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CloudSun,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
  TrendingUp,
  UserRound,
  Wheat
} from "lucide-react";
const heroImage = "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1600&q=85";
function AuthScreen({ initialMode = "welcome", onAuthenticated }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  function changeMode(nextMode) {
    setMode(nextMode);
    setErrorMessage("");
  }
  async function submit(event) {
    event.preventDefault();
    setErrorMessage("");
    if (mode !== "signup" && mode !== "signin") return;
    if (mode === "signup") {
      if (name.trim().length < 2) {
        setErrorMessage("Enter your full name.");
        return;
      }
      if (!/^[6-9]\d{9}$/.test(phone)) {
        setErrorMessage("Enter a valid 10-digit Indian mobile number.");
        return;
      }
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        setErrorMessage("Use at least 8 characters, including a letter and a number.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Your passwords do not match.");
        return;
      }
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "signup" ? { name, email, phone, password, confirmPassword } : { email, password })
      });
      if (!(response.headers.get("content-type") || "").includes("application/json")) {
        throw new Error("Sign-in is temporarily unavailable. Please try again shortly.");
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't complete that request. Please try again.");
      if (typeof onAuthenticated === "function") {
        await onAuthenticated();
      }
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't complete that request. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  const isWelcome = mode === "welcome";
  const heading = {
    signup: "Create your account",
    signin: "Welcome back",
    forgot: "Forgot your password?",
    welcome: ""
  }[mode];
  return /* @__PURE__ */ jsx("main", { className: "min-h-screen bg-[#f4f7f2] p-3 text-[#202b24] sm:p-6 lg:p-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1440px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(27,61,39,0.12)] sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.08fr_0.92fr]", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative flex min-h-[390px] flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#173b2b,#245c3a_58%,#68915b)] p-6 text-white sm:min-h-[500px] sm:p-10 lg:min-h-[720px] lg:p-14", children: [
      !imageFailed && /* @__PURE__ */ jsx(
        "img",
        {
          src: heroImage,
          alt: "Lush green farmland in the morning light",
          onError: () => setImageFailed(true),
          className: "absolute inset-0 h-full w-full object-cover object-center"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(115deg,rgba(17,45,29,0.94),rgba(27,70,43,0.77)_52%,rgba(27,70,43,0.25))]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -right-20 top-28 h-64 w-64 rounded-full border border-white/15", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -right-10 top-36 h-44 w-44 rounded-full border border-white/15", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25", children: /* @__PURE__ */ jsx(Sprout, { size: 27 }) }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-lg font-bold tracking-tight", children: "Smart Crop Care" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-white/70", children: "Kisan Care 360" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-2xl py-10 lg:py-16", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90", children: [
          /* @__PURE__ */ jsx(Leaf, { size: 14 }),
          " A better day starts in your field"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl", children: [
          "Grow with confidence. ",
          /* @__PURE__ */ jsx("span", { className: "text-[#d5e8b8]", children: "Harvest with hope." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-lg text-sm leading-6 text-white/80 sm:text-base sm:leading-7", children: "Practical farm guidance, local weather, crop care, and mandi insights \u2014 all in one place, made for your journey." }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 grid max-w-xl gap-3 sm:grid-cols-3", children: [
          { icon: CloudSun, title: "Local weather", text: "Plan each day" },
          { icon: Wheat, title: "Crop guidance", text: "Care with clarity" },
          { icon: TrendingUp, title: "Mandi insights", text: "Know your market" }
        ].map(({ icon: Icon, title, text }) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsx(Icon, { size: 19, className: "text-[#d5e8b8]" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs font-semibold", children: title }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-[10px] text-white/65", children: text })
        ] }, title)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-2 text-xs text-white/65", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { size: 15 }),
        " Your farm journey, thoughtfully supported."
      ] }),
      /* @__PURE__ */ jsx(Leaf, { className: "absolute bottom-28 right-10 rotate-[-28deg] text-white/15", size: 76, "aria-hidden": "true" })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "flex items-center justify-center px-5 py-9 sm:px-10 lg:px-14", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[430px]", children: [
      mode !== "welcome" && /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => changeMode("welcome"), className: "mb-8 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#68756d] hover:bg-[#f4f7f2] hover:text-[#246b45]", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
        " Back"
      ] }),
      isWelcome ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3e9] text-[#246b45]", children: /* @__PURE__ */ jsx(Sprout, { size: 29 }) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[#66845e]", children: "Welcome to your farm companion" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-3 text-3xl font-semibold tracking-tight text-[#202b24] sm:text-[38px]", children: "A little more support for every season." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-6 text-[#718076]", children: "Create your account to keep your farm tools close and make informed decisions, season after season." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-3", children: [
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => changeMode("signup"), className: "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#246b45] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#19492d]", children: [
            "Create account ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 17 })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => changeMode("signin"), className: "min-h-12 w-full rounded-xl border border-[#dce6dc] bg-white px-5 text-sm font-semibold text-[#315b3d] hover:bg-[#f6faf5]", children: "Sign in" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-center text-xs leading-5 text-[#8a978f]", children: "Your account does not require email verification." })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.15em] text-[#66845e]", children: mode === "signup" ? "Start your farm journey" : mode === "signin" ? "Good to see you again" : "Account access" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-2 text-3xl font-semibold tracking-tight", children: heading }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-6 text-[#718076]", children: mode === "signup" ? "Your local guidance and farm tools are just a few details away." : mode === "signin" ? "Sign in to continue to your Smart Crop Care dashboard." : "Password recovery works differently for accounts without email verification." }),
        errorMessage && /* @__PURE__ */ jsx("p", { role: "alert", className: "mt-5 rounded-xl border border-[#f0d2cf] bg-[#fff5f3] p-3 text-sm leading-5 text-[#9b3d33]", children: errorMessage }),
        mode === "forgot" ? /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-xl border border-[#dce6dc] bg-[#f6faf5] p-4 text-sm leading-6 text-[#52675a]", role: "status", children: "Sign-in does not send reset emails. If you forget this password, ask the database administrator to reset your account." }) : /* @__PURE__ */ jsxs("form", { onSubmit: (event) => void submit(event), className: "mt-6 space-y-4", children: [
          mode === "signup" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "signup-name", className: "block text-sm font-semibold", children: "Full name" }),
            /* @__PURE__ */ jsxs("div", { className: "relative -mt-2", children: [
              /* @__PURE__ */ jsx(UserRound, { size: 17, className: "pointer-events-none absolute left-3 top-3.5 text-[#87938a]" }),
              /* @__PURE__ */ jsx("input", { id: "signup-name", required: true, autoComplete: "name", value: name, onChange: (event) => setName(event.target.value), className: "min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#83b85a]", placeholder: "Your full name" })
            ] }),
            /* @__PURE__ */ jsx("label", { htmlFor: "signup-phone", className: "block text-sm font-semibold", children: "Mobile number" }),
            /* @__PURE__ */ jsxs("div", { className: "relative -mt-2", children: [
              /* @__PURE__ */ jsx(Phone, { size: 17, className: "pointer-events-none absolute left-3 top-3.5 text-[#87938a]" }),
              /* @__PURE__ */ jsx("input", { id: "signup-phone", required: true, type: "tel", inputMode: "numeric", autoComplete: "tel-national", pattern: "[6-9][0-9]{9}", maxLength: 10, value: phone, onChange: (event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10)), className: "min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#83b85a]", placeholder: "10-digit Indian mobile number" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("label", { htmlFor: "auth-email", className: "block text-sm font-semibold", children: "Email address" }),
          /* @__PURE__ */ jsxs("div", { className: "relative -mt-2", children: [
            /* @__PURE__ */ jsx(Mail, { size: 17, className: "pointer-events-none absolute left-3 top-3.5 text-[#87938a]" }),
            /* @__PURE__ */ jsx("input", { id: "auth-email", required: true, type: "email", autoComplete: "email", value: email, onChange: (event) => setEmail(event.target.value), className: "min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#83b85a]", placeholder: "you@example.com" })
          ] }),
          (mode === "signup" || mode === "signin") && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "auth-password", className: "block text-sm font-semibold", children: "Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative -mt-2", children: [
              /* @__PURE__ */ jsx(LockKeyhole, { size: 17, className: "pointer-events-none absolute left-3 top-3.5 text-[#87938a]" }),
              /* @__PURE__ */ jsx("input", { id: "auth-password", required: true, type: showPassword ? "text" : "password", autoComplete: mode === "signin" ? "current-password" : "new-password", value: password, onChange: (event) => setPassword(event.target.value), className: "min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white pl-10 pr-12 text-sm outline-none focus:border-[#83b85a]", placeholder: mode === "signin" ? "Enter your password" : "At least 8 characters" }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowPassword((visible) => !visible), className: "absolute right-2 top-1.5 flex h-9 w-9 items-center justify-center rounded-lg text-[#718076] hover:bg-[#f4f7f2]", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 17 }) : /* @__PURE__ */ jsx(Eye, { size: 17 }) })
            ] }),
            mode === "signup" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "auth-confirm-password", className: "block text-sm font-semibold", children: "Confirm password" }),
              /* @__PURE__ */ jsxs("div", { className: "relative -mt-2", children: [
                /* @__PURE__ */ jsx(LockKeyhole, { size: 17, className: "pointer-events-none absolute left-3 top-3.5 text-[#87938a]" }),
                /* @__PURE__ */ jsx("input", { id: "auth-confirm-password", required: true, type: showPassword ? "text" : "password", autoComplete: "new-password", value: confirmPassword, onChange: (event) => setConfirmPassword(event.target.value), className: "min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#83b85a]", placeholder: "Re-enter your password" })
              ] })
            ] })
          ] }),
          mode === "signin" && /* @__PURE__ */ jsx("div", { className: "-mt-1 flex justify-end", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => changeMode("forgot"), className: "text-xs font-semibold text-[#39734c] hover:underline", children: "Forgot password?" }) }),
          /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading, className: "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#246b45] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#19492d] disabled:cursor-not-allowed disabled:opacity-60", children: [
            loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in",
            !loading && /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
          ] })
        ] }),
        (mode === "signup" || mode === "signin") && /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-[#718076]", children: [
          mode === "signup" ? "Already have an account?" : "New to Smart Crop Care?",
          " ",
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => changeMode(mode === "signup" ? "signin" : "signup"), className: "font-semibold text-[#39734c] hover:underline", children: mode === "signup" ? "Sign in" : "Create account" })
        ] })
      ] })
    ] }) })
  ] }) });
}
export {
  AuthScreen as default
};
