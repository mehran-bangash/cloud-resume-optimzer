"use client";
import { useState } from "react";

interface Props {
  onParsed: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

type Step = "instructions" | "pasting" | "parsing" | "success" | "error";

export default function LinkedInImport({
  onParsed,
  isLoading,
  setIsLoading,
}: Props) {
  const [step, setStep] = useState<Step>("instructions");
  const [pastedText, setPastedText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleImport = async () => {
    if (pastedText.trim().length < 100) {
      setErrorMsg("Please paste more text. Select all content from your LinkedIn profile page.");
      return;
    }

    setStep("parsing");
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://backend-api.221029.workers.dev/parse-cv",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cvText: pastedText,
            source: "linkedin",
          }),
        }
      );

      const data = (await res.json()) as any;

      if (data.error) {
        setErrorMsg(`Import failed: ${data.error}`);
        setStep("error");
        return;
      }

      if (data.parsed) {
        setStep("success");
        onParsed(data.parsed);
      } else {
        setErrorMsg("AI could not extract your data. Please try selecting more text.");
        setStep("error");
      }
    } catch (e: any) {
      setErrorMsg(`Failed: ${e.message}`);
      setStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep("instructions");
    setPastedText("");
    setCharCount(0);
    setErrorMsg("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full" style={{ background: "#0A66C2" }} />
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          LinkedIn Import
        </p>
      </div>

      {/* ── Instructions ──────────────────────────────────── */}
      {(step === "instructions" || step === "pasting") && (
        <div className="space-y-3">
          {/* Brand card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#0A66C2" }}
              >
                <svg className="w-5 h-5 text-white" fill="white" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Import from LinkedIn</p>
                <p className="text-xs text-slate-500">Copy text · paste here · done</p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-4">
              {[
                {
                  num: "1",
                  text: "Open your LinkedIn profile in browser",
                  action: () => window.open("https://www.linkedin.com/in/me/", "_blank"),
                  actionLabel: "Open LinkedIn ↗",
                },
                {
                  num: "2",
                  text: 'Press Ctrl+A (or Cmd+A on Mac) to select all, then Ctrl+C to copy',
                  action: null,
                  actionLabel: null,
                },
                {
                  num: "3",
                  text: "Paste below and click Import",
                  action: null,
                  actionLabel: null,
                },
              ].map((s) => (
                <div key={s.num} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                    style={{ background: "#0A66C215", color: "#0A66C2", border: "1px solid #0A66C230" }}
                  >
                    {s.num}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 leading-relaxed">{s.text}</p>
                    {s.action && (
                      <button
                        onClick={s.action}
                        className="mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                        style={{ background: "#0A66C215", color: "#0A66C2", border: "1px solid #0A66C230" }}
                      >
                        {s.actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Paste area */}
            <textarea
              value={pastedText}
              onChange={handleTextChange}
              onFocus={() => setStep("pasting")}
              placeholder="Paste your LinkedIn profile text here..."
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500/60 text-slate-200 placeholder-slate-700 p-3 rounded-lg text-xs outline-none resize-none transition-all leading-relaxed"
            />

            {/* Character count */}
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-600">
                {charCount > 0
                  ? charCount < 100
                    ? "⚠ Paste more text for better results"
                    : `✓ ${charCount.toLocaleString()} characters — ready to import`
                  : "Paste your LinkedIn profile text above"}
              </p>
              <p className={`text-xs font-medium ${charCount >= 100 ? "text-teal-400" : "text-slate-600"}`}>
                {charCount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="bg-red-950/30 border border-red-800/40 rounded-lg px-3 py-2">
              <p className="text-xs text-red-400">{errorMsg}</p>
            </div>
          )}

          {/* Import button */}
          <button
            onClick={handleImport}
            disabled={pastedText.trim().length < 100 || isLoading}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#0A66C2", color: "#fff" }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Import from LinkedIn
          </button>
        </div>
      )}

      {/* ── Parsing ────────────────────────────────────────── */}
      {step === "parsing" && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-4">
          <div className="relative w-14 h-14 mx-auto">
            <div className="w-14 h-14 rounded-full border-2 border-slate-800" />
            <div
              className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#0A66C2", borderTopColor: "transparent" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-5 h-5" style={{ color: "#0A66C2" }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">Importing your LinkedIn data...</p>
            <p className="text-xs text-slate-500 mt-1">AI is extracting all your information</p>
          </div>
          <div className="space-y-2">
            {[100, 85, 92, 70, 78].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-slate-800 animate-pulse"
                style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Success ────────────────────────────────────────── */}
      {step === "success" && (
        <div className="space-y-3">
          <div className="bg-slate-950 border border-green-500/20 rounded-xl p-5 text-center space-y-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-green-400 text-2xl">✓</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-400">LinkedIn imported!</p>
              <p className="text-xs text-slate-500 mt-1">
                Your CV has been filled with your LinkedIn data.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 text-center leading-relaxed">
            Review your CV on the right. Go to Optimize tab to tailor it for a specific job.
          </p>
          <button
            onClick={reset}
            className="w-full py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
          >
            ↺ Import again
          </button>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────── */}
      {step === "error" && (
        <div className="space-y-3">
          <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-400 mb-1">Import failed</p>
            <p className="text-xs text-red-400/80 leading-relaxed">{errorMsg}</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
            <p className="text-xs text-slate-500 font-semibold">Tips for better results:</p>
            {[
              "Select all text on the page (Ctrl+A), not just sections",
              "Make sure you are on your LinkedIn profile page",
              "Include your About, Experience, Skills sections",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-600 text-xs">•</span>
                <p className="text-xs text-slate-500 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
          <button
            onClick={reset}
            className="w-full py-2.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            ← Try again
          </button>
        </div>
      )}
    </div>
  );
}