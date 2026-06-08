"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  onGetStarted: () => void;
}

const ROTATING_WORDS = ["Flutter Developer", "Software Engineer", "Product Manager", "Data Scientist", "DevOps Engineer"];

export default function Hero({ onGetStarted }: Props) {
  const { data: session } = useSession();
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Rotate job title words with smooth slide-up and fade transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
      {/* Badge with mount fade transition */}
      <div className={`inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 transition-all duration-700 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
        Powered by Cloudflare AI · Llama 3.1
      </div>

      {/* Headline with dynamic rotating title and mount anim */}
      <h1 className={`text-4xl md:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-700 delay-100 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        Get hired as a
        <br />
        <span
          className={`text-teal-400 transition-all duration-300 inline-block ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          {ROTATING_WORDS[wordIndex]}
        </span>
      </h1>

      <p className={`text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        Paste any job description. Our AI rewrites your entire CV to match —
        skills, experience, summary — and scores it against ATS systems used
        by top companies.
      </p>

      {/* CTA Buttons - Triggers Guest App directly on Click */}
      <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        {session ? (
          <button
            onClick={onGetStarted}
            className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-4 rounded-xl transition-all text-lg shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-105"
          >
            Open My Resume →
          </button>
        ) : (
          <button
            onClick={onGetStarted}
            className="flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-800 font-bold px-8 py-4 rounded-xl transition-all text-base shadow-xl hover:scale-105"
          >
            Start optimizing for free
          </button>
        )}
        <button
          onClick={onGetStarted}
          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base border border-slate-700 hover:border-slate-500 hover:scale-105"
        >
          Try without signing in
        </button>
      </div>

      <p className="text-xs text-slate-600 mt-4">
        Free · No credit card · Google login saves your CV automatically
      </p>

      {/* Animated landing metrics and stats */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 transition-all duration-700 delay-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        {[
          { value: "92%", label: "Average ATS score after optimization" },
          { value: "3×", label: "More interview callbacks reported" },
          { value: "< 30s", label: "Time to optimize a full CV" },
          { value: "Free", label: "No credit card ever required" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900 border border-slate-800 hover:border-teal-500/30 rounded-xl p-5 text-center transition-all duration-300 hover:scale-105"
          >
            <div className="text-2xl font-bold text-teal-400 mb-1">{stat.value}</div>
            <div className="text-xs text-slate-500 leading-relaxed">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}