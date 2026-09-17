import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";

import {
  Users,
  Search,
  Plus,
  Building2,
  Briefcase,
  Eye,
  Mail,
  ChevronDown,
  UserCheck,
  UserX,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| API CONFIG
|--------------------------------------------------------------------------
*/

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


/*
|--------------------------------------------------------------------------
| AUTH TOKEN
|--------------------------------------------------------------------------
*/

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    ""
  );
}


/*
|--------------------------------------------------------------------------
| ALL EMPLOYEES
|--------------------------------------------------------------------------
*/

function AllEmployees() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [employees, setEmployees] = useState([]);

  const [selectedDepartment, setSelectedDepartment] =
    useState("All");

  const [search, setSearch] = useState("");

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /*
  |--------------------------------------------------------------------------
  | FETCH EMPLOYEES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchEmployees();
  }, []);


  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/api/employees?limit=100`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      /*
      |--------------------------------------------------------------------------
      | CHECK RESPONSE
      |--------------------------------------------------------------------------
      */

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error(
          "Non-JSON API response:",
          text
        );

        throw new Error(
          "Backend returned an invalid response. Make sure the API is running on port 5000."
        );
      }


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load employees"
        );
      }


      setEmployees(
        Array.isArray(data.employees)
          ? data.employees
          : []
      );

    } catch (err) {
      console.error(
        "Employees API error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to employee server."
      );

    } finally {
      setLoading(false);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | DEPARTMENTS
  |--------------------------------------------------------------------------
  */

  const departments = useMemo(() => {
    const departmentNames = employees
      .map(
        (employee) =>
          employee.department
      )
      .filter(Boolean);

    return [
      "All",
      ...new Set(departmentNames),
    ];
  }, [employees]);


  /*
  |--------------------------------------------------------------------------
  | DEPARTMENT STATISTICS
  |--------------------------------------------------------------------------
  */

  const departmentStats = useMemo(() => {
    return departments
      .filter(
        (department) =>
          department !== "All"
      )
      .map((department) => ({
        name: department,

        count: employees.filter(
          (employee) =>
            employee.department ===
            department
        ).length,
      }));
  }, [departments, employees]);


  /*
  |--------------------------------------------------------------------------
  | ACTIVE EMPLOYEES
  |--------------------------------------------------------------------------
  */

  const activeEmployees =
    employees.filter(
      (employee) =>
        employee.status === "Active"
    ).length;


  /*
  |--------------------------------------------------------------------------
  | ON LEAVE
  |--------------------------------------------------------------------------
  */

  const onLeaveEmployees =
    employees.filter(
      (employee) =>
        employee.status === "On Leave"
    ).length;


  /*
  |--------------------------------------------------------------------------
  | FILTER EMPLOYEES
  |--------------------------------------------------------------------------
  */

  const filteredEmployees = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return employees.filter(
      (employee) => {
        const matchesDepartment =
          selectedDepartment ===
            "All" ||
          employee.department ===
            selectedDepartment;


        const matchesSearch =
          !searchText ||
          (employee.name || "")
            .toLowerCase()
            .includes(searchText) ||

          (employee.email || "")
            .toLowerCase()
            .includes(searchText) ||

          (employee.id || "")
            .toLowerCase()
            .includes(searchText) ||

          (employee.employee_code || "")
            .toLowerCase()
            .includes(searchText) ||

          (employee.position || "")
            .toLowerCase()
            .includes(searchText);


        return (
          matchesDepartment &&
          matchesSearch
        );
      }
    );
  }, [
    employees,
    selectedDepartment,
    search,
  ]);


  /*
  |--------------------------------------------------------------------------
  | VIEW EMPLOYEE
  |--------------------------------------------------------------------------
  */

  const handleViewEmployee = async (
    employee
  ) => {
    try {
      const token =
        getAuthToken();

      if (!token) {
        setSelectedEmployee(
          employee
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Use numeric database ID where available
      |--------------------------------------------------------------------------
      */

      const employeeDatabaseId =
        employee.database_id ||
        employee.employee_database_id ||
        employee.id;


      /*
      |--------------------------------------------------------------------------
      | If employee.id is EMP-001,
      | use the employee directly.
      |--------------------------------------------------------------------------
      */

      if (
        String(employeeDatabaseId)
          .startsWith("EMP-")
      ) {
        setSelectedEmployee(
          employee
        );

        return;
      }


      const response =
        await fetch(
          `${API_URL}/api/employees/${employeeDatabaseId}`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );


      const data =
        await response.json();


      if (
        response.ok &&
        data.employee
      ) {
        setSelectedEmployee(
          data.employee
        );
      } else {
        setSelectedEmployee(
          employee
        );
      }

    } catch (err) {
      console.error(
        "Employee details error:",
        err
      );

      setSelectedEmployee(
        employee
      );
    }
  };


  /*
  |--------------------------------------------------------------------------
  | STATUS CLASS
  |--------------------------------------------------------------------------
  */

  const getStatusColor = (
    status
  ) => {
    if (status === "Active") {
      return {
        badge:
          "bg-emerald-500/10 text-emerald-500",
        dot:
          "bg-emerald-500",
      };
    }

    if (status === "On Leave") {
      return {
        badge:
          "bg-amber-500/10 text-amber-500",
        dot:
          "bg-amber-500",
      };
    }

    return {
      badge:
        "bg-red-500/10 text-red-500",
      dot:
        "bg-red-500",
    };
  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="all-employees-page relative min-h-[calc(100vh-76px)] overflow-hidden bg-slate-50 px-4 py-6 text-slate-900 transition-colors duration-300 dark:bg-[#070b14] dark:text-white sm:px-6 lg:px-8">


      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="absolute right-[-150px] top-[15%] h-[420px] w-[420px] animate-pulse rounded-full bg-violet-500/10 blur-[130px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[130px]" />

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(59,130,246,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.7)_1px,transparent_1px)]
            [background-size:45px_45px]
          "
        />

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-7">


        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="flex animate-[fadeIn_.5s_ease-out] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div
              className="
                flex h-14 w-14 shrink-0 items-center justify-center
                rounded-2xl
                bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600
                text-white
                shadow-xl shadow-blue-500/20
                transition-all duration-300
                hover:-translate-y-1 hover:rotate-2
              "
            >
              <Users size={25} />
            </div>


            <div>

              <div className="mb-1 flex items-center gap-2">

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-500">
                  HR Management
                </span>

                <span className="h-1 w-1 rounded-full bg-violet-500" />

                <span className="text-[10px] text-slate-400">
                  Workforce
                </span>

              </div>


              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                All Employees
              </h1>


              <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                Manage and view your organization's workforce.
              </p>

            </div>

          </div>


          <button
            onClick={() =>
              navigate("/employees/add")
            }
            className="
              group flex items-center justify-center gap-2
              rounded-xl
              bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600
              px-5 py-3
              text-sm font-semibold text-white
              shadow-lg shadow-blue-600/20
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl hover:shadow-blue-600/30
              active:scale-95
            "
          >

            <Plus
              size={18}
              className="transition-transform duration-300 group-hover:rotate-90"
            />

            Add Employee

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />

          </button>

        </div>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div
            className="
              rounded-2xl
              border border-red-500/20
              bg-red-500/5
              px-5 py-4
              text-sm
              text-red-500
            "
          >
            <div className="flex items-center justify-between gap-4">

              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={fetchEmployees}
                className="
                  rounded-lg
                  bg-red-500/10
                  px-3 py-1.5
                  text-xs font-semibold
                  transition
                  hover:bg-red-500/20
                "
              >
                Retry
              </button>

            </div>
          </div>
        )}


        {/* ===================================================
            STATS
        =================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


          {/* TOTAL */}

          <div
            className="
              group portal-card portal-card-interactive relative isolate overflow-hidden animate-card-in
              rounded-2xl
              border border-slate-200
              bg-white
              p-5
              shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl hover:shadow-blue-500/10
              dark:border-white/[0.08]
              dark:bg-white/[0.035]
            "
          >

            <div className="pointer-events-none absolute z-0 -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Employees
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {loading ? "—" : employees.length}
                </h2>

                <p className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-500">
                  <Sparkles size={12} />
                  Across all departments
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Users size={22} />
              </div>

            </div>

          </div>


          {/* ACTIVE */}

          <div
            className="
              group portal-card portal-card-interactive relative isolate overflow-hidden animate-card-in
              rounded-2xl
              border border-slate-200
              bg-white
              p-5
              shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl hover:shadow-emerald-500/10
              dark:border-white/[0.08]
              dark:bg-white/[0.035]
            "
          >

            <div className="pointer-events-none absolute z-0 -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Active Employees
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {loading ? "—" : activeEmployees}
                </h2>

                <p className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-500">
                  <UserCheck size={12} />
                  Currently working
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-transform duration-300 group-hover:scale-110">
                <Briefcase size={22} />
              </div>

            </div>

          </div>


          {/* DEPARTMENTS */}

          <div
            className="
              group portal-card portal-card-interactive relative isolate overflow-hidden animate-card-in
              rounded-2xl
              border border-slate-200
              bg-white
              p-5
              shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl hover:shadow-violet-500/10
              dark:border-white/[0.08]
              dark:bg-white/[0.035]
            "
          >

            <div className="pointer-events-none absolute z-0 -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Departments
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {loading ? "—" : departmentStats.length}
                </h2>

                <p className="mt-3 text-xs font-medium text-violet-500">
                  Active company departments
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Building2 size={22} />
              </div>

            </div>

          </div>


          {/* LEAVE */}

          <div
            className="
              group portal-card portal-card-interactive relative isolate overflow-hidden animate-card-in
              rounded-2xl
              border border-slate-200
              bg-white
              p-5
              shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl hover:shadow-amber-500/10
              dark:border-white/[0.08]
              dark:bg-white/[0.035]
            "
          >

            <div className="pointer-events-none absolute z-0 -right-10 -top-10 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  On Leave
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {loading ? "—" : onLeaveEmployees}
                </h2>

                <p className="mt-3 text-xs font-medium text-amber-500">
                  Employees unavailable
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-transform duration-300 group-hover:scale-110">
                <CalendarDays size={22} />
              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            DEPARTMENT SECTION
        =================================================== */}

        <section>

          <div className="mb-4">

            <div className="flex items-center gap-2">

              <h2 className="text-lg font-bold">
                Browse by Department
              </h2>

              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold text-blue-500">
                {departmentStats.length}
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Select a department to filter employees.
            </p>

          </div>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            {departmentStats.map(
              (department, index) => {

                const isSelected =
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
                    style={{
                      animationDelay:
                        `${index * 80}ms`,
                    }}
                    className={`
                      group portal-card portal-card-interactive relative isolate overflow-hidden animate-card-in
                      rounded-2xl
                      border
                      p-5
                      text-left
                      transition-all duration-300
                      animate-[fadeUp_.5s_ease-out_both]

                      ${
                        isSelected
                          ? `
                            border-transparent
                            bg-gradient-to-br
                            from-blue-600
                            via-indigo-600
                            to-violet-600
                            text-white
                            shadow-xl
                            shadow-blue-600/20
                            -translate-y-1
                          `
                          : `
                            border-slate-200
                            bg-white
                            hover:-translate-y-1
                            hover:border-blue-300
                            hover:shadow-xl
                            hover:shadow-blue-500/10
                            dark:border-white/[0.08]
                            dark:bg-white/[0.035]
                          `
                      }
                    `}
                  >

                    <div
                      className={`
                        pointer-events-none absolute z-0 -right-10 -top-10 h-24 w-24 rounded-full blur-2xl
                        transition-transform duration-500
                        group-hover:scale-150
                        ${
                          isSelected
                            ? "bg-white/10"
                            : "bg-blue-500/10"
                        }
                      `}
                    />


                    <div className="relative z-10 flex items-center justify-between">

                      <div
                        className={`
                          flex h-10 w-10 items-center justify-center rounded-xl
                          transition-all duration-300
                          group-hover:scale-110 group-hover:rotate-3
                          ${
                            isSelected
                              ? "bg-white/15 text-white"
                              : "bg-blue-500/10 text-blue-500"
                          }
                        `}
                      >
                        <Building2 size={20} />
                      </div>


                      <ChevronDown
                        size={17}
                        className={`
                          transition-transform duration-300
                          ${
                            isSelected
                              ? "rotate-180 text-white"
                              : "text-slate-400 group-hover:text-blue-500"
                          }
                        `}
                      />

                    </div>


                    <h3 className="relative z-10 mt-5 text-sm font-bold">
                      {department.name}
                    </h3>


                    <p
                      className={`
                        relative z-10 mt-1 text-xs
                        ${
                          isSelected
                            ? "text-blue-100"
                            : "text-slate-500"
                        }
                      `}
                    >
                      {department.count} Employee
                      {department.count > 1
                        ? "s"
                        : ""}
                    </p>

                  </button>
                );
              }
            )}

          </div>

        </section>


        {/* ===================================================
            EMPLOYEE TABLE
        =================================================== */}

        <section
          className="
            portal-card
            overflow-hidden
            rounded-3xl
            border border-slate-200
            bg-white
            shadow-sm
            dark:border-white/[0.08]
            dark:bg-white/[0.035]
            transition-all duration-300
          "
        >


          {/* TABLE HEADER */}

          <div className="border-b border-slate-200 p-5 dark:border-white/[0.08]">

            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-lg font-bold">
                    {selectedDepartment ===
                    "All"
                      ? "All Employees"
                      : `${selectedDepartment} Employees`}
                  </h2>

                  <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-500">
                    {filteredEmployees.length}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Showing employees matching your selection.
                </p>

              </div>


              <div className="flex flex-col gap-3 sm:flex-row">


                {/* SEARCH */}

                <div className="group relative">

                  <Search
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition-colors
                      group-focus-within:text-blue-500
                    "
                  />


                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="Search employees..."
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      pl-10
                      pr-4
                      text-sm
                      outline-none
                      transition-all
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-500/10
                      dark:border-white/[0.08]
                      dark:bg-white/[0.035]
                      dark:text-white
                      dark:focus:bg-white/[0.05]
                      sm:w-72
                    "
                  />

                </div>


                {/* DEPARTMENT */}

                <div className="relative">

                  <select
                    value={
                      selectedDepartment
                    }
                    onChange={(e) =>
                      setSelectedDepartment(
                        e.target.value
                      )
                    }
                    className="
                      h-11
                      w-full
                      appearance-none
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      pr-10
                      text-sm
                      font-medium
                      text-slate-700
                      outline-none
                      transition-all
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      dark:border-white/[0.08]
                      dark:bg-white/[0.035]
                      dark:text-white
                      sm:w-52
                    "
                  >

                    {departments.map(
                      (department) => (
                        <option
                          key={department}
                          value={department}
                          className="bg-white text-slate-900 dark:bg-[#111827] dark:text-white"
                        >
                          {department ===
                          "All"
                            ? "All Departments"
                            : department}
                        </option>
                      )
                    )}

                  </select>


                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex flex-col items-center gap-3">

                <div
                  className="
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-2
                    border-blue-500
                    border-t-transparent
                  "
                />

                <p className="text-sm text-slate-500">
                  Loading employees...
                </p>

              </div>

            </div>
          )}


          {/* =================================================
              TABLE
          ================================================= */}

          {!loading && (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-white/[0.06] dark:bg-white/[0.02]">

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Employee ID
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Position
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">

                  {filteredEmployees.map(
                    (employee, index) => {

                      const statusColors =
                        getStatusColor(
                          employee.status
                        );

                      return (
                        <tr
                          key={
                            employee.id
                          }
                          style={{
                            animationDelay:
                              `${index * 40}ms`,
                          }}
                          className="
                            group
                            animate-[fadeUp_.4s_ease-out_both]
                            transition-all duration-200
                            hover:bg-blue-500/[0.025]
                            dark:hover:bg-white/[0.025]
                          "
                        >


                          {/* EMPLOYEE */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div
                                className="
                                  relative
                                  flex h-11 w-11 shrink-0
                                  items-center justify-center
                                  rounded-full
                                  bg-gradient-to-br
                                  from-blue-500
                                  via-indigo-500
                                  to-violet-600
                                  text-xs
                                  font-bold
                                  text-white
                                  shadow-md
                                  shadow-blue-500/10
                                  transition-transform
                                  duration-300
                                  group-hover:scale-110
                                "
                              >

                                {employee.initials ||
                                  "NA"}


                                <span
                                  className={`
                                    absolute
                                    bottom-0
                                    right-0
                                    h-2.5
                                    w-2.5
                                    rounded-full
                                    border-2
                                    border-white
                                    dark:border-[#111827]
                                    ${statusColors.dot}
                                  `}
                                />

                              </div>


                              <div>

                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                  {employee.name ||
                                    "Unnamed Employee"}
                                </p>

                                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">

                                  <Mail size={11} />

                                  {employee.email ||
                                    "No email"}

                                </p>

                              </div>

                            </div>

                          </td>


                          {/* ID */}

                          <td className="px-6 py-4">

                            <span
                              className="
                                rounded-lg
                                border
                                border-blue-500/10
                                bg-blue-500/5
                                px-3
                                py-1.5
                                text-[11px]
                                font-bold
                                text-blue-500
                              "
                            >
                              {employee.id}
                            </span>

                          </td>


                          {/* DEPARTMENT */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2">

                              <Building2
                                size={15}
                                className="text-slate-400"
                              />

                              <span className="text-sm text-slate-600 dark:text-slate-300">
                                {employee.department ||
                                  "Unassigned"}
                              </span>

                            </div>

                          </td>


                          {/* POSITION */}

                          <td className="px-6 py-4">

                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {employee.position ||
                                "Not Assigned"}
                            </span>

                          </td>


                          {/* STATUS */}

                          <td className="px-6 py-4">

                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold
                                ${statusColors.badge}
                              `}
                            >

                              <span
                                className={`
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  ${statusColors.dot}
                                `}
                              />

                              {employee.status ||
                                "Unknown"}

                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="px-6 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                handleViewEmployee(
                                  employee
                                )
                              }
                              className="
                                inline-flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-transparent
                                text-slate-400
                                transition-all
                                duration-200
                                hover:border-blue-500/10
                                hover:bg-blue-500/10
                                hover:text-blue-500
                                hover:scale-110
                                active:scale-95
                              "
                              title="View employee"
                            >
                              <Eye
                                size={17}
                              />
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}


                  {/* EMPTY */}

                  {filteredEmployees.length ===
                    0 && (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-6 py-20 text-center"
                      >

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">

                          <UserX
                            size={28}
                          />

                        </div>


                        <h3 className="mt-4 text-sm font-bold">
                          No employees found
                        </h3>


                        <p className="mt-1 text-xs text-slate-500">
                          Try another department or search term.
                        </p>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>
          )}


        </section>


        {/* ===================================================
            FOOTER INFO
        =================================================== */}

        <div className="flex flex-col items-center justify-between gap-2 pb-5 text-[10px] text-slate-400 sm:flex-row">

          <span>
            Showing{" "}
            {filteredEmployees.length}{" "}
            of{" "}
            {employees.length}{" "}
            employees
          </span>


          <span className="flex items-center gap-1">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            HR Portal Workforce Management

          </span>

        </div>

          
        {/* ===================================================
            EMPLOYEE DETAILS MODAL
        =================================================== */}

        <Modal
          open={
            Boolean(
              selectedEmployee
            )
          }
          onClose={() =>
            setSelectedEmployee(
              null
            )
          }
          title="Employee Details"
        >

          {selectedEmployee && (

            <div className="space-y-4 text-sm">


              {/* HEADER */}

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 font-bold text-white">

                  {selectedEmployee.initials ||
                    "NA"}

                </div>


                <div>

                  <p className="font-bold text-slate-900 dark:text-white">
                    {selectedEmployee.name ||
                      "Unnamed Employee"}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedEmployee.email ||
                      "No email"}
                  </p>

                </div>

              </div>


              {/* DETAILS */}

              <div className="grid grid-cols-2 gap-3">

                {[
                  [
                    "Employee ID",
                    selectedEmployee.id,
                  ],

                  [
                    "Department",
                    selectedEmployee.department ||
                      "Unassigned",
                  ],

                  [
                    "Position",
                    selectedEmployee.position ||
                      "Not Assigned",
                  ],

                  [
                    "Status",
                    selectedEmployee.status ||
                      "Unknown",
                  ],

                  [
                    "Phone",
                    selectedEmployee.phone ||
                      "Not provided",
                  ],

                  [
                    "Manager",
                    selectedEmployee.manager_name ||
                      "Not assigned",
                  ],

                  [
                    "Joining Date",
                    selectedEmployee.joining_date ||
                      "Not provided",
                  ],

                  [
                    "Employment Type",
                    selectedEmployee.employment_type ||
                      "Not provided",
                  ],
                ].map(
                  ([label, value]) => (

                    <div
                      key={label}
                      className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"
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


              {/* CONTACT / LOCATION */}

              {(selectedEmployee.city ||
                selectedEmployee.country ||
                selectedEmployee.address) && (

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Address
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">

                    {[
                      selectedEmployee.address,
                      selectedEmployee.city,
                      selectedEmployee.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}

                  </p>

                </div>

              )}

            </div>

          )}

        </Modal>


      </div>


      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`

        @keyframes fadeIn {

          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }


        @keyframes fadeUp {

          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

      `}</style>

    </div> 
  );
}


export default AllEmployees;  