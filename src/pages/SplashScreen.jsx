import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b14] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.16),transparent_38%)]" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-8 h-28 w-28 animate-[splashLogo_700ms_ease-out_both]">
          <div className="absolute inset-0 rounded-[2rem] border border-blue-400/20 animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-3 rounded-[1.6rem] border border-violet-400/30 animate-[spin_8s_linear_infinite_reverse]" />
          <img src="/logo/logo.png" alt="Nexora HR logo" className="absolute inset-5 h-18 w-18 rounded-2xl object-cover object-[50%_22%] shadow-2xl shadow-indigo-900/50" />
          <Sparkles className="absolute -right-1 top-2 h-4 w-4 text-blue-300 animate-pulse" />
          <ArrowUpRight className="absolute -bottom-1 left-1 h-4 w-4 text-violet-300 animate-pulse" />
        </div>

        <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-blue-300 animate-[splashContent_700ms_100ms_ease-out_both]">
          <span className="h-px w-7 bg-blue-400/60" />
          Workforce intelligence
          <span className="h-px w-7 bg-blue-400/60" />
        </p>
        <h1 className="text-4xl font-black tracking-tight animate-[splashContent_700ms_150ms_ease-out_both] sm:text-5xl">
          NEXORA HR
        </h1>
        <p className="mt-3 text-sm text-slate-400 animate-[splashContent_700ms_250ms_ease-out_both]">
          A smarter way to manage your people
        </p>

        <div className="mt-10 w-52 animate-[splashContent_700ms_350ms_ease-out_both]">
          <div className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span>Preparing workspace</span>
            <span className="text-blue-300">Loading</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 shadow-lg shadow-indigo-500/50 animate-[splashLoader_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default SplashScreen;
