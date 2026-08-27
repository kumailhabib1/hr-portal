import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  BriefcaseBusiness,
  Building2,
  Edit3,
  Camera,
  LockKeyhole,
  CheckCircle2,
  Clock3,
  KeyRound,
} from "lucide-react";

function Profile() {
  return (
    <div className="profile-page min-h-screen bg-slate-50 p-5 text-slate-900 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xs font-medium text-slate-400">
              Account / Profile
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              My Profile
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Manage your HR administrator account and personal information.
            </p>
          </div>

          <button
            className="
              group flex w-fit items-center gap-2
              rounded-xl bg-gradient-to-r
              from-blue-600 via-indigo-600 to-violet-600
              px-4 py-2.5
              text-xs font-bold text-white
              shadow-lg shadow-blue-500/20
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl hover:shadow-blue-500/30
              active:scale-95
            "
          >
            <Edit3 className="h-4 w-4 transition group-hover:rotate-[-8deg]" />
            Edit Profile
          </button>

        </div>

        {/* =====================================================
            PROFILE HERO
        ===================================================== */}

        <section
          className="
            relative mb-6 overflow-hidden
            rounded-3xl border border-slate-200
            bg-white shadow-sm
          "
        >

          {/* Banner */}

          <div
            className="
              relative h-36 overflow-hidden
              bg-gradient-to-r
              from-blue-600
              via-indigo-600
              to-violet-600
            "
          >

            {/* Animated circles */}

            <div
              className="
                absolute -right-20 -top-32
                h-80 w-80 rounded-full
                border border-white/10
                animate-[spin_25s_linear_infinite]
              "
            />

            <div
              className="
                absolute -bottom-40 right-24
                h-72 w-72 rounded-full
                border border-white/10
              "
            />

            <div
              className="
                absolute left-[45%] top-[-100px]
                h-80 w-32 rotate-12
                bg-white/5 blur-2xl
              "
            />

          </div>

          {/* Profile information */}

          <div className="relative px-5 pb-6 sm:px-8">

            <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end">

              {/* Avatar */}

              <div className="relative">

                <div
                  className="
                    flex h-32 w-32 items-center justify-center
                    rounded-[30px]
                    border-[5px] border-white
                    bg-gradient-to-br
                    from-blue-500
                    via-indigo-600
                    to-violet-600
                    text-4xl font-black text-white
                    shadow-xl shadow-blue-900/20
                    transition-all duration-500
                    hover:scale-105 hover:rotate-2
                  "
                >
                  HA
                </div>

                {/* Online */}

                <div
                  className="
                    absolute bottom-2 right-2
                    flex h-7 w-7 items-center justify-center
                    rounded-full border-4 border-white
                    bg-emerald-500
                    shadow-md
                  "
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </div>

                {/* Camera */}

                <button
                  className="
                    absolute -right-2 top-2
                    flex h-9 w-9 items-center justify-center
                    rounded-xl border border-slate-200
                    bg-white text-slate-500 shadow-md
                    transition-all duration-300
                    hover:scale-110
                    hover:bg-blue-50
                    hover:text-blue-600
                  "
                >
                  <Camera className="h-4 w-4" />
                </button>

              </div>

              {/* Name */}

              <div className="flex-1 sm:pb-2">

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-2xl font-black">
                    HR Admin
                  </h2>

                  <span
                    className="
                      flex items-center gap-1
                      rounded-full
                      bg-emerald-50
                      px-2.5 py-1
                      text-[10px] font-bold
                      text-emerald-600
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>

                </div>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  HR Administrator
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">

                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Mail className="h-3.5 w-3.5" />
                    hr@hrportal.com
                  </span>

                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Building2 className="h-3.5 w-3.5" />
                    Human Resources
                  </span>

                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Joined 2024
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            QUICK STATS
        ===================================================== */}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            icon={<UsersIcon />}
            value="250"
            label="Employees Managed"
            color="blue"
          />

          <StatCard
            icon={<Building2 />}
            value="12"
            label="Departments"
            color="violet"
          />

          <StatCard
            icon={<Clock3 />}
            value="98.2%"
            label="Portal Activity"
            color="emerald"
          />

          <StatCard
            icon={<ShieldCheck />}
            value="Secure"
            label="Account Status"
            color="amber"
          />

        </div>

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ===================================================
              LEFT
          =================================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* Personal Information */}

            <ProfileCard
              icon={<UserRound />}
              title="Personal Information"
              subtitle="Your basic account information"
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <InfoItem
                  icon={<UserRound />}
                  label="Full Name"
                  value="HR Admin"
                />

                <InfoItem
                  icon={<Mail />}
                  label="Email Address"
                  value="hr@hrportal.com"
                />

                <InfoItem
                  icon={<Phone />}
                  label="Phone Number"
                  value="+92 300 1234567"
                />

                <InfoItem
                  icon={<CalendarDays />}
                  label="Date of Birth"
                  value="15 January 1995"
                />

                <InfoItem
                  icon={<MapPin />}
                  label="Location"
                  value="Karachi, Sindh, Pakistan"
                />

                <InfoItem
                  icon={<UserRound />}
                  label="Gender"
                  value="Not specified"
                />

              </div>

            </ProfileCard>

            {/* Professional Information */}

            <ProfileCard
              icon={<BriefcaseBusiness />}
              title="Professional Information"
              subtitle="Your role within the organization"
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <InfoItem
                  icon={<BriefcaseBusiness />}
                  label="Designation"
                  value="HR Administrator"
                />

                <InfoItem
                  icon={<Building2 />}
                  label="Department"
                  value="Human Resources"
                />

                <InfoItem
                  icon={<ShieldCheck />}
                  label="Role"
                  value="HR Admin"
                />

                <InfoItem
                  icon={<CalendarDays />}
                  label="Joining Date"
                  value="January 15, 2024"
                />

              </div>

            </ProfileCard>

            {/* Login Activity */}

            <ProfileCard
              icon={<Clock3 />}
              title="Recent Login Activity"
              subtitle="Recent activity on your account"
            >

              <div className="space-y-3">

                <ActivityItem
                  device="Windows PC"
                  location="Karachi, Pakistan"
                  time="Today, 05:21 PM"
                  current
                />

                <ActivityItem
                  device="Chrome Browser"
                  location="Karachi, Pakistan"
                  time="Yesterday, 10:42 AM"
                />

                <ActivityItem
                  device="Windows PC"
                  location="Karachi, Pakistan"
                  time="August 25, 2026 · 04:18 PM"
                />

              </div>

            </ProfileCard>

          </div>

          {/* ===================================================
              RIGHT
          =================================================== */}

          <div className="space-y-6">

            {/* Account Security */}

            <ProfileCard
              icon={<ShieldCheck />}
              title="Account Security"
              subtitle="Protect your administrator account"
            >

              <div className="space-y-3">

                <SecurityItem
                  icon={<LockKeyhole />}
                  title="Password"
                  description="Last changed 30 days ago"
                  action="Change"
                />

                <SecurityItem
                  icon={<KeyRound />}
                  title="Two-Factor Authentication"
                  description="Not enabled"
                  action="Enable"
                  warning
                />

              </div>

            </ProfileCard>

            {/* Account Details */}

            <ProfileCard
              icon={<UserRound />}
              title="Account Details"
              subtitle="Your portal account"
            >

              <div className="space-y-4">

                <DetailRow
                  label="Account ID"
                  value="HR-0001"
                />

                <DetailRow
                  label="Account Type"
                  value="Administrator"
                />

                <DetailRow
                  label="Status"
                  value="Active"
                  active
                />

                <DetailRow
                  label="Created"
                  value="January 15, 2024"
                />

              </div>

            </ProfileCard>

            {/* Permissions */}

            <ProfileCard
              icon={<ShieldCheck />}
              title="Permissions"
              subtitle="Your administrator access"
            >

              <div className="space-y-3">

                <Permission name="Employee Management" />

                <Permission name="Attendance Management" />

                <Permission name="Leave Management" />

                <Permission name="Payroll Management" />

                <Permission name="Reports & Analytics" />

                <Permission name="System Settings" />

              </div>

            </ProfileCard>

          </div>

        </div>

      </div>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  value,
  label,
  color,
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div
      className="
        group rounded-2xl border border-slate-200
        bg-white p-4 shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      <div
        className={`
          mb-3 flex h-10 w-10 items-center
          justify-center rounded-xl
          ${colors[color]}
          transition-transform duration-300
          group-hover:scale-110
        `}
      >
        {icon}
      </div>

      <p className="text-xl font-black">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        {label}
      </p>

    </div>
  );
}

