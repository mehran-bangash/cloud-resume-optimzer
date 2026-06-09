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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractText = async (file: File): Promise<string> => {
    // For plain text files
    if (file.type === "text/plain") {
      return await file.text();
    }

    // For PDF and Word — read as text (works for text-based PDFs)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Strip binary characters, keep readable text
        const cleaned = result
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        resolve(cleaned);
      };
      reader.readAsBinaryString(file);
    });
  };

  const processFile = async (file: File) => {
    // Validate file type
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      setError("Please upload a PDF, Word (.doc/.docx), or text file.");
      return;
    }

    // Validate file size — max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    setError(null);
    setFileName(file.name);
    setIsLoading(true);

    try {
      const text = await extractText(file);

      if (text.trim().length < 50) {
        setError("Could not read text from this file. Please try a different format.");
        setIsLoading(false);
        return;
      }

      const res = await fetch(
        "https://backend-api.221029.workers.dev/parse-cv",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText: text }),
        }
      );

      const data = await res.json() as any;

      if (data.error) {
        setError(`Parse failed: ${data.error}`);
        return;
      }

      if (data.parsed) {
        onParsed(data.parsed);
      }
    } catch (e: any) {
      setError(`Upload failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-1">
          Upload Your CV
        </h2>
        <p className="text-xs text-slate-500">
          Upload your existing CV and AI will auto-fill all fields instantly.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-teal-400 bg-teal-500/10"
            : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"
        } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
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
            <span className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full inline-block" />
            <p className="text-sm text-teal-400 font-medium">
              Reading your CV...
            </p>
            <p className="text-xs text-slate-500">
              AI is extracting your information
            </p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center">
              <span className="text-teal-400 text-lg">✓</span>
            </div>
            <p className="text-sm text-teal-400 font-medium">{fileName}</p>
            <p className="text-xs text-slate-500">Click to upload a different file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mb-1">
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-sm text-slate-300 font-medium">
              Drop your CV here
            </p>
            <p className="text-xs text-slate-500">
              or click to browse
            </p>
            <p className="text-xs text-slate-600 mt-1">
              PDF, Word, or TXT · Max 5MB
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="text-slate-400 font-medium">How it works:</span> AI reads your CV text and fills in your name, email, skills, experience, and all other fields automatically. You can edit anything after.
        </p>
      </div>
    </div>
  );
}