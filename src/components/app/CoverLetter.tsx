"use client";
import { useState } from "react";
import { CoverLetterResult } from "@/lib/types";

interface Props {
  result: CoverLetterResult | null;
  isGenerating: boolean;
  hasJobDescription: boolean;
  onGenerate: () => void;
  onBack: () => void;
}

export default function CoverLetter({
  result,
  isGenerating,
  hasJobDescription,
  onGenerate,
  onBack,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);

  const handleCopy = () => {
    if (!result) return;
    const fullText = `Subject: ${result.subject}\n\n${result.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    setDownloading("pdf");

    // Build a clean HTML page for printing as PDF
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', serif;
      font-size: 12pt;
      line-height: 1.7;
      color: #1a1a1a;
      padding: 60px 70px;
      max-width: 800px;
      margin: 0 auto;
    }
    .subject {
      font-size: 11pt;
      color: #555;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }
    .subject strong { color: #222; }
    .body p {
      margin-bottom: 16px;
      text-align: justify;
    }
    @media print {
      body { padding: 0; }
      @page { margin: 2cm; }
    }
  </style>
</head>
<body>
  <div class="subject">
    <strong>Subject:</strong> ${result.subject}
  </div>
  <div class="body">
    ${result.body
      .split("\n\n")
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("")}
  </div>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setDownloading(null);
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setDownloading(null);
    }, 500);
  };

  const handleDownloadDOCX = async () => {
    if (!result) return;
    setDownloading("docx");
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");

      const paragraphs = [
        // Subject line
        new Paragraph({
          children: [
            new TextRun({ text: "Subject: ", bold: true, size: 22 }),
            new TextRun({ text: result.subject, size: 22, color: "555555" }),
          ],
          spacing: { after: 400 },
        }),
        // Divider spacing
        new Paragraph({ text: "", spacing: { after: 200 } }),
        // Body paragraphs
        ...result.body
          .split("\n\n")
          .filter((p) => p.trim())
          .map(
            (para) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: para.replace(/\n/g, " "),
                    size: 24,
                    font: "Calibri",
                  }),
                ],
                spacing: { after: 240 },
              })
          ),
      ];

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1440,
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children: paragraphs,
          },
        ],
      });

      const buffer = await Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cover-letter.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error("DOCX error:", e);
    } finally {
      setDownloading(null);
    }
  };

  // ── No JD entered yet ───────────────────────────────────────
  if (!hasJobDescription) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-teal-500 rounded-full" />
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Cover Letter
          </p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-3">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
            <span className="text-xl">✉️</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">No job description yet</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Paste a job description in the Optimize tab first, then generate a matching cover letter.
          </p>
          <button
            onClick={onBack}
            className="text-xs text-teal-400 border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 px-4 py-2 rounded-lg transition-all"
          >
            ← Go to Optimize tab
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-teal-500 rounded-full" />
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Cover Letter
          </p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-4">
          <div className="relative w-12 h-12 mx-auto">
            <div className="w-12 h-12 border-2 border-slate-800 rounded-full" />
            <div className="absolute inset-0 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <p className="text-sm text-teal-400 font-medium">Writing your cover letter...</p>
            <p className="text-xs text-slate-600 mt-1">AI is crafting a personalized letter</p>
          </div>
          <div className="space-y-2 text-left">
            {[100, 90, 95, 70, 85, 60].map((w, i) => (
              <div key={i} className="h-2.5 bg-slate-800 rounded animate-pulse"
                style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Generate button ─────────────────────────────────────────
  if (!result) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-teal-500 rounded-full" />
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Cover Letter
          </p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-base">✉️</span>
            </div>
            <div>
              <p className="text-sm text-slate-300 font-medium">Generate a matching cover letter</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                AI writes a personalized letter using your CV and job description.
              </p>
            </div>
          </div>
          <button
            onClick={onGenerate}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            ✉️ Generate Cover Letter
          </button>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">What you get</p>
          {[
            "Personalized opening paragraph",
            "Highlights your top matching skills",
            "Professional closing with call to action",
            "Download as PDF or Word (.docx)",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-teal-500 text-xs">✓</span>
              <p className="text-xs text-slate-500">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Result ──────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-teal-500 rounded-full" />
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Cover Letter
          </p>
        </div>
        <span className="text-xs text-green-400 font-medium">✓ Ready</span>
      </div>

      {/* Subject */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
        <p className="text-xs text-slate-600 mb-0.5">Subject</p>
        <p className="text-xs text-slate-300 font-medium">{result.subject}</p>
      </div>

      {/* Body */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-56 overflow-y-auto">
        {result.body.split("\n\n").map((para, i) => (
          <p key={i} className="text-xs text-slate-400 leading-relaxed mb-3 last:mb-0">
            {para}
          </p>
        ))}
      </div>

      {/* Copy */}
      <button
        onClick={handleCopy}
        className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border ${
          copied
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
        }`}
      >
        {copied ? "✓ Copied to clipboard!" : "Copy to clipboard"}
      </button>

      {/* Download buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading === "pdf"}
          className="py-2.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {downloading === "pdf" ? (
            <span className="animate-spin w-3 h-3 border border-red-400 border-t-transparent rounded-full" />
          ) : "📄"}
          Download PDF
        </button>
        <button
          onClick={handleDownloadDOCX}
          disabled={downloading === "docx"}
          className="py-2.5 rounded-lg text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {downloading === "docx" ? (
            <span className="animate-spin w-3 h-3 border border-blue-400 border-t-transparent rounded-full" />
          ) : "📝"}
          Download DOCX
        </button>
      </div>

      {/* Regenerate */}
      <button
        onClick={onGenerate}
        className="w-full py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
      >
        ↺ Regenerate
      </button>
    </div>
  );
}