/* ============================================================
   PROFILE CARD
============================================================ */

function ProfileCard({
  icon,
  title,
  subtitle,
  children,
}) {
  return (
    <section
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm

        transition-all
        duration-300

        hover:shadow-md

        sm:p-6
      "
    >

      <div className="mb-6 flex items-center gap-3">

        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-blue-50
            text-blue-600
          "
        >
          {icon}
        </div>

        <div>

          <h3 className="text-sm font-bold">
            {title}
          </h3>

          <p className="mt-1 text-[10px] text-slate-400">
            {subtitle}
          </p>

        </div>

      </div>

      {children}

    </section>
  );
}

/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">

      <div
        className="
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-xl
          bg-slate-50
          text-slate-400
        "
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-bold text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
}

/* ============================================================
   SECURITY ITEM
============================================================ */

function SecurityItem({
  icon,
  title,
  description,
  action,
  warning,
}) {
  return (
    <div
      className="
        flex items-center gap-3
        rounded-xl
        border border-slate-100
        bg-slate-50/70
        p-3
      "
    >

      <div
        className={`
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-xl
          ${
            warning
              ? "bg-amber-50 text-amber-600"
              : "bg-blue-50 text-blue-600"
          }
        `}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-xs font-bold">
          {title}
        </p>

        <p className="mt-1 text-[10px] text-slate-400">
          {description}
        </p>

      </div>

      <button
        className="
          text-[10px]
          font-bold
          text-blue-600
          transition
          hover:text-blue-800
        "
      >
        {action}
      </button>

    </div>
  );
}

