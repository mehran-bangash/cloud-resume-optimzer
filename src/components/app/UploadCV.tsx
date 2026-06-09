"use client";
import { useState, useRef } from "react";

interface Props {
  onParsed: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  // ── TXT ──────────────────────────────────────────────────────
  if (ext === "txt") {
    return await file.text();
  }

  // ── DOCX ─────────────────────────────────────────────────────
  if (ext === "docx") {
    const mammoth = (await import("mammoth")).default;
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  // ── PDF ───────────────────────────────────────────────────────
  // ── PDF ───────────────────────────────────────────────────────
if (ext === "pdf") {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@6.0.227/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer(); // ✅ declare it here
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

  // ── DOC (old Word) — fallback to binary text extraction ──────
  if (ext === "doc") {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binary = e.target?.result as string;
        let text = "";
        for (let i = 0; i < binary.length; i++) {
          const code = binary.charCodeAt(i);
          if (code >= 32 && code <= 126) text += binary[i];
          else if (code === 10 || code === 13) text += "\n";
        }
        resolve(text.replace(/\s+/g, " ").trim());
      };
      reader.readAsBinaryString(file);
    });
  }

  throw new Error("Unsupported file type. Please use PDF, DOCX, or TXT.");
}

export default function UploadCV({ onParsed, isLoading, setIsLoading }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const validExtensions = /\.(pdf|doc|docx|txt)$/i;
    if (!validExtensions.test(file.name)) {
      setError("Please upload a PDF, Word (.docx), or text (.txt) file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB.");
      return;
    }

    setError(null);
    setSuccess(false);
    setFileName(file.name);
    setIsLoading(true);
    setStatusMessage("Reading file...");

    try {
      // Extract text based on file type
      const text = await extractTextFromFile(file);

      if (!text || text.trim().length < 30) {
        setError(
          "Could not extract text from this file. If it is a scanned PDF (image-based), please copy the text into a .txt file instead."
        );
        setIsLoading(false);
        return;
      }

      setStatusMessage("AI is parsing your CV...");

      const res = await fetch(
        "https://backend-api.221029.workers.dev/parse-cv",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText: text }),
        }
      );

      const data = (await res.json()) as any;

      if (data.error) {
        setError(`Parse failed: ${data.error}`);
        return;
      }

      if (data.parsed) {
        setSuccess(true);
        setStatusMessage("Done!");
        onParsed(data.parsed);
      } else {
        setError("AI could not extract structured data. Please try a .txt file.");
      }
    } catch (e: any) {
      setError(`Failed: ${e.message}`);
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-1">
          Upload Your Existing CV
        </h2>
        <p className="text-xs text-slate-500">
          AI reads your CV and auto-fills all fields instantly.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isLoading
            ? "border-teal-500/30 bg-teal-500/5 cursor-not-allowed"
            : isDragging
            ? "border-teal-400 bg-teal-500/10 cursor-copy"
            : success
            ? "border-green-500/40 bg-green-500/5 cursor-pointer"
            : "border-slate-700 hover:border-teal-500/40 hover:bg-slate-800/50 cursor-pointer"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="w-12 h-12 border-2 border-slate-700 rounded-full" />
              <div className="absolute inset-0 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-sm text-teal-400 font-medium">{statusMessage}</p>
              <p className="text-xs text-slate-500 mt-1">This may take a few seconds</p>
            </div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-2xl">✓</span>
            </div>
            <p className="text-sm text-green-400 font-medium">{fileName}</p>
            <p className="text-xs text-slate-500">Parsed successfully</p>
            <p className="text-xs text-teal-400 mt-1">Click to upload a different file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-3xl">📄</span>
            </div>
            <div>
              <p className="text-sm text-slate-300 font-medium">
                {fileName ? fileName : "Drop your CV here"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {fileName ? "Click to change file" : "or click to browse"}
              </p>
            </div>
            <div className="flex gap-2 mt-1">
              {["PDF", "DOCX", "TXT"].map((ext) => (
                <span
                  key={ext}
                  className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700"
                >
                  {ext}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-600">Max 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2.5 flex items-start gap-2">
          <span className="text-red-400 flex-shrink-0">⚠</span>
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 space-y-2">
        <p className="text-xs text-slate-400 font-semibold">How it works</p>
        <div className="space-y-1.5">
          {[
            "Upload PDF, DOCX, or TXT",
            "AI extracts all your information",
            "Fields auto-fill in the editor",
            "Edit anything, then optimize for a job",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-teal-500 text-xs font-bold flex-shrink-0">{i + 1}.</span>
              <p className="text-xs text-slate-500">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
        <p className="text-xs text-amber-400/80 leading-relaxed">
          💡 <span className="font-medium">Note:</span> Scanned/image PDFs cannot be parsed. Use a digitally created PDF or export your CV as .txt for best results.
        </p>
      </div>
    </div>
  );
}