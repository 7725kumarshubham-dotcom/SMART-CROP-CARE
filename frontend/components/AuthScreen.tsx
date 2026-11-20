"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, CloudSun, Eye, EyeOff, Leaf, LockKeyhole,
  Mail, Phone, ShieldCheck, Sprout, TrendingUp, UserRound, Wheat
} from "lucide-react";

type AuthMode = "welcome" | "signup" | "signin" | "forgot";

const heroImage =
  "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1600&q=85";

export default function AuthScreen({ initialMode = "welcome" }: { initialMode?: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrorMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
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
        body: JSON.stringify(mode === "signup"
          ? { name, email, phone, password, confirmPassword }
          : { email, password })
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't complete that request. Please try again.");
      router.replace("/dashboard");
      router.refresh();
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

  return (
    <main className="min-h-screen bg-[#f4f7f2] p-3 text-[#202b24] sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1440px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(27,61,39,0.12)] sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative flex min-h-[390px] flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#173b2b,#245c3a_58%,#68915b)] p-6 text-white sm:min-h-[500px] sm:p-10 lg:min-h-[720px] lg:p-14">
          {!imageFailed && (
            <img
              src={heroImage}
              alt="Lush green farmland in the morning light"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(17,45,29,0.94),rgba(27,70,43,0.77)_52%,rgba(27,70,43,0.25))]" />
          <div className="absolute -right-20 top-28 h-64 w-64 rounded-full border border-white/15" aria-hidden="true" />
          <div className="absolute -right-10 top-36 h-44 w-44 rounded-full border border-white/15" aria-hidden="true" />
          <div className="relative z-10 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25"><Sprout size={27} /></span>
            <span><span className="block text-lg font-bold tracking-tight">Smart Crop Care</span><span className="text-xs text-white/70">Kisan Care 360</span></span>
          </div>
          <div className="relative z-10 max-w-2xl py-10 lg:py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
              <Leaf size={14} /> A better day starts in your field
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Grow with confidence. <span className="text-[#d5e8b8]">Harvest with hope.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
              Practical farm guidance, local weather, crop care, and mandi insights — all in one place, made for your journey.
            </p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                { icon: CloudSun, title: "Local weather", text: "Plan each day" },
                { icon: Wheat, title: "Crop guidance", text: "Care with clarity" },
                { icon: TrendingUp, title: "Mandi insights", text: "Know your market" }
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                  <Icon size={19} className="text-[#d5e8b8]" />
                  <p className="mt-3 text-xs font-semibold">{title}</p>
                  <p className="mt-0.5 text-[10px] text-white/65">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-xs text-white/65">
            <ShieldCheck size={15} /> Your farm journey, thoughtfully supported.
          </div>
          <Leaf className="absolute bottom-28 right-10 rotate-[-28deg] text-white/15" size={76} aria-hidden="true" />
        </section>

        <section className="flex items-center justify-center px-5 py-9 sm:px-10 lg:px-14">
          <div className="w-full max-w-[430px]">
            {mode !== "welcome" && (
              <button type="button" onClick={() => changeMode("welcome")} className="mb-8 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#68756d] hover:bg-[#f4f7f2] hover:text-[#246b45]">
                <ArrowLeft size={16} /> Back
              </button>
            )}
            {isWelcome ? (
              <>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3e9] text-[#246b45]"><Sprout size={29} /></div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66845e]">Welcome to your farm companion</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#202b24] sm:text-[38px]">A little more support for every season.</h2>
                <p className="mt-4 text-sm leading-6 text-[#718076]">Create your account to keep your farm tools close and make informed decisions, season after season.</p>
                <div className="mt-8 space-y-3">
                  <button type="button" onClick={() => changeMode("signup")} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#246b45] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#19492d]">
                    Create account <ArrowRight size={17} />
                  </button>
                  <button type="button" onClick={() => changeMode("signin")} className="min-h-12 w-full rounded-xl border border-[#dce6dc] bg-white px-5 text-sm font-semibold text-[#315b3d] hover:bg-[#f6faf5]">
                    Sign in
                  </button>
                </div>
                <p className="mt-6 text-center text-xs leading-5 text-[#8a978f]">Your account does not require email verification.</p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#66845e]">
                  {mode === "signup" ? "Start your farm journey" : mode === "signin" ? "Good to see you again" : "Account access"}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">{heading}</h2>
                <p className="mt-2 text-sm leading-6 text-[#718076]">
                  {mode === "signup" ? "Your local guidance and farm tools are just a few details away." :
                    mode === "signin" ? "Sign in to continue to your Smart Crop Care dashboard." :
                      "Password recovery works differently for accounts without email verification."}
                </p>

                {errorMessage && <p role="alert" className="mt-5 rounded-xl border border-[#f0d2cf] bg-[#fff5f3] p-3 text-sm leading-5 text-[#9b3d33]">{errorMessage}</p>}

                {mode === "forgot" ? (
                  <div className="mt-6 rounded-xl border border-[#dce6dc] bg-[#f6faf5] p-4 text-sm leading-6 text-[#52675a]" role="status">
                    Sign-in does not send reset emails. If you forget this password, ask the database administrator to reset your account.
                  </div>
                ) : <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-4">
                  {mode === "signup" && (
                    <>
                      <label htmlFor="signup-name" className="block text-sm font-semibold">Full name</label>
                      <div className="relative -mt-2">
                        <UserRound size={17} className="pointer-events-none absolute left-3 top-3.5 text-[#87938a]" />
                        <input id="signup-name" required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#83b85a]" placeholder="Your full name" />
                      </div>
                      <label htmlFor="signup-phone" className="block text-sm font-semibold">Mobile number</label>
                      <div className="relative -mt-2">
                        <Phone size={17} className="pointer-events-none absolute left-3 top-3.5 text-[#87938a]" />
                        <input id="signup-phone" required type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" maxLength={10} value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} className="min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#83b85a]" placeholder="10-digit Indian mobile number" />
                      </div>
                    </>
                  )}
                  <label htmlFor="auth-email" className="block text-sm font-semibold">Email address</label>
                  <div className="relative -mt-2">
                    <Mail size={17} className="pointer-events-none absolute left-3 top-3.5 text-[#87938a]" />
                    <input id="auth-email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#83b85a]" placeholder="you@example.com" />
                  </div>
                  {(mode === "signup" || mode === "signin") && (
                    <>
                      <label htmlFor="auth-password" className="block text-sm font-semibold">Password</label>
                      <div className="relative -mt-2">
                        <LockKeyhole size={17} className="pointer-events-none absolute left-3 top-3.5 text-[#87938a]" />
                        <input id="auth-password" required type={showPassword ? "text" : "password"} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white pl-10 pr-12 text-sm outline-none focus:border-[#83b85a]" placeholder={mode === "signin" ? "Enter your password" : "At least 8 characters"} />
                        <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-1.5 flex h-9 w-9 items-center justify-center rounded-lg text-[#718076] hover:bg-[#f4f7f2]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                      </div>
                      {mode === "signup" && (
                        <>
                          <label htmlFor="auth-confirm-password" className="block text-sm font-semibold">Confirm password</label>
                          <div className="relative -mt-2">
                            <LockKeyhole size={17} className="pointer-events-none absolute left-3 top-3.5 text-[#87938a]" />
                            <input id="auth-confirm-password" required type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="min-h-12 w-full rounded-xl border border-[#dfe7df] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#83b85a]" placeholder="Re-enter your password" />
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {mode === "signin" && (
                    <div className="-mt-1 flex justify-end">
                      <button type="button" onClick={() => changeMode("forgot")} className="text-xs font-semibold text-[#39734c] hover:underline">Forgot password?</button>
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#246b45] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#19492d] disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </form>}

                {(mode === "signup" || mode === "signin") && (
                  <p className="mt-6 text-center text-sm text-[#718076]">
                    {mode === "signup" ? "Already have an account?" : "New to Smart Crop Care?"}{" "}
                    <button type="button" onClick={() => changeMode(mode === "signup" ? "signin" : "signup")} className="font-semibold text-[#39734c] hover:underline">
                      {mode === "signup" ? "Sign in" : "Create account"}
                    </button>
                  </p>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
