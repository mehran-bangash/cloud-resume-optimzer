"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Menu, X, ChevronRight, LogOut, LayoutDashboard } from "lucide-react";

// Handles auth error reporting from URL params
function SearchParamsHandler() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "OAuthSignin" || error === "OAuthCallback") {
      toast.error("Sign-in failed. Please verify your credentials.");
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);
  return null;
}

interface Props {
  onGetStarted: () => void;
}

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Reviews" },
];

export default function Navbar({ onGetStarted }: Props) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
 
    useEffect(() => {
    return () => {
      setSigningIn(false);
    };
  }, []);

     const handleSignIn = async () => {
  setSigningIn(true);
  const toastId = toast.loading("Redirecting to Google...");
  try {
    await signIn("google");
    // If the page doesn't redirect immediately, keep it clean
  } catch (error) {
    setSigningIn(false);
    toast.dismiss(toastId);
    toast.error("Sign in failed. Please try again.");
  }
};
  const handleSignOut = async () => {
    const loadingToast = toast.loading("Signing out...");
    try {
      await signOut({ redirect: false });
      toast.success("Signed out successfully!", { id: loadingToast });
    } catch {
      toast.error("Failed to sign out.", { id: loadingToast });
    }
  };

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{
        className: 'bg-slate-900 border border-slate-800 text-white rounded-xl text-sm font-medium',
      }} />
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-slate-950/80 backdrop-blur-lg border-b border-slate-900/60 shadow-lg shadow-black/20" 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo with Modern Gradient Accent */}
          <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center text-sm font-black text-slate-950 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
              AI
            </div>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 text-xl tracking-tight">
              Resume<span className="text-teal-400">AI</span>
            </span>
          </div>

          {/* Desktop Navigation Links with Micro-Interactions */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="text-slate-400 hover:text-white transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* Desktop Auth Actions with High-End SaaS Styling */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-24 h-10 bg-slate-900 rounded-xl animate-pulse border border-slate-800" />
            ) : status === "authenticated" && session?.user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 rounded-full pl-2 pr-4 py-1.5 hover:border-slate-700 transition duration-200">
                  {session.user.image && (
                    <Image 
                      src={session.user.image} 
                      alt="avatar" 
                      width={24} 
                      height={24} 
                      className="rounded-full ring-1 ring-teal-500/20" 
                    />
                  )}
                  <span className="text-sm font-medium text-slate-300">
                    {session.user.name?.split(" ")[0]}
                  </span>
                </div>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-rose-400 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
                <button 
                  onClick={onGetStarted} 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/20 active:translate-y-0"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleSignIn} 
                  className="flex items-center gap-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <GoogleIcon />
                  Sign in
                </button>
                <button 
                  onClick={onGetStarted} 
                  className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/10 active:translate-y-0"
                >
                  Try Free
                </button>
              </>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button className="md:hidden text-slate-400 hover:text-white transition duration-200" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Slide-Down Overlay */}
        {isOpen && (
          <div className="md:hidden bg-slate-950/95 border-b border-slate-900 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)} 
                className="text-slate-300 font-medium hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="h-px bg-slate-900 my-2" />
            {status === "authenticated" ? (
              <>
                <button onClick={onGetStarted} className="bg-teal-500 text-slate-950 font-bold p-3 rounded-xl flex items-center justify-center gap-1.5 w-full">
                  Dashboard <ChevronRight size={16} />
                </button>
                <button onClick={handleSignOut} className="text-slate-400 hover:text-rose-400 font-medium p-3">Sign out</button>
              </>
            ) : (
              <>
                <button onClick={handleSignIn} className="bg-slate-900 text-white font-semibold p-3 rounded-xl border border-slate-800 flex items-center justify-center gap-2 w-full">
                  <GoogleIcon /> Sign In
                </button>
                <button onClick={onGetStarted} className="bg-teal-500 text-slate-950 font-bold p-3 rounded-xl w-full">
                  Try Free
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}