/* ============================================================
   DETAIL ROW
============================================================ */

function DetailRow({
  label,
  value,
  active,
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">

      <span className="text-[10px] text-slate-400">
        {label}
      </span>

      {active ? (
        <span
          className="
            flex items-center gap-1.5
            text-[10px] font-bold
            text-emerald-600
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {value}
        </span>
      ) : (
        <span className="text-[10px] font-bold text-slate-700">
          {value}
        </span>
      )}

    </div>
  );
}

/* ============================================================
   PERMISSION
============================================================ */

function Permission({ name }) {
  return (
    <div className="flex items-center gap-2">

      <CheckCircle2 className="h-4 w-4 text-emerald-500" />

      <span className="text-xs font-medium text-slate-600">
        {name}
      </span>

    </div>
  );
}

/* ============================================================
   ACTIVITY
============================================================ */

function ActivityItem({
  device,
  location,
  time,
  current,
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className="
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-xl
          bg-slate-50
          text-slate-500
        "
      >
        <Clock3 className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center gap-2">

          <p className="text-xs font-bold">
            {device}
          </p>

          {current && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-600">
              Current
            </span>
          )}

        </div>

        <p className="mt-1 text-[10px] text-slate-400">
          {location} · {time}
        </p>

      </div>

    </div>
  );
}

/* ============================================================
   USERS ICON
============================================================ */

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default Profile;