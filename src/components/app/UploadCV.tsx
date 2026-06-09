"use client";
import { useState, useRef } from "react";

interface Props {
  onParsed: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

export default function UploadCV({ onParsed, isLoading, setIsLoading }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const validExtensions = /\.(pdf|doc|docx|txt)$/i;
    if (!validExtensions.test(file.name)) {
      setError("Please upload a PDF, Word (.doc/.docx), or text (.txt) file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    setError(null);
    setSuccess(false);
    setFileName(file.name);
    setIsLoading(true);

    try {
      // Convert file to base64 and send to backend
      const base64 = await fileToBase64(file);
      
      const res = await fetch(
        "https://backend-api.221029.workers.dev/parse-cv",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileBase64: base64,
            fileType: file.type,
          }),
        }
      );

      const data = await res.json() as any;

      if (data.error) {
        setError(`Could not parse CV: ${data.error}`);
        return;
      }

      if (data.parsed) {
        setSuccess(true);
        onParsed(data.parsed);
      } else {
        setError("AI could not extract data from this file. Try a text-based PDF or .txt file.");
      }
    } catch (e: any) {
      setError(`Upload failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip the data URL prefix — just send the base64 data
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so same file can be re-uploaded
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
          AI will read your CV and auto-fill all fields instantly.
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
              <div className="absolute inset-0 w-12 h-12 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-sm text-teal-400 font-medium">Parsing your CV...</p>
              <p className="text-xs text-slate-500 mt-1">AI is reading your information</p>
            </div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-2xl">✓</span>
            </div>
            <p className="text-sm text-green-400 font-medium">{fileName}</p>
            <p className="text-xs text-slate-500">CV parsed successfully!</p>
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
              {["PDF", "DOC", "DOCX", "TXT"].map((ext) => (
                <span key={ext} className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-700">
                  {ext}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-600">Max 5MB</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2.5 flex items-start gap-2">
          <span className="text-red-400 text-sm flex-shrink-0">⚠</span>
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Info card */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 space-y-2">
        <p className="text-xs text-slate-400 font-semibold">How it works</p>
        <div className="space-y-1.5">
          {[
            "Upload your current CV in any format",
            "AI extracts your name, skills, experience, education",
            "All fields auto-fill in the editor",
            "Edit anything, then optimize for a job",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-teal-500 text-xs font-bold flex-shrink-0">{i + 1}.</span>
              <p className="text-xs text-slate-500">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Best results tip */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
        <p className="text-xs text-amber-400/80">
          💡 <span className="font-medium">Best results:</span> Use a text-based PDF or .txt file. Scanned image PDFs may not parse correctly.
        </p>
      </div>
    </div>
  );
}