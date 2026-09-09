import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  BarChart3,
  AlertCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login() {
  const navigate = useNavigate();

  // -----------------------------
  // Form State
  // -----------------------------

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // -----------------------------
  // UI State
  // -----------------------------

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------
  // Login Handler
  // -----------------------------

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------
    // Frontend Validation
    // -----------------------------

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      // -----------------------------
      // API Request
      // -----------------------------

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: trimmedEmail,
            password,
          }),
        }
      );

      // -----------------------------
      // Read API Response
      // -----------------------------

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response received from the server."
        );
      }

      // -----------------------------
      // Backend Error
      // -----------------------------

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Login failed. Please check your credentials."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Login failed. Please try again."
        );
      }

      if (!data?.token) {
        throw new Error(
          "Login successful but authentication token was not received."
        );
      }

      // -----------------------------
      // Clear Old Login Data
      // -----------------------------

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // -----------------------------
      // Save Authentication Data
      // -----------------------------

      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem("token", data.token);

      if (data.user) {
        storage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // -----------------------------
      // Success Message
      // -----------------------------

      setSuccess("Login successful. Redirecting...");

      // -----------------------------
      // Redirect
      // -----------------------------

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);

      if (
        error instanceof TypeError &&
        error.message === "Failed to fetch"
      ) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running on port 5000."
        );
      } else {
        setError(
          error.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // Forgot Password
  // -----------------------------

  const handleForgotPassword = () => {
    setError("");
    setSuccess("");

    setError(
      "Please contact your HR administrator to reset your password."
    );
  };

  return (
    <div className="min-h-screen bg-[#070d1f] text-white overflow-hidden">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">

          {/* =================================================
              HEADER / BRAND
          ================================================= */}

          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                <span className="text-xl font-black text-white">
                  N
                </span>
              </div>

              <div className="text-left">
                <h1 className="text-xl font-bold tracking-tight">
                  Nexora HR
                </h1>

                <p className="text-xs text-slate-400">
                  Human Resource Management
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              LOGIN CONTAINER
          ================================================= */}

          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-2">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="hidden lg:flex relative overflow-hidden p-10 xl:p-14">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-blue-500/[0.08]" />

              <div className="relative flex flex-col justify-between">
                
                {/* Badge */}

                <div>
                  <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                    <Sparkles size={16} />

                    <span>
                      Modern HR Management
                    </span>
                  </div>

                  <h2 className="max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
                    Manage your workforce
                    <span className="block text-emerald-400">
                      smarter.
                    </span>
                  </h2>

                  <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                    A centralized HR platform for managing
                    employees, attendance, payroll, leaves,
                    performance, and more.
                  </p>
                </div>

                {/* Feature Cards */}

                <div className="mt-12 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Users
                        size={20}
                        className="text-emerald-400"
                      />
                    </div>

                    <h3 className="font-semibold">
                      Employee Management
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Manage employee information from one
                      centralized platform.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                      <BarChart3
                        size={20}
                        className="text-blue-400"
                      />
                    </div>

                    <h3 className="font-semibold">
                      Powerful Analytics
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Get clear insights into your workforce
                      and HR operations.
                    </p>
                  </div>

                </div>

                {/* Security */}

                <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
                  <ShieldCheck
                    size={18}
                    className="text-emerald-400"
                  />

                  <span>
                    Secure enterprise HR platform
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT SIDE - LOGIN
            ================================================= */}

            <div className="relative border-white/10 p-6 sm:p-10 lg:border-l xl:p-14">

              {/* Top */}

              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
                  <LockKeyhole
                    size={22}
                    className="text-emerald-400"
                  />
                </div>

                <h2 className="text-2xl font-bold">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Sign in to access your HR portal.
                </p>
              </div>

              {/* =================================================
                  ALERTS
              ================================================= */}

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-400"
                  />

                  <p className="text-sm leading-5 text-red-300">
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />

                  <p className="text-sm leading-5 text-emerald-300">
                    {success}
                  </p>
                </div>
              )}

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                className="space-y-5"
                onSubmit={handleLogin}
              >

                {/* =================================================
                    EMAIL
                ================================================= */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email address
                  </label>

                  <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-emerald-400/50 focus-within:bg-white/[0.06]">
                    <Mail
                      size={19}
                      className="shrink-0 text-slate-500 transition group-focus-within:text-emerald-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="admin@hrportal.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-emerald-400/50 focus-within:bg-white/[0.06]">
                    <LockKeyhole
                      size={19}
                      className="shrink-0 text-slate-500 transition group-focus-within:text-emerald-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      disabled={isLoading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="shrink-0 text-slate-500 transition hover:text-white disabled:opacity-40"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* =================================================
                    REMEMBER + FORGOT
                ================================================= */}

                <div className="flex items-center justify-between gap-4">

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(
                          event.target.checked
                        )
                      }
                      disabled={isLoading}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                    />

                    <span className="text-sm text-slate-400">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300 disabled:opacity-40"
                  >
                    Forgot password?
                  </button>

                </div>

                {/* =================================================
                    LOGIN BUTTON
                ================================================= */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      <span>
                        Signing in...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Sign in to Portal
                      </span>

                      <ArrowRight
                        size={19}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

              </form>

              {/* =================================================
                  SECURITY FOOTER
              ================================================= */}

              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <ShieldCheck
                      size={17}
                      className="text-emerald-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-300">
                      Secure Login
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Your credentials are protected using
                      secure authentication and encrypted
                      communication.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* =================================================
              COPYRIGHT
          ================================================= */}

          <div className="mt-6 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} Nexora HR. All rights reserved.
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;