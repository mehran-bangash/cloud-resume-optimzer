"use client";
import { useState } from "react";

interface Props {
  targetId: string;
}

export default function DownloadPDF({ targetId }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);

    const element = document.getElementById(targetId);
    if (!element) {
      alert("CV not found.");
      setIsDownloading(false);
      return;
    }

    // Replace inputs/textareas with plain text spans for clean print
    const inputs = element.querySelectorAll("input, textarea");
    inputs.forEach((el) => {
      const input = el as HTMLInputElement | HTMLTextAreaElement;
      input.style.display = "none";
      const span = document.createElement("span");
      span.setAttribute("data-print-span", "true");
      span.textContent = input.value;
      span.style.fontFamily = "inherit";
      span.style.fontSize = "inherit";
      span.style.color = "inherit";
      span.style.fontWeight = "inherit";
      span.style.lineHeight = "inherit";
      input.parentNode?.insertBefore(span, input.nextSibling);
    });

    // Hide buttons inside CV
    const buttons = element.querySelectorAll("button");
    buttons.forEach((btn) => { btn.style.display = "none"; });

    // Hide ATS bars
    const atsBars = element.querySelectorAll("[data-ats-bar], [data-ats-message]");
    atsBars.forEach((el) => { (el as HTMLElement).style.display = "none"; });

    const style = document.createElement("style");
    style.id = "cv-print-style";
    style.innerHTML = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 0mm;
        }
        body > * {
          display: none !important;
        }
        body > #__next {
          display: block !important;
        }
        body > #__next > * {
          display: none !important;
        }
        #cv-print-wrapper {
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 210mm !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Clone the CV into a top-level print wrapper
    const wrapper = document.createElement("div");
    wrapper.id = "cv-print-wrapper";
    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.zIndex = "-1";
    wrapper.style.width = "210mm";
    const clone = element.cloneNode(true) as HTMLElement;

    // Remove buttons and ATS bars from clone
    clone.querySelectorAll("button, [data-ats-bar], [data-ats-message]").forEach((el) => el.remove());
    // Remove hidden inputs from clone — keep only spans
    clone.querySelectorAll("input, textarea").forEach((el) => el.remove());

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        // Restore inputs
        inputs.forEach((el) => {
          (el as HTMLElement).style.display = "";
        });
        // Restore buttons
        buttons.forEach((btn) => { btn.style.display = ""; });
        // Restore ATS bars
        atsBars.forEach((el) => { (el as HTMLElement).style.display = ""; });
        // Remove all print spans
        element.querySelectorAll("[data-print-span]").forEach((el) => el.remove());
        // Remove wrapper and style
        wrapper.remove();
        document.getElementById("cv-print-style")?.remove();
        setIsDownloading(false);
      }, 1000);
    }, 300);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
    >
      {isDownloading ? (
        <>
          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          Preparing PDF...
        </>
      ) : "⬇ Download CV as PDF"}
    </button>
  );
}