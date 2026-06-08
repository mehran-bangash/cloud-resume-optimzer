
"use client";
import { useSession } from "next-auth/react";

interface Props {
  onGetStarted: () => void;
}

export default function CTASection({ onGetStarted }: Props) {
  const { data: session } = useSession();

  return (
    <section className="bg-teal-600 py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to get more interviews?
        </h2>
        <p className="text-teal-100 mb-8 text-lg">
          Start with our pre-built 2026 CV template. No signup required.
        </p>
        
        {/* Guest Mode Action Button - Always routes directly to App View without Sign-In */}
        <button
          onClick={onGetStarted}
          className="bg-white text-teal-700 hover:bg-teal-50 font-bold px-10 py-4 rounded-xl transition-all text-lg hover:scale-105 shadow-xl shadow-black/10"
        >
          {session ? "Open My Resume →" : "Start optimizing for free →"}
        </button>
      </div>
    </section>
  );
}