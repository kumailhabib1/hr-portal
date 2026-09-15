import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Navigation,
  LogIn,
  LogOut,
  Activity,
  LocateFixed,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Map,
  Wifi,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| API CONFIG
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    ""
  );
};

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(
    `${dateString}T00:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

const formatTime = (dateValue) => {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

const getInitials = (employee) => {
  const first =
    employee.first_name ||
    employee.firstName ||
    "";

  const last =
    employee.last_name ||
    employee.lastName ||
    "";

  if (first || last) {
    return `${first.charAt(0)}${last.charAt(
      0
    )}`.toUpperCase();
  }

  const name =
    employee.name ||
    employee.full_name ||
    "";

  if (name) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) =>
        part.charAt(0)
      )
      .join("")
      .toUpperCase();
  }

  return "NA";
};

const getEmployeeName = (employee) => {
  if (employee.name) {
    return employee.name;
  }

  if (employee.full_name) {
    return employee.full_name;
  }

  return [
    employee.first_name ||
      employee.firstName ||
      "",
    employee.last_name ||
      employee.lastName ||
      "",
  ]
    .join(" ")
    .trim();
};

const getDepartmentName = (employee) => {
  return (
    employee.department_name ||
    employee.department ||
    "Unassigned"
  );
};

const getEmployeeId = (employee) => {
  return (
    employee.id ||
    employee.employee_id
  );
};

const getEmployeeCode = (employee) => {
  return (
    employee.employee_code ||
    employee.employeeCode ||
    "-"
  );
};

/*
|--------------------------------------------------------------------------
| API REQUEST
|--------------------------------------------------------------------------
*/

const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type":
          "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      },
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| STATUS CONFIG
|--------------------------------------------------------------------------
*/

const statusConfig = {
  Present: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },

  Late: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },

  Absent: {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },

  "Not Marked": {
    text: "text-slate-400",
    bg: "bg-white/5",
    border: "border-white/10",
    dot: "bg-slate-500",
  },
};

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
  icon: Icon,
  label,
  value,
  percentage,
  type,
  delay,
}) {
  const styles = {
    present: {
      icon: "from-emerald-500 to-teal-500",
      glow: "bg-emerald-500/10",
      text: "text-emerald-400",
    },

    late: {
      icon: "from-amber-500 to-orange-500",
      glow: "bg-amber-500/10",
      text: "text-amber-400",
    },

    absent: {
      icon: "from-red-500 to-rose-500",
      glow: "bg-red-500/10",
      text: "text-red-400",
    },

    marked: {
      icon: "from-blue-500 to-indigo-600",
      glow: "bg-blue-500/10",
      text: "text-blue-400",
    },
  };

  const style = styles[type];

  return (
    <div
      style={{
        animationDelay: `${delay}ms`,
      }}
      className="
        group relative overflow-hidden rounded-2xl
        portal-card
        border border-white/[0.08]
        bg-white/[0.045]
        p-5
        shadow-2xl shadow-black/20
        backdrop-blur-xl
        transition-all duration-500
        hover:-translate-y-1
        hover:border-white/[0.15]
        hover:bg-white/[0.065]
        animate-[fadeUp_.6s_ease-out_both]
      "
    >
      <div
        className={`
          pointer-events-none absolute
          -right-10 -top-10
          h-28 w-28 rounded-full
          ${style.glow}
          blur-3xl
          transition-transform duration-700
          group-hover:scale-150
        `}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`
            flex h-11 w-11
            items-center justify-center
            rounded-xl
            bg-gradient-to-br
            ${style.icon}
            text-white
            shadow-lg
          `}
        >
          <Icon size={20} />
        </div>

        <span
          className={`
            rounded-full
            bg-white/5
            px-2.5 py-1
            text-[10px] font-bold
            ${style.text}
          `}
        >
          {percentage}
        </span>
      </div>

      <p className="relative mt-5 text-xs font-medium text-slate-500">
        {label}
      </p>

      <h2 className="relative mt-1 text-3xl font-bold tracking-tight text-white">
        {value}
      </h2>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className={`
            h-full rounded-full
            bg-gradient-to-r
            ${style.icon}
            transition-all duration-1000
          `}
          style={{
            width:
              type === "present"
                ? `${Math.min(
                    Number(percentage) || 0,
                    100
                  )}%`
                : type === "late"
                ? `${Math.min(
                    Number(percentage) || 0,
                    100
                  )}%`
                : type === "absent"
                ? `${Math.min(
                    Number(percentage) || 0,
                    100
                  )}%`
                : "5%",
          }}
        />
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

function Attendance() {
  const today = getToday();

  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");

  const [search, setSearch] =
    useState("");

  const [employees, setEmployees] =
    useState([]);

  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load Employees
  |--------------------------------------------------------------------------
  */

  const loadEmployees = useCallback(
    async () => {
      const response =
        await apiRequest(
          "/employees"
        );

      setEmployees(
        response.employees ||
          response.data ||
          response.results ||
          []
      );
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Load Attendance
  |--------------------------------------------------------------------------
  */

  const loadAttendance =
    useCallback(async () => {
      const response =
        await apiRequest(
          `/attendance?date=${today}`
        );

      setAttendance(
        response.attendance ||
          response.data ||
          response.results ||
          []
      );
    }, [today]);

  /*
  |--------------------------------------------------------------------------
  | Load Everything
  |--------------------------------------------------------------------------
  */

  const loadData = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        await Promise.all([
          loadEmployees(),
          loadAttendance(),
        ]);
      } catch (err) {
        console.error(
          "Attendance loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load attendance data"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loadEmployees, loadAttendance]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  /*
  |--------------------------------------------------------------------------
  | Department List
  |--------------------------------------------------------------------------
  */

  const departments = useMemo(() => {
    const map = new Map();

    employees.forEach((employee) => {
      const name =
        getDepartmentName(employee);

      if (!map.has(name)) {
        map.set(name, 0);
      }

      map.set(
        name,
        map.get(name) + 1
      );
    });

    return [
      {
        name: "All Departments",
        count: employees.length,
        id: null,
      },

      ...Array.from(
        map.entries()
      ).map(
        ([name, count]) => ({
          name,
          count,
          id: null,
        })
      ),
    ];
  }, [employees]);

  /*
  |--------------------------------------------------------------------------
  | Attendance Map
  |--------------------------------------------------------------------------
  */

  const attendanceMap = useMemo(() => {
    const map = new Map();

    attendance.forEach((record) => {
      map.set(
        Number(record.employee_id),
        record
      );
    });

    return map;
  }, [attendance]);

  /*
  |--------------------------------------------------------------------------
  | Build Employee Rows
  |--------------------------------------------------------------------------
  */

  const employeeRows = useMemo(() => {
    return employees.map(
      (employee) => {
        const employeeDatabaseId =
          Number(
            getEmployeeId(employee)
          );

        const record =
          attendanceMap.get(
            employeeDatabaseId
          );

        let status = "Not Marked";

        if (record) {
          status =
            record.status || "Present";
        }

        return {
          ...employee,

          databaseId:
            employeeDatabaseId,

          employeeCode:
            getEmployeeCode(
              employee
            ),

          name:
            getEmployeeName(
              employee
            ),

          department:
            getDepartmentName(
              employee
            ),

          position:
            employee.position ||
            "-",

          initials:
            getInitials(
              employee
            ),

          status,

          checkIn:
            record
              ? formatTime(
                  record.check_in
                )
              : "-",

          checkOut:
            record
              ? formatTime(
                  record.check_out
                )
              : "-",

          location:
            record?.location_address ||
            (record?.check_in_latitude
              ? "GPS Location"
              : "-"),

          latitude:
            record?.check_in_latitude ||
            null,

          longitude:
            record?.check_in_longitude ||
            null,

          checkOutLatitude:
            record?.check_out_latitude ||
            null,

          checkOutLongitude:
            record?.check_out_longitude ||
            null,

          attendanceId:
            record?.id || null,

          workingHours:
            record?.working_hours ??
            null,

          attendanceRecord:
            record || null,
        };
      }
    );
  }, [employees, attendanceMap]);

  /*
  |--------------------------------------------------------------------------
  | Filtering
  |--------------------------------------------------------------------------
  */

  const filteredEmployees =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return employeeRows.filter(
        (employee) => {
          const departmentMatch =
            selectedDepartment ===
              "All Departments" ||
            employee.department ===
              selectedDepartment;

          const searchMatch =
            !searchValue ||
            employee.name
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            employee.employeeCode
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            employee.department
              .toLowerCase()
              .includes(
                searchValue
              );

          return (
            departmentMatch &&
            searchMatch
          );
        }
      );
    }, [
      employeeRows,
      selectedDepartment,
      search,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    const total =
      employeeRows.length;

    const present =
      employeeRows.filter(
        (employee) =>
          employee.status ===
          "Present"
      ).length;

    const late =
      employeeRows.filter(
        (employee) =>
          employee.status ===
          "Late"
      ).length;

    const absent =
      employeeRows.filter(
        (employee) =>
          employee.status ===
          "Absent"
      ).length;

    const notMarked =
      employeeRows.filter(
        (employee) =>
          employee.status ===
          "Not Marked"
      ).length;

    const percentage = (
      value
    ) => {
      if (!total) return "0%";

      return `${(
        (value / total) *
        100
      ).toFixed(1)}%`;
    };

    return {
      total,
      present,
      late,
      absent,
      notMarked,
      presentPercentage:
        percentage(present),
      latePercentage:
        percentage(late),
      absentPercentage:
        percentage(absent),
      notMarkedPercentage:
        percentage(notMarked),
    };
  }, [employeeRows]);

  /*
  |--------------------------------------------------------------------------
  | Get Browser Location
  |--------------------------------------------------------------------------
  */

  const getCurrentLocation =
    () => {
      return new Promise(
        (resolve, reject) => {
          if (
            !navigator.geolocation
          ) {
            reject(
              new Error(
                "Geolocation is not supported by this browser."
              )
            );

            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude:
                  position.coords.latitude,

                longitude:
                  position.coords.longitude,
              });
            },

            (locationError) => {
              let message =
                "Unable to get your location.";

              if (
                locationError.code ===
                1
              ) {
                message =
                  "Location permission was denied. Please allow location access.";
              }

              if (
                locationError.code ===
                2
              ) {
                message =
                  "Your location is currently unavailable.";
              }

              if (
                locationError.code ===
                3
              ) {
                message =
                  "Location request timed out.";
              }

              reject(
                new Error(message)
              );
            },

            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
            }
          );
        }
      );
    };

  /*
  |--------------------------------------------------------------------------
  | CHECK IN
  |--------------------------------------------------------------------------
  */

  const handleCheckIn =
    async (employee) => {
      if (
        actionLoading !== null
      ) {
        return;
      }

      try {
        setActionLoading(
          employee.databaseId
        );

        setError("");

        const location =
          await getCurrentLocation();

        const response =
          await apiRequest(
            "/attendance/check-in",
            {
              method: "POST",

              body: JSON.stringify({
                employee_id:
                  employee.databaseId,

                latitude:
                  location.latitude,

                longitude:
                  location.longitude,

                location_address:
                  `GPS: ${location.latitude.toFixed(
                    6
                  )}, ${location.longitude.toFixed(
                    6
                  )}`,
              }),
            }
          );

        console.log(
          "Check-in response:",
          response
        );

        await loadAttendance();

      } catch (err) {
        console.error(
          "Check-in error:",
          err
        );

        setError(
          err.message ||
            "Unable to check in employee"
        );

        alert(
          err.message ||
            "Unable to check in employee"
        );
      } finally {
        setActionLoading(null);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CHECK OUT
  |--------------------------------------------------------------------------
  */

  const handleCheckOut =
    async (employee) => {
      if (
        actionLoading !== null
      ) {
        return;
      }

      if (!employee.attendanceId) {
        alert(
          "Attendance record was not found."
        );

        return;
      }

      try {
        setActionLoading(
          employee.databaseId
        );

        setError("");

        const location =
          await getCurrentLocation();

        const response =
          await apiRequest(
            `/attendance/${employee.attendanceId}/check-out`,
            {
              method: "PUT",

              body: JSON.stringify({
                latitude:
                  location.latitude,

                longitude:
                  location.longitude,

                location_address:
                  `GPS: ${location.latitude.toFixed(
                    6
                  )}, ${location.longitude.toFixed(
                    6
                  )}`,
              }),
            }
          );

        console.log(
          "Check-out response:",
          response
        );

        await loadAttendance();

      } catch (err) {
        console.error(
          "Check-out error:",
          err
        );

        setError(
          err.message ||
            "Unable to check out employee"
        );

        alert(
          err.message ||
            "Unable to check out employee"
        );
      } finally {
        setActionLoading(null);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | ACTION
  |--------------------------------------------------------------------------
  */

  const handleAttendanceAction =
    async (employee) => {
      if (
        employee.status ===
          "Present" ||
        employee.status ===
          "Late"
      ) {
        await handleCheckOut(
          employee
        );
      } else {
        await handleCheckIn(
          employee
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | LOCATION MODAL
  |--------------------------------------------------------------------------
  */

  const openLocation =
    (employee) => {
      setSelectedEmployee(
        employee
      );
    };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        className="
          flex min-h-screen
          items-center justify-center
          bg-[#070b14]
          text-white
        "
      >
        <div className="flex flex-col items-center">
          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-blue-500/10
              text-blue-400
            "
          >
            <Loader2
              size={25}
              className="animate-spin"
            />
          </div>

          <p className="mt-4 text-sm font-semibold">
            Loading attendance...
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Connecting to HR Portal
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        attendance-page
        relative min-h-screen overflow-x-hidden
        bg-slate-50
        p-4 text-slate-900
        dark:bg-[#070b14] dark:text-white
        sm:p-6 lg:p-8
      "
    >
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute -left-40 -top-40
            h-[420px] w-[420px]
            rounded-full
            bg-blue-600/10
            blur-[120px]
            animate-[pulse_7s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute right-[-160px] top-[20%]
            h-[450px] w-[450px]
            rounded-full
            bg-violet-600/10
            blur-[130px]
            animate-[pulse_9s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute bottom-[-200px] left-[35%]
            h-[420px] w-[420px]
            rounded-full
            bg-indigo-600/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute inset-0 opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
            [background-size:50px_50px]
          "
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px]">

        {/* HEADER */}

        <div
          className="
            mb-8 flex flex-col gap-5
            lg:flex-row lg:items-center
            lg:justify-between
            animate-[fadeUp_.6s_ease-out]
          "
        >
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-slate-600">
              <span>HR Portal</span>
              <ChevronRight size={13} />

              <span className="font-medium text-slate-400">
                Attendance
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-blue-500
                  via-indigo-600
                  to-violet-600
                  shadow-lg
                  shadow-blue-900/30
                "
              >
                <CalendarDays size={21} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Attendance
                  </h1>

                  <span
                    className="
                      hidden items-center gap-1
                      rounded-full
                      border border-emerald-500/20
                      bg-emerald-500/10
                      px-2 py-1
                      text-[9px] font-bold
                      text-emerald-400
                      sm:flex
                    "
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    LIVE
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor attendance, check-ins and employee locations.
                </p>
              </div>
            </div>
          </div>

          {/* DATE */}

          <div
            className="
              flex items-center gap-3
              rounded-2xl
              border border-white/[0.08]
              bg-white/[0.045]
              px-4 py-3
              shadow-xl shadow-black/20
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-400
              "
            >
              <CalendarDays size={18} />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Today
              </p>

              <p className="text-sm font-semibold text-slate-200">
                {formatDate(today)}
              </p>
            </div>

            <div className="ml-2 h-8 w-px bg-white/10" />

            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Activity size={14} />
              Live
            </div>

            <button
              onClick={() =>
                loadData(true)
              }
              disabled={refreshing}
              className="
                ml-1 flex h-9 w-9
                items-center justify-center
                rounded-xl
                border border-white/10
                bg-white/5
                text-slate-400
                transition
                hover:bg-white/10
                hover:text-white
                disabled:opacity-50
              "
              title="Refresh"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
              mb-6 flex items-center gap-3
              rounded-xl
              border border-red-500/20
              bg-red-500/10
              px-4 py-3
              text-xs text-red-300
            "
          >
            <AlertCircle size={16} />

            <span className="flex-1">
              {error}
            </span>

            <button
              onClick={() =>
                setError("")
              }
              className="text-red-400 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* STATISTICS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={CheckCircle2}
            label="Present Today"
            value={
              statistics.present
            }
            percentage={
              statistics.presentPercentage
            }
            type="present"
            delay={100}
          />

          <StatCard
            icon={Clock3}
            label="Late Arrivals"
            value={
              statistics.late
            }
            percentage={
              statistics.latePercentage
            }
            type="late"
            delay={180}
          />

          <StatCard
            icon={XCircle}
            label="Absent"
            value={
              statistics.absent
            }
            percentage={
              statistics.absentPercentage
            }
            type="absent"
            delay={260}
          />

          <StatCard
            icon={AlertCircle}
            label="Not Marked"
            value={
              statistics.notMarked
            }
            percentage={
              statistics.notMarkedPercentage
            }
            type="marked"
            delay={340}
          />
        </div>

        {/* DEPARTMENTS */}

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Attendance by Department
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Select a department to filter employees.
              </p>
            </div>

            <Sparkles
              size={17}
              className="text-indigo-400"
            />
          </div>

          <div className="attendance-scroll flex gap-3 overflow-x-auto pb-3">
            {departments.map(
              (department) => {
                const active =
                  selectedDepartment ===
                  department.name;

                return (
                  <button
                    key={
                      department.name
                    }
                    onClick={() =>
                      setSelectedDepartment(
                        department.name
                      )
                    }
                    className={`
                      group flex min-w-fit
                      items-center gap-3
                      rounded-xl border px-4 py-3
                      transition-all duration-300
                      ${
                        active
                          ? "border-blue-500/30 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-violet-600/90 text-white shadow-lg shadow-blue-900/30"
                          : "border-white/[0.07] bg-white/[0.035] text-slate-500 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-slate-200"
                      }
                    `}
                  >
                    <Users size={15} />

                    <span className="text-xs font-semibold">
                      {
                        department.name
                      }
                    </span>

                    <span
                      className={`
                        rounded-full
                        px-2 py-0.5
                        text-[9px] font-bold
                        ${
                          active
                            ? "bg-white/15 text-white"
                            : "bg-white/5 text-slate-600"
                        }
                      `}
                    >
                      {
                        department.count
                      }
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* TABLE */}

        <section
          className="
            overflow-hidden rounded-2xl
            portal-card
            border border-white/[0.08]
            bg-white/[0.035]
            shadow-2xl shadow-black/30
            backdrop-blur-xl
            animate-[fadeUp_.7s_ease-out]
          "
        >
          {/* TABLE HEADER */}

          <div className="border-b border-white/[0.07] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">
                    {
                      selectedDepartment
                    }
                  </h2>

                  <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[9px] font-bold text-blue-400">
                    {
                      filteredEmployees.length
                    }{" "}
                    EMPLOYEES
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-600">
                  Today's employee attendance records.
                </p>
              </div>

              {/* SEARCH */}

              <div
                className="
                  group flex h-11 items-center
                  rounded-xl
                  border border-white/[0.08]
                  bg-white/[0.035]
                  px-3
                  transition-all duration-300
                  focus-within:border-blue-500/40
                  focus-within:bg-blue-500/[0.03]
                  focus-within:shadow-lg
                  focus-within:shadow-blue-500/5
                "
              >
                <Search
                  size={16}
                  className="
                    mr-2 text-slate-600
                    transition-colors
                    group-focus-within:text-blue-400
                  "
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search employee..."
                  className="
                    w-full bg-transparent
                    text-xs text-white
                    outline-none
                    placeholder:text-slate-700
                    sm:w-64
                  "
                />
              </div>
            </div>
          </div>

          {/* DESKTOP */}

          <div className="attendance-scroll hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.015]">
                  {[
                    "Employee",
                    "Department",
                    "Check In",
                    "Check Out",
                    "Location",
                    "Status",
                    "Action",
                  ].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="
                          px-6 py-4
                          text-left
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.14em]
                          text-slate-600
                        "
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map(
                  (
                    employee,
                    index
                  ) => {
                    const status =
                      statusConfig[
                        employee.status
                      ] ||
                      statusConfig[
                        "Not Marked"
                      ];

                    const isLoading =
                      actionLoading ===
                      employee.databaseId;

                    return (
                      <tr
                        key={
                          employee.databaseId
                        }
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                        className="
                          group
                          border-b border-white/[0.045]
                          animate-[fadeUp_.45s_ease-out_both]
                          transition-colors duration-300
                          hover:bg-white/[0.025]
                        "
                      >
                        {/* EMPLOYEE */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                relative flex h-10 w-10
                                items-center justify-center
                                rounded-full
                                bg-gradient-to-br
                                from-blue-500/20
                                to-violet-500/20
                                text-xs font-bold
                                text-blue-300
                                ring-1 ring-white/10
                                transition-all duration-300
                                group-hover:scale-105
                                group-hover:ring-blue-500/30
                              "
                            >
                              {employee.initials}

                              {(employee.status ===
                                "Present" ||
                                employee.status ===
                                  "Late") && (
                                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#101521] bg-emerald-400" />
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-200">
                                {
                                  employee.name
                                }
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-600">
                                {
                                  employee.employeeCode
                                }{" "}
                                ·{" "}
                                {
                                  employee.position
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DEPARTMENT */}

                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-medium text-slate-500">
                            {
                              employee.department
                            }
                          </span>
                        </td>

                        {/* CHECK IN */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock3
                              size={14}
                              className="text-slate-600"
                            />

                            <span className="text-xs text-slate-400">
                              {
                                employee.checkIn
                              }
                            </span>
                          </div>
                        </td>

                        {/* CHECK OUT */}

                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-500">
                            {
                              employee.checkOut
                            }
                          </span>
                        </td>

                        {/* LOCATION */}

                        <td className="px-6 py-4">
                          {employee.location !==
                          "-" ? (
                            <button
                              type="button"
                              onClick={() =>
                                openLocation(
                                  employee
                                )
                              }
                              className="
                                group/location
                                flex items-center gap-2
                                rounded-lg
                                border border-blue-500/10
                                bg-blue-500/5
                                px-3 py-2
                                text-[10px]
                                font-semibold
                                text-blue-400
                                transition-all
                                duration-300
                                hover:border-blue-500/30
                                hover:bg-blue-500/10
                              "
                            >
                              <MapPin
                                size={13}
                                className="
                                  transition-transform
                                  group-hover/location:-translate-y-0.5
                                "
                              />

                              View Location

                              <Navigation size={10} />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-700">
                              Not available
                            </span>
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">
                          <span
                            className={`
                              inline-flex
                              items-center gap-2
                              rounded-full
                              border
                              px-3 py-1.5
                              text-[10px]
                              font-semibold
                              ${status.bg}
                              ${status.border}
                              ${status.text}
                            `}
                          >
                            <span
                              className={`
                                h-1.5 w-1.5
                                rounded-full
                                ${status.dot}
                                ${
                                  employee.status ===
                                  "Present"
                                    ? "animate-pulse"
                                    : ""
                                }
                              `}
                            />

                            {
                              employee.status
                            }
                          </span>
                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                handleAttendanceAction(
                                  employee
                                )
                              }
                              disabled={
                                isLoading ||
                                employee.status ===
                                  "Absent"
                              }
                              className={`
                                group/btn
                                flex items-center gap-2
                                rounded-lg
                                px-3 py-2
                                text-[10px]
                                font-semibold
                                transition-all duration-300
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                ${
                                  employee.status ===
                                    "Present" ||
                                  employee.status ===
                                    "Late"
                                    ? "border border-white/[0.08] bg-white/[0.025] text-slate-500 hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 hover:shadow-blue-900/40"
                                }
                              `}
                            >
                              {isLoading ? (
                                <Loader2
                                  size={13}
                                  className="animate-spin"
                                />
                              ) : employee.status ===
                                  "Present" ||
                                employee.status ===
                                  "Late" ? (
                                <LogOut
                                  size={13}
                                />
                              ) : (
                                <LogIn
                                  size={13}
                                />
                              )}

                              {isLoading
                                ? "Processing..."
                                : employee.status ===
                                    "Present" ||
                                  employee.status ===
                                    "Late"
                                ? "Check Out"
                                : "Check In"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}

          <div className="divide-y divide-white/[0.06] lg:hidden">
            {filteredEmployees.map(
              (employee) => {
                const status =
                  statusConfig[
                    employee.status
                  ] ||
                  statusConfig[
                    "Not Marked"
                  ];

                const isLoading =
                  actionLoading ===
                  employee.databaseId;

                return (
                  <div
                    key={
                      employee.databaseId
                    }
                    className="
                      p-5
                      transition-colors
                      hover:bg-white/[0.025]
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex h-11 w-11
                            items-center justify-center
                            rounded-full
                            bg-gradient-to-br
                            from-blue-500/20
                            to-violet-500/20
                            text-xs font-bold
                            text-blue-300
                            ring-1 ring-white/10
                          "
                        >
                          {
                            employee.initials
                          }
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            {
                              employee.name
                            }
                          </h3>

                          <p className="mt-1 text-[10px] text-slate-600">
                            {
                              employee.employeeCode
                            }
                          </p>
                        </div>
                      </div>

                      <span
                        className={`
                          inline-flex
                          items-center gap-1.5
                          rounded-full
                          border
                          px-2.5 py-1
                          text-[9px]
                          font-semibold
                          ${status.bg}
                          ${status.border}
                          ${status.text}
                        `}
                      >
                        <span
                          className={`
                            h-1.5 w-1.5
                            rounded-full
                            ${status.dot}
                          `}
                        />

                        {
                          employee.status
                        }
                      </span>
                    </div>

                    <p className="mt-3 text-[10px] text-slate-600">
                      {
                        employee.position
                      }{" "}
                      ·{" "}
                      {
                        employee.department
                      }
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                        <p className="text-[9px] uppercase tracking-wider text-slate-700">
                          Check In
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {
                            employee.checkIn
                          }
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                        <p className="text-[9px] uppercase tracking-wider text-slate-700">
                          Check Out
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {
                            employee.checkOut
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      {employee.location !==
                        "-" && (
                        <button
                          type="button"
                          onClick={() =>
                            openLocation(
                              employee
                            )
                          }
                          className="
                            flex flex-1
                            items-center
                            justify-center gap-2
                            rounded-xl
                            border border-blue-500/10
                            bg-blue-500/5
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-blue-400
                            transition
                            hover:bg-blue-500/10
                          "
                        >
                          <LocateFixed
                            size={14}
                          />
                          Location
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleAttendanceAction(
                            employee
                          )
                        }
                        disabled={
                          isLoading ||
                          employee.status ===
                            "Absent"
                        }
                        className="
                          flex flex-1
                          items-center
                          justify-center gap-2
                          rounded-xl
                          bg-gradient-to-r
                          from-blue-600
                          to-indigo-600
                          py-2.5
                          text-[10px]
                          font-semibold
                          text-white
                          shadow-lg
                          shadow-blue-900/20
                          transition
                          hover:-translate-y-0.5
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {isLoading ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : employee.status ===
                            "Present" ||
                          employee.status ===
                            "Late" ? (
                          <LogOut
                            size={14}
                          />
                        ) : (
                          <LogIn
                            size={14}
                          />
                        )}

                        {isLoading
                          ? "Processing..."
                          : employee.status ===
                              "Present" ||
                            employee.status ===
                              "Late"
                          ? "Check Out"
                          : "Check In"}
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* EMPTY */}

          {filteredEmployees.length ===
            0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-600">
                <Search size={22} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-300">
                No employees found
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Try changing your search or department filter.
              </p>
            </div>
          )}
        </section>

        {/* LOCATION NOTICE */}

        <section
          className="
            relative mt-6 overflow-hidden
            rounded-2xl
            border border-blue-500/10
            bg-gradient-to-r
            from-blue-500/[0.06]
            via-indigo-500/[0.04]
            to-violet-500/[0.06]
            p-5
            shadow-xl shadow-blue-900/5
          "
        >
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex gap-4">
            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-400
              "
            >
              <Navigation size={19} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-blue-200">
                  Location-Based Attendance
                </h3>

                <span
                  className="
                    flex items-center gap-1
                    rounded-full
                    bg-emerald-500/10
                    px-2 py-1
                    text-[8px] font-bold
                    text-emerald-400
                  "
                >
                  <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
                  GPS READY
                </span>
              </div>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">
                When an employee checks in or
                checks out, the browser requests
                the device's GPS location and sends
                the coordinates to the HR Portal
                backend.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "GPS Coordinates",
                  "Check-in Location",
                  "Check-out Location",
                  "Location History",
                ].map((item) => (
                  <span
                    key={item}
                    className="
                      rounded-lg
                      border border-white/[0.06]
                      bg-white/[0.04]
                      px-3 py-1.5
                      text-[9px]
                      font-medium
                      text-slate-500
                    "
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}

        <div className="flex items-center justify-center gap-2 py-6 text-[9px] text-slate-700">
          <ShieldCheck size={13} />

          Attendance records are securely
          managed by HR Portal
        </div>

        {/* LOCATION MODAL */}

        <Modal
          open={Boolean(
            selectedEmployee
          )}
          onClose={() =>
            setSelectedEmployee(null)
          }
          title="Attendance Details"
        >
          {selectedEmployee && (
            <div className="space-y-4 text-sm">

              {/* EMPLOYEE */}

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-blue-500
                    to-violet-600
                    font-bold
                    text-white
                  "
                >
                  {
                    selectedEmployee.initials
                  }
                </div>

                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {
                      selectedEmployee.name
                    }
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {
                      selectedEmployee.employeeCode
                    }{" "}
                    ·{" "}
                    {
                      selectedEmployee.department
                    }
                  </p>
                </div>
              </div>

              {/* DETAILS */}

              <div className="grid grid-cols-2 gap-3">
                {[
                  [
                    "Status",
                    selectedEmployee.status,
                  ],

                  [
                    "Check In",
                    selectedEmployee.checkIn,
                  ],

                  [
                    "Check Out",
                    selectedEmployee.checkOut,
                  ],

                  [
                    "Working Hours",
                    selectedEmployee.workingHours
                      ? `${selectedEmployee.workingHours} hrs`
                      : "-",
                  ],

                  [
                    "Location",
                    selectedEmployee.location,
                  ],
                ].map(
                  ([label, value]) => (
                    <div
                      key={label}
                      className="
                        rounded-xl
                        bg-slate-50
                        p-3
                        dark:bg-slate-800
                      "
                    >
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        {label}
                      </p>

                      <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                        {value}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* GPS */}

              {(selectedEmployee.latitude ||
                selectedEmployee.longitude) && (
                <div
                  className="
                    rounded-xl
                    border border-blue-500/10
                    bg-blue-500/5
                    p-4
                  "
                >
                  <div className="flex items-center gap-2">
                    <Map
                      size={16}
                      className="text-blue-400"
                    />

                    <p className="text-xs font-bold text-blue-300">
                      Check-in GPS
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] uppercase text-slate-500">
                        Latitude
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-300">
                        {
                          selectedEmployee.latitude
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase text-slate-500">
                        Longitude
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-300">
                        {
                          selectedEmployee.longitude
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CHECKOUT GPS */}

              {(selectedEmployee.checkOutLatitude ||
                selectedEmployee.checkOutLongitude) && (
                <div
                  className="
                    rounded-xl
                    border border-emerald-500/10
                    bg-emerald-500/5
                    p-4
                  "
                >
                  <div className="flex items-center gap-2">
                    <LocateFixed
                      size={16}
                      className="text-emerald-400"
                    />

                    <p className="text-xs font-bold text-emerald-300">
                      Check-out GPS
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] uppercase text-slate-500">
                        Latitude
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-300">
                        {
                          selectedEmployee.checkOutLatitude
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase text-slate-500">
                        Longitude
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-300">
                        {
                          selectedEmployee.checkOutLongitude
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MAP LINK */}

              {selectedEmployee.latitude &&
                selectedEmployee.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedEmployee.latitude},${selectedEmployee.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      py-3
                      text-xs
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-blue-900/20
                      transition
                      hover:-translate-y-0.5
                    "
                  >
                    <MapPin size={15} />
                    Open Check-in Location
                  </a>
                )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Attendance;