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
} from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14] text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-600/20
            blur-[130px]
            animate-pulse
          "
        />

        <div
          className="
            absolute
            -right-40
            bottom-[-100px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-violet-600/20
            blur-[130px]
            animate-pulse
          "
        />

        <div
          className="
            absolute
            left-[40%]
            top-[30%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-indigo-600/10
            blur-[100px]
          "
        />

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]

            [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
            [background-size:50px_50px]
          "
        />

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <section
          className="
            relative
            hidden
            overflow-hidden

            border-r
            border-white/[0.07]

            lg:flex
            lg:flex-col
            lg:justify-between

            px-12
            py-12
            xl:px-20
            xl:py-14
          "
        >

          {/* Decorative circle */}

          <div
            className="
              absolute
              -right-32
              top-1/2
              h-[500px]
              w-[500px]
              -translate-y-1/2

              rounded-full

              border
              border-blue-500/10

              animate-[spin_30s_linear_infinite]
            "
          />

          <div
            className="
              absolute
              -right-20
              top-1/2
              h-[350px]
              w-[350px]
              -translate-y-1/2

              rounded-full

              border
              border-violet-500/10
            "
          />

          {/* ===============================================
              BRAND
          =============================================== */}

          <div className="relative">

            <div className="flex items-center gap-3">

              <img
                src="/logo/logo.png"
                alt="Nexora HR logo"
                className="h-12 w-12 shrink-0 rounded-xl object-cover object-[50%_22%] shadow-xl shadow-blue-900/30 transition-all duration-500 hover:scale-105 hover:rotate-3"
              />

              <div>

                <h2 className="text-lg font-bold">
                  NEXORA HR
                </h2>

                <p className="text-[10px] text-slate-500">
                  Management System
                </p>

              </div>

            </div>

          </div>

          {/* ===============================================
              HERO CONTENT
          =============================================== */}

          <div className="relative max-w-xl">

            <div
              className="
                mb-5
                inline-flex
                items-center
                gap-2

                rounded-full

                border
                border-blue-500/20

                bg-blue-500/10

                px-3
                py-1.5

                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]

                text-blue-400
              "
            >
              <Sparkles className="h-3 w-3" />

              Smart HR Management
            </div>

            <h1
              className="
                text-5xl
                font-black
                leading-[1.08]
                tracking-tight

                xl:text-6xl
              "
            >
              Manage your
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-blue-400
                  via-indigo-400
                  to-violet-400

                  bg-clip-text
                  text-transparent
                "
              >
                workforce smarter.
              </span>
            </h1>

            <p
              className="
                mt-6
                max-w-lg

                text-sm
                leading-7

                text-slate-500
              "
            >
              Everything you need to manage employees, attendance,
              payroll, leave and performance from one powerful
              HR administration platform.
            </p>

            {/* =============================================
                FEATURES
            ============================================= */}

            <div className="mt-9 grid grid-cols-2 gap-3">

              {/* Feature 1 */}

              <div
                className="
                  group
                  rounded-2xl

                  border
                  border-white/[0.07]

                  bg-white/[0.035]

                  p-4

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-blue-500/20
                  hover:bg-blue-500/[0.05]
                "
              >

                <div
                  className="
                    mb-3
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center

                    rounded-xl

                    bg-blue-500/10

                    text-blue-400
                  "
                >
                  <Users className="h-4 w-4" />
                </div>

                <h3 className="text-xs font-bold">
                  Employee Management
                </h3>

                <p className="mt-1 text-[10px] text-slate-600">
                  Manage your entire workforce
                </p>

              </div>

              {/* Feature 2 */}

              <div
                className="
                  group
                  rounded-2xl

                  border
                  border-white/[0.07]

                  bg-white/[0.035]

                  p-4

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-violet-500/20
                  hover:bg-violet-500/[0.05]
                "
              >

                <div
                  className="
                    mb-3
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center

                    rounded-xl

                    bg-violet-500/10

                    text-violet-400
                  "
                >
                  <BarChart3 className="h-4 w-4" />
                </div>

                <h3 className="text-xs font-bold">
                  Powerful Analytics
                </h3>

                <p className="mt-1 text-[10px] text-slate-600">
                  Insights at a glance
                </p>

              </div>

            </div>

          </div>

          {/* ===============================================
              BOTTOM
          =============================================== */}

          <div className="relative flex items-center gap-5">

            <div className="flex -space-x-2">

              {["AK", "SH", "MA", "FA"].map((name, index) => (
                <div
                  key={name}
                  className={`
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center

                    rounded-full

                    border-2
                    border-[#070b14]

                    text-[9px]
                    font-bold
                    text-white

                    ${
                      index % 2 === 0
                        ? "bg-blue-600"
                        : "bg-violet-600"
                    }
                  `}
                >
                  {name}
                </div>
              ))}

            </div>

            <div>

              <div className="flex items-center gap-1">

                <CheckCircle2 className="h-3 w-3 text-emerald-400" />

                <span className="text-[10px] font-semibold text-slate-400">
                  Trusted HR platform
                </span>

              </div>

              <p className="mt-1 text-[9px] text-slate-600">
                Secure workforce management
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            RIGHT SIDE - LOGIN
        =================================================== */}

        <section
          className="
            flex
            min-h-screen
            items-center
            justify-center

            px-5
            py-10

            sm:px-10
            lg:px-14
            xl:px-24
          "
        >

          <div
            className="
              w-full
              max-w-[440px]

              animate-[loginEnter_.7s_cubic-bezier(.16,1,.3,1)]
            "
          >

            {/* Mobile Logo */}

            <div className="mb-8 text-center lg:hidden">

              <img
                src="/logo/logo.png"
                alt="Nexora HR logo"
                className="mx-auto mb-4 h-16 w-16 rounded-2xl object-cover object-[50%_22%] shadow-xl shadow-blue-900/30"
              />

              <h1 className="text-2xl font-bold">
                NEXORA HR
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Employee Management System
              </p>

            </div>

            {/* =============================================
                LOGIN CARD
            ============================================= */}

            <div
              className="
                relative
                overflow-hidden

                rounded-[28px]

                border
                border-white/[0.09]

                bg-white/[0.045]

                p-6

                shadow-2xl
                shadow-black/40

                backdrop-blur-2xl

                sm:p-8
              "
            >

              {/* Card glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -top-32
                  right-[-50px]

                  h-64
                  w-64

                  rounded-full

                  bg-blue-500/10

                  blur-[80px]
                "
              />

              <div className="relative">

                {/* Header */}

                <div className="mb-7">

                  <div
                    className="
                      mb-4
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center

                        rounded-lg

                        bg-blue-500/10

                        text-blue-400
                      "
                    >
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.15em]

                        text-blue-400
                      "
                    >
                      Admin Access
                    </span>

                  </div>

                  <h2 className="text-2xl font-bold tracking-tight">
                    Welcome back
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Sign in to access your HR administration dashboard.
                  </p>

                </div>

                {/* =========================================
                    FORM
                ========================================= */}

                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    navigate("/dashboard");
                  }}
                >

                  {/* EMAIL */}

                  <div className="group">

                    <label
                      htmlFor="email"
                      className="
                        mb-2
                        block

                        text-xs
                        font-semibold
                        text-slate-300

                        transition-colors

                        group-focus-within:text-blue-400
                      "
                    >
                      Email address
                    </label>

                    <div
                      className="
                        relative
                        flex
                        h-12
                        items-center

                        rounded-xl

                        border
                        border-white/[0.08]

                        bg-white/[0.035]

                        px-3

                        transition-all
                        duration-300

                        group-focus-within:border-blue-500/50
                        group-focus-within:bg-blue-500/[0.04]
                        group-focus-within:shadow-lg
                        group-focus-within:shadow-blue-500/10

                        hover:border-white/[0.15]
                      "
                    >

                      <Mail
                        className="
                          mr-3
                          h-[18px]
                          w-[18px]

                          shrink-0

                          text-slate-600

                          transition-all

                          group-focus-within:text-blue-400
                          group-focus-within:scale-110
                        "
                      />

                      <input
                        id="email"
                        type="email"
                        placeholder="admin@hrportal.com"
                        className="
                          h-full
                          min-w-0
                          flex-1

                          bg-transparent

                          text-sm
                          text-white

                          outline-none

                          placeholder:text-slate-600
                        "
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}

                  <div className="group">

                    <div className="mb-2 flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="
                          text-xs
                          font-semibold
                          text-slate-300

                          group-focus-within:text-blue-400
                        "
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        className="
                          text-[11px]
                          font-medium
                          text-blue-400

                          transition-colors

                          hover:text-blue-300
                        "
                      >
                        Forgot password?
                      </button>

                    </div>

                    <div
                      className="
                        flex
                        h-12
                        items-center

                        rounded-xl

                        border
                        border-white/[0.08]

                        bg-white/[0.035]

                        px-3

                        transition-all
                        duration-300

                        group-focus-within:border-blue-500/50
                        group-focus-within:bg-blue-500/[0.04]

                        hover:border-white/[0.15]
                      "
                    >

                      <LockKeyhole
                        className="
                          mr-3
                          h-[18px]
                          w-[18px]

                          shrink-0

                          text-slate-600

                          transition-all

                          group-focus-within:text-blue-400
                        "
                      />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Enter your password"
                        className="
                          h-full
                          min-w-0
                          flex-1

                          bg-transparent

                          text-sm
                          text-white

                          outline-none

                          placeholder:text-slate-600
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (visible) => !visible
                          )
                        }
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center

                          rounded-lg

                          text-slate-600

                          transition-all

                          hover:bg-white/5
                          hover:text-blue-400

                          active:scale-90
                        "
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* REMEMBER */}

                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2

                      text-xs
                      text-slate-500
                    "
                  >

                    <input
                      type="checkbox"
                      className="
                        h-4
                        w-4
                        accent-blue-500
                      "
                    />

                    Remember me on this device

                  </label>

                  {/* LOGIN */}

                  <button
                    type="submit"
                    className="
                      group
                      relative

                      flex
                      h-12
                      w-full
                      items-center
                      justify-center
                      gap-3

                      overflow-hidden

                      rounded-xl

                      bg-gradient-to-r
                      from-blue-600
                      via-indigo-600
                      to-violet-600

                      text-sm
                      font-semibold
                      text-white

                      shadow-lg
                      shadow-blue-900/30

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:shadow-xl
                      hover:shadow-blue-900/40

                      active:translate-y-0
                      active:scale-[0.99]
                    "
                  >

                    {/* Shine */}

                    <span
                      className="
                        absolute
                        -left-20
                        top-0

                        h-full
                        w-12

                        rotate-12

                        bg-white/20
                        blur-sm

                        transition-all
                        duration-700

                        group-hover:left-[110%]
                      "
                    />

                    <span className="relative">
                      Sign in to Portal
                    </span>

                    <ArrowRight
                      className="
                        relative
                        h-4
                        w-4

                        transition-transform

                        group-hover:translate-x-1
                      "
                    />

                  </button>

                </form>

                {/* SECURITY */}

                <div
                  className="
                    mt-7

                    flex
                    items-center
                    justify-center
                    gap-2

                    border-t
                    border-white/[0.07]

                    pt-6
                  "
                >

                  <ShieldCheck
                    className="
                      h-4
                      w-4
                      text-emerald-400
                    "
                  />

                  <span className="text-[10px] text-slate-600">
                    Secure & encrypted HR management
                  </span>

                </div>

              </div>

            </div>

            <p
              className="
                mt-6
                text-center

                text-[10px]
                tracking-wide

                text-slate-600
              "
            >
                  © 2026 NEXORA HR · All rights reserved
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Login;