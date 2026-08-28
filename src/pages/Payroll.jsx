import { useState } from "react";
import {
  CalendarDays,
  Users,
  WalletCards,
  CheckCircle2,
  Clock3,
  Search,
  Eye,
  Download,
  MoreVertical,
  ChevronDown,
  Banknote,
  TrendingUp,
  Receipt,
} from "lucide-react";

const departments = [
  { name: "All Departments", count: 48 },
  { name: "Engineering", count: 12 },
  { name: "Human Resources", count: 6 },
  { name: "Marketing", count: 8 },
  { name: "Finance", count: 7 },
  { name: "Operations", count: 9 },
  { name: "Design", count: 6 },
];

const payrollData = [
  {
    id: "EMP-001",
    name: "Ahmed Khan",
    initials: "AK",
    position: "Senior Software Engineer",
    department: "Engineering",
    basicSalary: 180000,
    allowances: 35000,
    deductions: 15000,
    netSalary: 200000,
    status: "Paid",
  },
  {
    id: "EMP-002",
    name: "Bilal Shah",
    initials: "BS",
    position: "Frontend Developer",
    department: "Engineering",
    basicSalary: 140000,
    allowances: 25000,
    deductions: 10000,
    netSalary: 155000,
    status: "Pending",
  },
  {
    id: "EMP-003",
    name: "Sara Hassan",
    initials: "SH",
    position: "HR Manager",
    department: "Human Resources",
    basicSalary: 165000,
    allowances: 30000,
    deductions: 12000,
    netSalary: 183000,
    status: "Paid",
  },
  {
    id: "EMP-004",
    name: "Fatima Noor",
    initials: "FN",
    position: "HR Executive",
    department: "Human Resources",
    basicSalary: 95000,
    allowances: 15000,
    deductions: 7000,
    netSalary: 103000,
    status: "Processing",
  },
  {
    id: "EMP-005",
    name: "Muhammad Ali",
    initials: "MA",
    position: "Marketing Executive",
    department: "Marketing",
    basicSalary: 120000,
    allowances: 22000,
    deductions: 9000,
    netSalary: 133000,
    status: "Paid",
  },
  {
    id: "EMP-006",
    name: "Ayesha Malik",
    initials: "AM",
    position: "Financial Analyst",
    department: "Finance",
    basicSalary: 135000,
    allowances: 20000,
    deductions: 10000,
    netSalary: 145000,
    status: "Pending",
  },
  {
    id: "EMP-007",
    name: "Usman Ahmed",
    initials: "UA",
    position: "Operations Manager",
    department: "Operations",
    basicSalary: 155000,
    allowances: 28000,
    deductions: 13000,
    netSalary: 170000,
    status: "Paid",
  },
  {
    id: "EMP-008",
    name: "Hina Raza",
    initials: "HR",
    position: "UI/UX Designer",
    department: "Design",
    basicSalary: 115000,
    allowances: 18000,
    deductions: 8000,
    netSalary: 125000,
    status: "Processing",
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
};

function StatusBadge({ status }) {
  const styles = {
    Paid: "border-emerald-100 bg-emerald-50 text-emerald-700",
    Pending: "border-amber-100 bg-amber-50 text-amber-700",
    Processing: "border-blue-100 bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status]
      }`}
    >
      {status === "Paid" && <CheckCircle2 size={13} />}
      {status === "Pending" && <Clock3 size={13} />}
      {status === "Processing" && <TrendingUp size={13} />}
      {status}
    </span>
  );
}

function Payroll() {
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");

  const [selectedMonth, setSelectedMonth] =
    useState("August 2026");

  const [search, setSearch] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("All");

  const filteredPayroll = payrollData.filter((employee) => {
    const departmentMatch =
      selectedDepartment === "All Departments" ||
      employee.department === selectedDepartment;

    const statusMatch =
      selectedStatus === "All" ||
      employee.status === selectedStatus;

    const searchMatch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.id.toLowerCase().includes(search.toLowerCase()) ||
      employee.department.toLowerCase().includes(search.toLowerCase());

    return departmentMatch && statusMatch && searchMatch;
  });

  const totalPayroll = payrollData.reduce(
    (total, employee) => total + employee.netSalary,
    0
  );

  const totalBasicSalary = payrollData.reduce(
    (total, employee) => total + employee.basicSalary,
    0
  );

  const totalAllowances = payrollData.reduce(
    (total, employee) => total + employee.allowances,
    0
  );

  const totalDeductions = payrollData.reduce(
    (total, employee) => total + employee.deductions,
    0
  );

  const paidCount = payrollData.filter(
    (employee) => employee.status === "Paid"
  ).length;

  const pendingCount = payrollData.filter(
    (employee) => employee.status === "Pending"
  ).length;

  return (
    <div className="payroll-page min-h-screen overflow-x-hidden bg-slate-50 p-4 text-slate-900 transition-colors duration-300 dark:bg-[#080d18] dark:text-slate-100 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Nexora HR</span>
            <span>/</span>
            <span className="font-medium text-slate-700">
              Payroll
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Payroll
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage employee salaries, deductions and monthly payroll.
          </p>
        </div>

        {/* MONTH */}
        <div className="portal-card flex items-center gap-3 px-4 py-3">

          <CalendarDays
            size={18}
            className="text-indigo-600"
          />

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Payroll Month
            </p>

            <p className="text-sm font-semibold text-slate-800">
              {selectedMonth}
            </p>
          </div>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

        <button
          className="
            flex items-center justify-center gap-2 rounded-xl
            border border-slate-200 bg-white px-5 py-3
            text-sm font-semibold text-slate-600 shadow-sm
            transition hover:border-indigo-200 hover:bg-indigo-50
            hover:text-indigo-600
          "
        >
          <Download size={17} />
          Export Payroll
        </button>

        <button
          className="
            flex items-center justify-center gap-2 rounded-xl
            bg-indigo-600 px-5 py-3 text-sm font-semibold
            text-white shadow-lg shadow-indigo-600/20
            transition hover:bg-indigo-700
          "
        >
          <Banknote size={17} />
          Process Payroll
        </button>

      </div>

      {/* SUMMARY CARDS */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL PAYROLL */}
        <div className="portal-card portal-card-interactive group p-5">

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 dark:bg-indigo-500/10 dark:text-indigo-300">
              <WalletCards size={21} />
            </div>

            <span className="text-xs font-semibold text-indigo-600">
              August
            </span>

          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total Payroll
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {formatCurrency(totalPayroll)}
          </h2>

        </div>

        {/* EMPLOYEES */}
        <div className="portal-card portal-card-interactive group p-5">

          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 dark:bg-blue-500/10 dark:text-blue-300">
              <Users size={21} />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-300">
              Workforce
            </span>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Employees
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {payrollData.length}
          </h2>

        </div>

        {/* PAID */}
        <div className="portal-card portal-card-interactive group p-5">

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2 size={21} />
            </div>

            <span className="text-xs font-semibold text-emerald-600">
              Completed
            </span>

          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Paid Employees
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {paidCount}
          </h2>

        </div>

        {/* PENDING */}
        <div className="portal-card portal-card-interactive group p-5">

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 dark:bg-amber-500/10 dark:text-amber-300">
              <Clock3 size={21} />
            </div>

            <span className="text-xs font-semibold text-amber-600">
              Action Required
            </span>

          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pending Payroll
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {pendingCount}
          </h2>

        </div>

      </div>

      {/* PAYROLL BREAKDOWN */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">

        {/* BASIC */}
        <div className="portal-card p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Receipt size={19} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Basic Salary
              </p>

              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(totalBasicSalary)}
              </p>
            </div>

          </div>

        </div>

        {/* ALLOWANCES */}
        <div className="portal-card p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              <TrendingUp size={19} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Allowances
              </p>

              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(totalAllowances)}
              </p>
            </div>

          </div>

        </div>

        {/* DEDUCTIONS */}
        <div className="portal-card p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300">
              <Banknote size={19} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Deductions
              </p>

              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(totalDeductions)}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* DEPARTMENT */}
      <div className="mb-6">

        <div className="mb-4">

          <h2 className="text-lg font-bold text-slate-900">
            Payroll by Department
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a department to view employee payroll.
          </p>

        </div>

        <div className="payroll-scroll flex gap-3 overflow-x-auto pb-3">

          {departments.map((department) => (

            <button
              key={department.name}
              onClick={() =>
                setSelectedDepartment(department.name)
              }
              className={`
                flex min-w-fit items-center gap-3 rounded-xl
                border px-4 py-3 transition
                ${
                  selectedDepartment === department.name
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                }
              `}
            >

              <Users size={16} />

              <span className="text-sm font-semibold">
                {department.name}
              </span>

              <span
                className={`
                  rounded-full px-2 py-0.5 text-[10px]
                  ${
                    selectedDepartment === department.name
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }
                `}
              >
                {department.count}
              </span>

            </button>

          ))}

        </div>

      </div>

      {/* PAYROLL TABLE */}
      <div className="portal-card overflow-hidden">

        {/* TOOLBAR */}
        <div className="border-b border-slate-200 p-5 sm:p-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                {selectedDepartment === "All Departments"
                  ? "Employee Payroll"
                  : `${selectedDepartment} Payroll`}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredPayroll.length} employees
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}
              <div
                className="
                  flex h-11 items-center rounded-xl
                  border border-slate-200 bg-slate-50 px-3
                  focus-within:border-indigo-400
                  focus-within:bg-white
                "
              >

                <Search
                  size={17}
                  className="mr-2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search employee..."
                  className="
                    w-full bg-transparent text-sm outline-none
                    placeholder:text-slate-400 sm:w-56
                  "
                />

              </div>

              {/* MONTH */}
              <div className="relative">

                <select
                  value={selectedMonth}
                  onChange={(e) =>
                    setSelectedMonth(e.target.value)
                  }
                  className="
                    h-11 appearance-none rounded-xl
                    border border-slate-200 bg-white
                    pl-4 pr-10 text-sm font-medium
                    text-slate-600 outline-none
                    focus:border-indigo-400
                  "
                >
                  <option>August 2026</option>
                  <option>July 2026</option>
                  <option>June 2026</option>
                  <option>May 2026</option>
                </select>

                <ChevronDown
                  size={15}
                  className="
                    pointer-events-none absolute right-3
                    top-1/2 -translate-y-1/2 text-slate-400
                  "
                />

              </div>

            </div>

          </div>

          {/* STATUS FILTER */}
          <div className="payroll-scroll mt-5 flex gap-2 overflow-x-auto pb-1">

            {["All", "Paid", "Pending", "Processing"].map(
              (status) => {

                const count =
                  status === "All"
                    ? payrollData.length
                    : payrollData.filter(
                        (employee) =>
                          employee.status === status
                      ).length;

                return (
                  <button
                    key={status}
                    onClick={() =>
                      setSelectedStatus(status)
                    }
                    className={`
                      flex items-center gap-2 rounded-lg
                      px-4 py-2 text-xs font-semibold transition
                      ${
                        selectedStatus === status
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                      }
                    `}
                  >

                    {status}

                    <span
                      className={`
                        rounded-full px-2 py-0.5 text-[10px]
                        ${
                          selectedStatus === status
                            ? "bg-white/15 text-white"
                            : "bg-white text-slate-500"
                        }
                      `}
                    >
                      {count}
                    </span>

                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* DESKTOP TABLE */}
        <div className="payroll-scroll hidden overflow-x-auto lg:block">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Employee
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Basic Salary
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Allowances
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Deductions
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Net Salary
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPayroll.map((employee) => (

                <tr
                  key={employee.id}
                  className="border-b border-slate-100 transition hover:bg-indigo-50/30"
                >

                  {/* EMPLOYEE */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="
                        flex h-10 w-10 items-center
                        justify-center rounded-full
                        bg-indigo-100 text-xs font-bold
                        text-indigo-700
                      ">
                        {employee.initials}
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-900">
                          {employee.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {employee.id} • {employee.position}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* DEPARTMENT */}
                  <td className="px-6 py-5">

                    <span className="
                      rounded-lg bg-slate-100 px-3 py-1.5
                      text-xs font-medium text-slate-600
                    ">
                      {employee.department}
                    </span>

                  </td>

                  {/* BASIC */}
                  <td className="
                    px-6 py-5 text-right
                    text-sm font-medium text-slate-700
                  ">
                    {formatCurrency(employee.basicSalary)}
                  </td>

                  {/* ALLOWANCES */}
                  <td className="
                    px-6 py-5 text-right
                    text-sm font-medium text-emerald-600
                  ">
                    +{formatCurrency(employee.allowances)}
                  </td>

                  {/* DEDUCTIONS */}
                  <td className="
                    px-6 py-5 text-right
                    text-sm font-medium text-red-500
                  ">
                    -{formatCurrency(employee.deductions)}
                  </td>

                  {/* NET */}
                  <td className="px-6 py-5 text-right">

                    <p className="text-sm font-bold text-slate-900">
                      {formatCurrency(employee.netSalary)}
                    </p>

                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <StatusBadge status={employee.status} />
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5">

                    <div className="flex justify-end gap-2">

                      <button
                        title="View Payslip"
                        className="
                          flex h-9 w-9 items-center justify-center
                          rounded-lg border border-slate-200
                          text-slate-400 transition
                          hover:border-indigo-200
                          hover:bg-indigo-50
                          hover:text-indigo-600
                        "
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Download Payslip"
                        className="
                          flex h-9 w-9 items-center justify-center
                          rounded-lg border border-slate-200
                          text-slate-400 transition
                          hover:border-indigo-200
                          hover:bg-indigo-50
                          hover:text-indigo-600
                        "
                      >
                        <Download size={16} />
                      </button>

                      <button
                        title="More"
                        className="
                          flex h-9 w-9 items-center justify-center
                          rounded-lg border border-slate-200
                          text-slate-400 transition
                          hover:border-indigo-200
                          hover:bg-indigo-50
                          hover:text-indigo-600
                        "
                      >
                        <MoreVertical size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* MOBILE */}
        <div className="divide-y divide-slate-100 lg:hidden">

          {filteredPayroll.map((employee) => (

            <div
              key={employee.id}
              className="p-5"
            >

              {/* EMPLOYEE */}
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="
                    flex h-11 w-11 items-center
                    justify-center rounded-full
                    bg-indigo-100 text-xs font-bold
                    text-indigo-700
                  ">
                    {employee.initials}
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {employee.name}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {employee.department}
                    </p>

                  </div>

                </div>

                <StatusBadge status={employee.status} />

              </div>

              {/* SALARY */}
              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-[10px] uppercase text-slate-400">
                    Basic
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {formatCurrency(employee.basicSalary)}
                  </p>

                </div>

                <div className="rounded-xl bg-emerald-50 p-3">

                  <p className="text-[10px] uppercase text-emerald-600">
                    Allowances
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    +{formatCurrency(employee.allowances)}
                  </p>

                </div>

                <div className="rounded-xl bg-red-50 p-3">

                  <p className="text-[10px] uppercase text-red-500">
                    Deductions
                  </p>

                  <p className="mt-1 text-sm font-semibold text-red-600">
                    -{formatCurrency(employee.deductions)}
                  </p>

                </div>

                <div className="rounded-xl bg-indigo-50 p-3">

                  <p className="text-[10px] uppercase text-indigo-600">
                    Net Salary
                  </p>

                  <p className="mt-1 text-sm font-bold text-indigo-700">
                    {formatCurrency(employee.netSalary)}
                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-2">

                <button
                  className="
                    flex flex-1 items-center justify-center
                    gap-2 rounded-xl border border-slate-200
                    py-2.5 text-xs font-semibold
                    text-slate-600 transition
                    hover:border-indigo-200
                    hover:bg-indigo-50
                    hover:text-indigo-600
                  "
                >
                  <Eye size={15} />
                  Payslip
                </button>

                <button
                  className="
                    flex flex-1 items-center justify-center
                    gap-2 rounded-xl border border-slate-200
                    py-2.5 text-xs font-semibold
                    text-slate-600 transition
                    hover:border-indigo-200
                    hover:bg-indigo-50
                    hover:text-indigo-600
                  "
                >
                  <Download size={15} />
                  Download
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* EMPTY */}
        {filteredPayroll.length === 0 && (

          <div className="p-16 text-center">

            <div className="
              mx-auto flex h-14 w-14 items-center
              justify-center rounded-2xl
              bg-indigo-50 text-indigo-400
            ">
              <WalletCards size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No payroll records found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another department, status or search term.
            </p>

          </div>

        )}

      </div>

      {/* FOOTER INFO */}
      <div className="
        mt-6 rounded-2xl border border-indigo-100
        bg-indigo-50 p-5
      ">

        <div className="flex gap-4">

          <div className="
            flex h-10 w-10 shrink-0 items-center
            justify-center rounded-xl
            bg-indigo-100 text-indigo-600
          ">
            <Banknote size={19} />
          </div>

          <div>

            <h3 className="text-sm font-bold text-indigo-900">
              Payroll Calculation
            </h3>

            <p className="mt-1 text-xs leading-5 text-indigo-700">
              Net salary is calculated from basic salary plus
              allowances minus applicable deductions.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <span className="
                rounded-lg bg-white px-3 py-1.5
                text-[10px] font-medium text-indigo-700
              ">
                Basic Salary
              </span>

              <span className="
                rounded-lg bg-white px-3 py-1.5
                text-[10px] font-medium text-indigo-700
              ">
                Allowances
              </span>

              <span className="
                rounded-lg bg-white px-3 py-1.5
                text-[10px] font-medium text-indigo-700
              ">
                Deductions
              </span>

              <span className="
                rounded-lg bg-white px-3 py-1.5
                text-[10px] font-medium text-indigo-700
              ">
                Net Salary
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Payroll;
