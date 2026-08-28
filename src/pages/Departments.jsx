
import { useState } from "react";
import {
  Users,
  Building2,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  BriefcaseBusiness,
} from "lucide-react";

const departments = [
  {
    id: "DEP-001",
    name: "Engineering",
    description: "Software development, engineering and technical operations.",
    head: "Ahmed Khan",
    headInitials: "AK",
    employees: 12,
    positions: 8,
    status: "Active",
  },
  {
    id: "DEP-002",
    name: "Human Resources",
    description: "Employee management, recruitment and organizational support.",
    head: "Sara Hassan",
    headInitials: "SH",
    employees: 6,
    positions: 4,
    status: "Active",
  },
  {
    id: "DEP-003",
    name: "Marketing",
    description: "Marketing campaigns, branding and customer engagement.",
    head: "Muhammad Ali",
    headInitials: "MA",
    employees: 8,
    positions: 5,
    status: "Active",
  },
  {
    id: "DEP-004",
    name: "Finance",
    description: "Financial planning, accounting and payroll operations.",
    head: "Ayesha Malik",
    headInitials: "AM",
    employees: 7,
    positions: 4,
    status: "Active",
  },
  {
    id: "DEP-005",
    name: "Operations",
    description: "Daily business operations, logistics and administration.",
    head: "Usman Ahmed",
    headInitials: "UA",
    employees: 9,
    positions: 6,
    status: "Active",
  },
  {
    id: "DEP-006",
    name: "Design",
    description: "UI/UX design, creative design and visual experiences.",
    head: "Hina Raza",
    headInitials: "HR",
    employees: 6,
    positions: 4,
    status: "Active",
  },
];

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        status === "Active"
          ? "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "border-red-100 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
      }`}
    >
      {status === "Active" ? (
        <CheckCircle2 size={13} />
      ) : (
        <XCircle size={13} />
      )}

      {status}
    </span>
  );
}

function Departments() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredDepartments = departments.filter((department) => {
    const searchMatch =
      department.name.toLowerCase().includes(search.toLowerCase()) ||
      department.id.toLowerCase().includes(search.toLowerCase()) ||
      department.head.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      selectedStatus === "All" ||
      department.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  const totalEmployees = departments.reduce(
    (total, department) => total + department.employees,
    0
  );

  const totalPositions = departments.reduce(
    (total, department) => total + department.positions,
    0
  );

  const activeDepartments = departments.filter(
    (department) => department.status === "Active"
  ).length;

  return (
    <div className="departments-page min-h-screen overflow-x-hidden bg-slate-50 p-4 text-slate-900 transition-colors duration-300 dark:bg-[#080d18] dark:text-slate-100 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Nexora HR</span>
            <span>/</span>
            <span className="font-medium text-slate-700">
              Departments
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Departments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage departments, department heads and employee allocation.
          </p>

        </div>

        {/* ADD DEPARTMENT */}
        <button
          className="
            flex items-center justify-center gap-2 rounded-xl
            bg-indigo-600 px-5 py-3 text-sm font-semibold
            text-white shadow-lg shadow-indigo-600/20
            transition hover:bg-indigo-700
          "
        >
          <Plus size={18} />
          Add Department
        </button>

      </div>

      {/* SUMMARY */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* DEPARTMENTS */}
        <div className="portal-card portal-card-interactive group p-5">

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Building2 size={21} />
            </div>

            <span className="text-xs font-semibold text-indigo-600">
              Organization
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Total Departments
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {departments.length}
          </h2>

        </div>

        {/* EMPLOYEES */}
        <div className="portal-card portal-card-interactive group p-5">

          <div className="
            flex h-12 w-12 items-center justify-center
            rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 dark:bg-blue-500/10 dark:text-blue-300
          ">
            <Users size={21} />
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Total Employees
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {totalEmployees}
          </h2>

        </div>

        {/* POSITIONS */}
        <div className="portal-card portal-card-interactive group p-5">

          <div className="
            flex h-12 w-12 items-center justify-center
            rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 dark:bg-emerald-500/10 dark:text-emerald-300
          ">
            <BriefcaseBusiness size={21} />
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Total Positions
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {totalPositions}
          </h2>

        </div>

        {/* ACTIVE */}
        <div className="portal-card portal-card-interactive group p-5">

          <div className="flex items-center justify-between">

            <div className="
              flex h-12 w-12 items-center justify-center
              rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 dark:bg-emerald-500/10 dark:text-emerald-300
            ">
              <CheckCircle2 size={21} />
            </div>

            <span className="text-xs font-semibold text-emerald-600">
              Active
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Active Departments
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {activeDepartments}
          </h2>

        </div>

      </div>

      {/* DEPARTMENT LIST */}
      <div className="portal-card overflow-hidden">

        {/* TOOLBAR */}
        <div className="border-b border-slate-200 p-5 sm:p-6">

          <div className="
            flex flex-col gap-4
            lg:flex-row lg:items-center lg:justify-between
          ">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                All Departments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredDepartments.length} departments found
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}
              <div
                className="
                  flex h-11 items-center rounded-xl
                  border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-900
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
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search department..."
                  className="
                    w-full bg-transparent text-sm outline-none
                    placeholder:text-slate-400 dark:text-slate-100 sm:w-60
                  "
                />

              </div>

            </div>

          </div>

          {/* STATUS FILTER */}
          <div className="departments-scroll mt-5 flex gap-2 overflow-x-auto pb-1">

            {["All", "Active", "Inactive"].map((status) => {

              const count =
                status === "All"
                  ? departments.length
                  : departments.filter(
                      (department) =>
                        department.status === status
                    ).length;

              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
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
            })}

          </div>

        </div>

        {/* DESKTOP TABLE */}
        <div className="departments-scroll hidden overflow-x-auto lg:block">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="
                  px-6 py-4 text-left text-xs
                  font-semibold uppercase tracking-wider
                  text-slate-500
                ">
                  Department
                </th>

                <th className="
                  px-6 py-4 text-left text-xs
                  font-semibold uppercase tracking-wider
                  text-slate-500
                ">
                  Department Head
                </th>

                <th className="
                  px-6 py-4 text-center text-xs
                  font-semibold uppercase tracking-wider
                  text-slate-500
                ">
                  Employees
                </th>

                <th className="
                  px-6 py-4 text-center text-xs
                  font-semibold uppercase tracking-wider
                  text-slate-500
                ">
                  Positions
                </th>

                <th className="
                  px-6 py-4 text-left text-xs
                  font-semibold uppercase tracking-wider
                  text-slate-500
                ">
                  Status
                </th>

                <th className="
                  px-6 py-4 text-right text-xs
                  font-semibold uppercase tracking-wider
                  text-slate-500
                ">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredDepartments.map((department) => (

                <tr
                  key={department.id}
                  className="
                    border-b border-slate-100
                    transition hover:bg-indigo-50/30
                  "
                >

                  {/* DEPARTMENT */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="
                        flex h-11 w-11 items-center
                        justify-center rounded-xl
                        bg-indigo-50 text-indigo-600
                      ">
                        <Building2 size={20} />
                      </div>

                      <div>

                        <p className="
                          text-sm font-semibold text-slate-900
                        ">
                          {department.name}
                        </p>

                        <p className="
                          mt-0.5 max-w-sm truncate
                          text-xs text-slate-500
                        ">
                          {department.description}
                        </p>

                        <p className="
                          mt-1 text-[10px]
                          font-medium text-slate-400
                        ">
                          {department.id}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* HEAD */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="
                        flex h-9 w-9 items-center
                        justify-center rounded-full
                        bg-slate-100 text-[10px]
                        font-bold text-slate-600
                      ">
                        {department.headInitials}
                      </div>

                      <div>

                        <p className="
                          text-sm font-semibold text-slate-700
                        ">
                          {department.head}
                        </p>

                        <p className="text-xs text-slate-400">
                          Department Head
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* EMPLOYEES */}
                  <td className="px-6 py-5 text-center">

                    <span className="
                      inline-flex items-center gap-1.5
                      rounded-lg bg-blue-50
                      px-3 py-1.5 text-xs
                      font-semibold text-blue-700
                    ">
                      <Users size={13} />
                      {department.employees}
                    </span>

                  </td>

                  {/* POSITIONS */}
                  <td className="px-6 py-5 text-center">

                    <span className="
                      inline-flex items-center gap-1.5
                      rounded-lg bg-slate-100
                      px-3 py-1.5 text-xs
                      font-semibold text-slate-600
                    ">
                      <BriefcaseBusiness size={13} />
                      {department.positions}
                    </span>

                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <StatusBadge status={department.status} />
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5">

                    <div className="flex justify-end gap-2">

                      <button
                        title="View Department"
                        className="
                          flex h-9 w-9 items-center
                          justify-center rounded-lg
                          border border-slate-200
                          text-slate-400 transition
                          hover:border-indigo-200
                          hover:bg-indigo-50
                          hover:text-indigo-600
                        "
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Edit Department"
                        className="
                          flex h-9 w-9 items-center
                          justify-center rounded-lg
                          border border-slate-200
                          text-slate-400 transition
                          hover:border-indigo-200
                          hover:bg-indigo-50
                          hover:text-indigo-600
                        "
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        title="Delete Department"
                        className="
                          flex h-9 w-9 items-center
                          justify-center rounded-lg
                          border border-slate-200
                          text-slate-400 transition
                          hover:border-red-200
                          hover:bg-red-50
                          hover:text-red-600
                        "
                      >
                        <Trash2 size={16} />
                      </button>

                      <button
                        title="More"
                        className="
                          flex h-9 w-9 items-center
                          justify-center rounded-lg
                          border border-slate-200
                          text-slate-400 transition
                          hover:bg-slate-50
                          hover:text-slate-700
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

        {/* MOBILE CARDS */}
        <div className="divide-y divide-slate-100 lg:hidden">

          {filteredDepartments.map((department) => (

            <div
              key={department.id}
              className="p-5"
            >

              {/* TOP */}
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="
                    flex h-11 w-11 items-center
                    justify-center rounded-xl
                    bg-indigo-50 text-indigo-600
                  ">
                    <Building2 size={20} />
                  </div>

                  <div>

                    <h3 className="
                      font-semibold text-slate-900
                    ">
                      {department.name}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {department.id}
                    </p>

                  </div>

                </div>

                <StatusBadge status={department.status} />

              </div>

              {/* DESCRIPTION */}
              <p className="
                mt-4 text-xs leading-5
                text-slate-500
              ">
                {department.description}
              </p>

              {/* HEAD */}
              <div className="
                mt-4 flex items-center
                gap-3 rounded-xl bg-slate-50 p-3
              ">

                <div className="
                  flex h-9 w-9 items-center
                  justify-center rounded-full
                  bg-white text-[10px]
                  font-bold text-slate-600
                ">
                  {department.headInitials}
                </div>

                <div>

                  <p className="text-xs text-slate-400">
                    Department Head
                  </p>

                  <p className="
                    text-sm font-semibold
                    text-slate-700
                  ">
                    {department.head}
                  </p>

                </div>

              </div>

              {/* STATS */}
              <div className="mt-3 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-blue-50 p-3">

                  <p className="text-[10px] uppercase text-blue-500">
                    Employees
                  </p>

                  <p className="
                    mt-1 text-lg font-bold
                    text-blue-700
                  ">
                    {department.employees}
                  </p>

                </div>

                <div className="rounded-xl bg-indigo-50 p-3">

                  <p className="
                    text-[10px] uppercase
                    text-indigo-500
                  ">
                    Positions
                  </p>

                  <p className="
                    mt-1 text-lg font-bold
                    text-indigo-700
                  ">
                    {department.positions}
                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-2">

                <button
                  className="
                    flex flex-1 items-center
                    justify-center gap-2
                    rounded-xl border border-slate-200
                    py-2.5 text-xs font-semibold
                    text-slate-600 transition
                    hover:border-indigo-200
                    hover:bg-indigo-50
                    hover:text-indigo-600
                  "
                >
                  <Eye size={15} />
                  View
                </button>

                <button
                  className="
                    flex flex-1 items-center
                    justify-center gap-2
                    rounded-xl border border-slate-200
                    py-2.5 text-xs font-semibold
                    text-slate-600 transition
                    hover:border-indigo-200
                    hover:bg-indigo-50
                    hover:text-indigo-600
                  "
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  className="
                    flex h-10 w-10 items-center
                    justify-center rounded-xl
                    border border-red-100
                    text-red-400 transition
                    hover:bg-red-50
                    hover:text-red-600
                  "
                >
                  <Trash2 size={15} />
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* EMPTY */}
        {filteredDepartments.length === 0 && (

          <div className="p-16 text-center">

            <div className="
              mx-auto flex h-14 w-14 items-center
              justify-center rounded-2xl
              bg-indigo-50 text-indigo-400
            ">
              <Building2 size={25} />
            </div>

            <h3 className="
              mt-4 font-semibold text-slate-900
            ">
              No departments found
            </h3>

            <p className="
              mt-1 text-sm text-slate-500
            ">
              Try another search or status filter.
            </p>

          </div>

        )}

      </div>

      {/* INFORMATION */}
      <div className="
        mt-6 rounded-2xl border
        border-indigo-100 bg-indigo-50 p-5
      ">

        <div className="flex gap-4">

          <div className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl bg-indigo-100
            text-indigo-600
          ">
            <Building2 size={19} />
          </div>

          <div>

            <h3 className="
              text-sm font-bold text-indigo-900
            ">
              Department Management
            </h3>

            <p className="
              mt-1 text-xs leading-5
              text-indigo-700
            ">
              Create and manage organizational departments,
              assign department heads and monitor employee
              distribution across the organization.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <span className="
                rounded-lg bg-white px-3 py-1.5
                text-[10px] font-medium
                text-indigo-700
              ">
                Department Heads
              </span>

              <span className="
                rounded-lg bg-white px-3 py-1.5
                text-[10px] font-medium
                text-indigo-700
              ">
                Employee Allocation
              </span>

              <span className="
                rounded-lg bg-white px-3 py-1.5
                text-[10px] font-medium
                text-indigo-700
              ">
                Positions
              </span>

              <span className="
                rounded-lg bg-white px-3 py-1.5
                text-[10px] font-medium
                text-indigo-700
              ">
                Department Status
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Departments;
