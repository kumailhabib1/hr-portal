import {
  Users,
  UserCheck,
  CalendarDays,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Clock3,
  Building2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

function Dashboard() {

  const stats = [
    {
      title: "Total Employees",
      value: "250",
      change: "12%",
      text: "from last month",
      icon: Users,
      color: "blue",
      up: true,
    },
    {
      title: "Active Employees",
      value: "230",
      change: "92%",
      text: "of total employees",
      icon: UserCheck,
      color: "emerald",
      up: true,
    },
    {
      title: "On Leave",
      value: "12",
      change: "5%",
      text: "of total employees",
      icon: CalendarDays,
      color: "amber",
      up: false,
    },
    {
      title: "New Employees",
      value: "8",
      change: "8%",
      text: "this month",
      icon: UserPlus,
      color: "violet",
      up: true,
    },
  ];


  const employees = [
    {
      initials: "AK",
      name: "Ahmed Khan",
      role: "Software Developer",
      time: "Today",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      initials: "SH",
      name: "Sara Hassan",
      role: "HR Executive",
      time: "Yesterday",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      initials: "MA",
      name: "Muhammad Ali",
      role: "Accountant",
      time: "2 days ago",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      initials: "ZK",
      name: "Zara Khan",
      role: "UI/UX Designer",
      time: "3 days ago",
      gradient: "from-orange-500 to-amber-500",
    },
  ];


  const bars = [65, 78, 62, 91, 76, 84, 68];


  const colorMap = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      glow: "bg-blue-500",
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      glow: "bg-emerald-500",
    },

    amber: {
      icon: "bg-amber-50 text-amber-600",
      glow: "bg-amber-500",
    },

    violet: {
      icon: "bg-violet-50 text-violet-600",
      glow: "bg-violet-500",
    },
  };


  return (
    <div className="dashboard-page min-h-full bg-[#f6f8fc] p-5 lg:p-8 dark:bg-black">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-300/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-300/10 blur-3xl" />

      </div>


      <div className="relative">


        {/* PAGE TITLE */}

        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-500">
              HR Management
            </p>

            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Overview of your organization's workforce and performance.
            </p>

          </div>


          <button
            className="
              group
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-indigo-600
              to-violet-600
              px-5
              py-3
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-indigo-500/25
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              hover:shadow-indigo-500/30
              active:scale-95
            "
          >

            <UserPlus
              size={16}
              className="transition-transform group-hover:rotate-12"
            />

            Add Employee

          </button>

        </div>


        {/* STATS */}

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat, index) => {

            const Icon = stat.icon;
            const colors = colorMap[stat.color];

            return (
              <div
                key={stat.title}
                className="
                  group
                  portal-card
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-500
                  hover:-translate-y-1.5
                  hover:shadow-xl
                  hover:shadow-slate-200/60
                  animate-fade-up
                "
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >

                <div
                  className={`
                    absolute
                    -right-10
                    -top-10
                    h-28
                    w-28
                    rounded-full
                    ${colors.glow}
                    opacity-[0.05]
                    blur-2xl
                    transition-all
                    duration-500
                    group-hover:scale-150
                    group-hover:opacity-[0.12]
                  `}
                />


                <div className="relative">

                  <div className="mb-5 flex items-center justify-between">

                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        ${colors.icon}
                        transition-all
                        duration-300
                        group-hover:scale-110
                        group-hover:rotate-3
                      `}
                    >
                      <Icon size={20} />
                    </div>


                    <button className="rounded-lg p-1 text-slate-300 hover:bg-slate-50 hover:text-slate-500">
                      <MoreHorizontal size={17} />
                    </button>

                  </div>


                  <p className="text-xs font-medium text-slate-400">
                    {stat.title}
                  </p>


                  <div className="mt-1 flex items-center gap-2">

                    <h2 className="text-3xl font-black tracking-tight text-slate-900">
                      {stat.value}
                    </h2>

                    <span
                      className={`
                        flex
                        items-center
                        gap-0.5
                        rounded-md
                        px-1.5
                        py-1
                        text-[11px]
                        font-bold

                        ${
                          stat.up
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }
                      `}
                    >

                      {stat.up ? (
                        <ArrowUpRight size={10} />
                      ) : (
                        <ArrowDownRight size={10} />
                      )}

                      {stat.change}

                    </span>

                  </div>


                  <p className="mt-1 text-[11px] text-slate-400">
                    {stat.text}
                  </p>

                </div>

              </div>
            );
          })}

        </div>


        {/* MINI STATS */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          {[
            ["Departments", "18", Building2, "blue"],
            ["Present Today", "218", CheckCircle2, "emerald"],
            ["Late Today", "09", Clock3, "amber"],
            ["Attendance Rate", "92.4%", TrendingUp, "violet"],
          ].map(([label, value, Icon, color]) => (

            <div
              key={label}
              className="
                group
                portal-card
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200/80
                bg-white
                p-4
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
              "
            >

              <div
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg

                  ${
                    color === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : color === "emerald"
                      ? "bg-emerald-50 text-emerald-600"
                      : color === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-violet-50 text-violet-600"
                  }
                `}
              >
                <Icon size={16} />
              </div>

              <div>

                <p className="text-[11px] text-slate-400">
                  {label}
                </p>

                <strong className="text-sm font-bold text-slate-800">
                  {value}
                </strong>

              </div>

            </div>

          ))}

        </div>


        {/* MAIN GRID */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">


          {/* ATTENDANCE */}

          <div
            className="
              rounded-2xl
              portal-card
              border
              border-slate-200/80
              bg-white
              p-5
              shadow-sm
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <h3 className="text-sm font-bold text-slate-800">
                    Attendance Overview
                  </h3>

                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                    LIVE

                  </span>

                </div>

                <p className="mt-1 text-[11px] text-slate-400">
                  Employee attendance this week
                </p>

              </div>


              <select
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  px-2
                  py-1.5
                  text-[11px]
                  text-slate-500
                  outline-none
                  focus:border-indigo-300
                "
              >
                <option>This Week</option>
                <option>This Month</option>
              </select>

            </div>


            {/* SUMMARY */}

            <div className="mt-5 flex gap-5">

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Present
                <strong className="text-slate-700">218</strong>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                Absent
                <strong className="text-slate-700">20</strong>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Leave
                <strong className="text-slate-700">12</strong>
              </div>

            </div>


            {/* CHART */}

            <div className="mt-6 flex h-60">

              <div className="flex flex-col justify-between pb-5 pr-3 text-[10px] text-slate-300">

                <span>250</span>
                <span>200</span>
                <span>150</span>
                <span>100</span>
                <span>50</span>
                <span>0</span>

              </div>


              <div className="relative flex-1">

                <div className="absolute inset-0 flex flex-col justify-between pb-5">

                  {[1, 2, 3, 4, 5, 6].map((line) => (
                    <div
                      key={line}
                      className="border-t border-dashed border-slate-100"
                    />
                  ))}

                </div>


                <div className="relative flex h-full items-end justify-around gap-2 px-2 pb-5">

                  {bars.map((height, index) => (

                    <div
                      key={index}
                      className="group relative flex h-full flex-1 items-end justify-center"
                    >

                      <div
                        className="
                          w-7
                          rounded-t-lg
                          bg-gradient-to-t
                          from-indigo-600
                          to-indigo-400
                          shadow-md
                          shadow-indigo-500/10
                          transition-all
                          duration-500
                          hover:-translate-y-2
                          hover:from-indigo-500
                          hover:to-violet-400
                        "
                        style={{
                          height: `${height}%`,
                        }}
                      />

                    </div>

                  ))}

                </div>

              </div>

            </div>


            <div className="ml-8 flex justify-around text-[10px] text-slate-400">

              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day) => (
                  <span key={day}>{day}</span>
                )
              )}

            </div>

          </div>


          {/* RECENT EMPLOYEES */}

          <div
            className="
              rounded-2xl
              portal-card
              border
              border-slate-200/80
              bg-white
              p-5
              shadow-sm
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-sm font-bold text-slate-800">
                  Recent Employees
                </h3>

                <p className="mt-1 text-[11px] text-slate-400">
                  Recently added employees
                </p>

              </div>

              <a
                href="/employees"
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
              >
                View All
                <ArrowUpRight size={12} />
              </a>

            </div>


            <div className="mt-4 divide-y divide-slate-100">

              {employees.map((employee) => (

                <div
                  key={employee.name}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    py-3.5
                    transition-all
                    duration-300
                    hover:translate-x-1
                  "
                >

                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      ${employee.gradient}
                      text-[11px]
                      font-bold
                      text-white
                      shadow-md
                      transition-transform
                      group-hover:scale-110
                    `}
                  >
                    {employee.initials}
                  </div>


                  <div className="min-w-0 flex-1">

                    <strong className="block truncate text-xs font-bold text-slate-700">
                      {employee.name}
                    </strong>

                    <span className="mt-0.5 block truncate text-[10px] text-slate-400">
                      {employee.role}
                    </span>

                  </div>


                  <span className="text-[10px] text-slate-400">
                    {employee.time}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>


        {/* BOTTOM */}

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">


          {/* WORKFORCE */}

          <div className="portal-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

            <h3 className="text-sm font-bold text-slate-800">
              Workforce Summary
            </h3>

              <p className="mt-1 text-[11px] text-slate-400">
              Current employee distribution
            </p>


            <div className="mt-5 flex items-center gap-8">

              <div
                className="
                  relative
                  flex
                  h-28
                  w-28
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[conic-gradient(#6366f1_0deg_260deg,#8b5cf6_260deg_320deg,#f59e0b_320deg_360deg)]
                "
              >

                <div className="absolute inset-[13px] flex flex-col items-center justify-center rounded-full bg-white">

                  <strong className="text-xl font-black text-slate-800">
                    250
                  </strong>

                  <span className="text-[9px] text-slate-400">
                    Employees
                  </span>

                </div>

              </div>


              <div className="space-y-3">

                {[
                  ["Full Time", "180", "bg-indigo-500"],
                  ["Part Time", "42", "bg-violet-500"],
                  ["Interns", "28", "bg-amber-400"],
                ].map(([label, value, dot]) => (

                  <div
                    key={label}
                    className="flex items-center gap-2"
                  >

                    <span className={`h-2 w-2 rounded-full ${dot}`} />

                    <span className="text-[11px] text-slate-500">
                      {label}
                    </span>

                    <strong className="text-[11px] text-slate-800">
                      {value}
                    </strong>

                  </div>

                ))}

              </div>

            </div>

          </div>


          {/* EVENTS */}

          <div className="portal-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-sm font-bold text-slate-800">
                  Upcoming Events
                </h3>

                <p className="mt-1 text-[11px] text-slate-400">
                  Important HR activities
                </p>

              </div>

              <button className="text-[11px] font-bold text-indigo-600">
                Calendar
              </button>

            </div>


            <div className="mt-4 space-y-2">

              {[
                ["28", "AUG", "Team Meeting", "10:00 AM · Conference Room"],
                ["30", "AUG", "Salary Processing", "Monthly payroll processing"],
                ["02", "SEP", "Performance Review", "Q3 employee evaluation"],
              ].map(([date, month, title, description]) => (

                <div
                  key={title}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    p-2
                    transition
                    hover:bg-slate-50
                  "
                >

                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                    <strong className="text-sm">
                      {date}
                    </strong>

                    <span className="text-[8px] font-bold">
                      {month}
                    </span>

                  </div>


                  <div>

                    <strong className="block text-[11px] font-bold text-slate-700">
                      {title}
                    </strong>

                    <span className="mt-1 block text-[9px] text-slate-400">
                      {description}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;