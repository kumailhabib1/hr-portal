import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  Users,
  Eye,
  Check,
  X,
  BriefcaseBusiness,
  Filter,
  Plane,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  sessionStorage.getItem("token") ||
  sessionStorage.getItem("authToken") ||
  "";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(
    typeof value === "string" && value.length <= 10
      ? `${value}T00:00:00`
      : value
  );
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const calculateDays = (start, end) => {
  if (!start || !end) return 0;
  const startDate = new Date(`${String(start).slice(0, 10)}T00:00:00`);
  const endDate = new Date(`${String(end).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0;
  return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
};

const mapLeaveRequest = (leave) => {
  const firstName = leave.first_name || "";
  const lastName = leave.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown Employee";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "NA";

  return {
    id: leave.id,
    employeeId: leave.employee_code || (leave.employee_id ? `EMP-${leave.employee_id}` : "Unknown"),
    name: fullName,
    initials,
    position: leave.position || "Employee",
    department: leave.department_name || "Unassigned",
    type: leave.leave_type || "Leave",
    from: formatDate(leave.start_date),
    to: formatDate(leave.end_date),
    days:
      leave.total_days !== undefined && leave.total_days !== null
        ? Number(leave.total_days)
        : calculateDays(leave.start_date, leave.end_date),
    reason: leave.reason || "No reason provided",
    applied: formatDate(leave.created_at),
    status: leave.status || "Pending",
    backendData: leave,
  };
};

const statusConfig = {
  Pending: {
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
  },
  Approved: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  },
  Rejected: {
    icon: XCircle,
    className: "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
  },
};

function StatCard({ icon: Icon, title, value, percentage, type }) {
  const styles = {
    pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    approved: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    rejected: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300",
    total: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300",
  };

  return (
    <div className="portal-card portal-card-interactive group relative isolate overflow-hidden p-5">
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-50 blur-2xl transition-transform duration-500 group-hover:scale-150 ${
          type === "pending"
            ? "bg-amber-400/10"
            : type === "approved"
              ? "bg-emerald-400/10"
              : type === "rejected"
                ? "bg-red-400/10"
                : "bg-indigo-400/10"
        }`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles[type]}`}
        >
          <Icon size={21} />
        </div>

        {percentage && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
            {percentage}
          </span>
        )}
      </div>

      <p className="relative mt-5 text-sm text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <h2 className="relative mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("All");
  const [department, setDepartment] = useState("All Departments");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [requests, setRequests] = useState([]);

  const loadLeaves = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("Leave Management: authentication token not found.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/leaves`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load leave requests");
      }

      const leaves = Array.isArray(data)
        ? data
        : Array.isArray(data.leaves)
          ? data.leaves
          : Array.isArray(data.data)
            ? data.data
            : [];

      setRequests(leaves.map(mapLeaveRequest));
    } catch (error) {
      console.error("Load leave requests error:", error);
    }
  }, []);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const departmentNames = [
    "Engineering",
    "Human Resources",
    "Marketing",
    "Finance",
    "Operations",
    "Design",
  ];

  const departments = [
    { name: "All Departments", count: requests.length },
    ...departmentNames.map((name) => ({
      name,
      count: requests.filter((request) => request.department === name).length,
    })),
  ];

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const tabMatch =
        activeTab === "All" || request.status === activeTab;

      const departmentMatch =
        department === "All Departments" ||
        request.department === department;

      const searchMatch =
        request.name.toLowerCase().includes(search.toLowerCase()) ||
        request.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        request.type.toLowerCase().includes(search.toLowerCase());

      return tabMatch && departmentMatch && searchMatch;
    });
  }, [requests, activeTab, department, search]);

  const updateStatus = async (id, status) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      let endpoint = "";
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (status === "Approved") {
        endpoint = `${API_BASE_URL}/leaves/${id}/approve`;
      } else if (status === "Rejected") {
        endpoint = `${API_BASE_URL}/leaves/${id}/reject`;
        options.body = JSON.stringify({
          rejection_reason: "Leave request rejected by HR",
        });
      } else {
        return;
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${status.toLowerCase()} leave`);
      }

      await loadLeaves();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Update leave status error:", error);
      alert(error.message || "Failed to update leave status");
    }
  };

  const pendingCount = requests.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (item) => item.status === "Rejected"
  ).length;

  return (
    <div className="leave-page min-h-screen overflow-x-hidden bg-slate-50 p-4 transition-colors duration-300 dark:bg-[#070b14] sm:p-6 lg:p-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
            <span>Nexora HR</span>
            <span>/</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Leave Management
            </span>
          </div>

          <div className="flex items-center gap-3">

            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20">
              <div className="absolute inset-0 animate-pulse bg-white/10" />
              <CalendarDays className="relative" size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Leave Management
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review, approve and manage employee leave requests.
              </p>
            </div>

          </div>
        </div>

        {/* Current Date */}

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <CalendarDays size={18} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Today
            </p>

            <p className="text-sm font-bold text-slate-800 dark:text-white">
              28 August 2026
            </p>
          </div>

        </div>

      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={CalendarDays}
          title="Total Requests"
          value={requests.length}
          percentage="This month"
          type="total"
        />

        <StatCard
          icon={Clock3}
          title="Pending Requests"
          value={pendingCount}
          percentage="Needs action"
          type="pending"
        />

        <StatCard
          icon={CheckCircle2}
          title="Approved"
          value={approvedCount}
          percentage="Processed"
          type="approved"
        />

        <StatCard
          icon={XCircle}
          title="Rejected"
          value={rejectedCount}
          percentage="Processed"
          type="rejected"
        />

      </div>

      {/* =====================================================
          DEPARTMENT FILTER
      ===================================================== */}

      <div className="mb-8">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Leave by Department
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Filter leave requests department-wise.
            </p>
          </div>

          <Filter
            size={18}
            className="text-slate-400"
          />

        </div>

        <div className="leave-scroll flex gap-3 overflow-x-auto pb-3">

          {departments.map((item) => (

            <button
              key={item.name}
              onClick={() => setDepartment(item.name)}
              className={`group flex min-w-fit items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                department === item.name
                  ? "border-indigo-600 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-indigo-500/10"
              }`}
            >

              <Users size={16} />

              <span className="text-sm font-semibold">
                {item.name}
              </span>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  department === item.name
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                }`}
              >
                {item.count}
              </span>

            </button>

          ))}

        </div>

      </div>

      {/* =====================================================
          REQUESTS CARD
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">

        {/* Top */}

        <div className="border-b border-slate-200 p-5 dark:border-white/10 sm:p-6">

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Leave Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review and manage employee leave applications.
              </p>
            </div>

            {/* Search */}

            <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition-all focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:focus-within:bg-white/[0.05]">

              <Search
                size={17}
                className="mr-2 shrink-0 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white sm:w-64"
              />

            </div>

          </div>

          {/* Tabs */}

          <div className="leave-scroll mt-6 flex gap-2 overflow-x-auto pb-1">

            {[
              ["All", requests.length],
              ["Pending", pendingCount],
              ["Approved", approvedCount],
              ["Rejected", rejectedCount],
            ].map(([tab, count]) => (

              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                }`}
              >

                {tab}

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    activeTab === tab
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500 dark:bg-white/10 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>

              </button>

            ))}

          </div>

        </div>

        {/* ===================================================
            DESKTOP TABLE
        =================================================== */}

        <div className="leave-scroll hidden overflow-x-auto lg:block">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.025]">

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Employee
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Leave Type
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Duration
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Days
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredRequests.map((request) => (

                <tr
                  key={request.id}
                  className="group border-b border-slate-100 transition-all duration-300 hover:bg-indigo-50/40 dark:border-white/5 dark:hover:bg-white/[0.025]"
                >

                  {/* Employee */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {request.initials}

                        {request.status === "Pending" && (
                          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-white bg-amber-400 dark:border-[#111827]" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {request.name}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {request.employeeId}
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* Department */}

                  <td className="px-6 py-4">

                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-400">
                      {request.department}
                    </span>

                  </td>

                  {/* Leave Type */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <Plane size={14} />
                      </div>

                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {request.type}
                      </span>

                    </div>

                  </td>

                  {/* Duration */}

                  <td className="px-6 py-4">

                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {request.from}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        to {request.to}
                      </p>
                    </div>

                  </td>

                  {/* Days */}

                  <td className="px-6 py-4">

                    <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      {request.days}{" "}
                      {request.days === 1 ? "Day" : "Days"}
                    </span>

                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">

                    <div className="flex justify-end gap-2">

                      <button
                        type="button"
                        title="View Details"
                        onClick={() => setSelectedRequest(request)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:hover:bg-indigo-500/10"
                      >
                        <Eye size={15} />
                      </button>

                      {request.status === "Pending" && (
                        <>
                          <button
                            title="Approve"
                            onClick={() =>
                              updateStatus(request.id, "Approved")
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-all hover:scale-105 hover:bg-emerald-100 dark:bg-emerald-500/10"
                          >
                            <Check size={15} />
                          </button>

                          <button
                            title="Reject"
                            onClick={() =>
                              updateStatus(request.id, "Rejected")
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-all hover:scale-105 hover:bg-red-100 dark:bg-red-500/10"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ===================================================
            MOBILE CARDS
        =================================================== */}

        <div className="divide-y divide-slate-100 dark:divide-white/5 lg:hidden">

          {filteredRequests.map((request) => (

            <div
              key={request.id}
              className="p-5 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.02]"
            >

              {/* Employee */}

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {request.initials}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {request.name}
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {request.employeeId} · {request.department}
                    </p>
                  </div>

                </div>

                <StatusBadge status={request.status} />

              </div>

              {/* Details */}

              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.035]">

                  <div className="flex items-center gap-2">
                    <Plane size={14} className="text-indigo-500" />

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Leave Type
                    </p>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {request.type}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.035]">

                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-indigo-500" />

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Duration
                    </p>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {request.days} {request.days === 1 ? "Day" : "Days"}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.035]">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    From
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {request.from}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.035]">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    To
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {request.to}
                  </p>

                </div>

              </div>

              {/* Reason */}

              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/[0.02]">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Reason
                </p>

                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {request.reason}
                </p>

              </div>

              {/* Actions */}

              <div className="mt-4 flex gap-2">

                <button
                  type="button"
                  onClick={() => setSelectedRequest(request)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5"
                >
                  <Eye size={15} />
                  View
                </button>

                {request.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(request.id, "Approved")
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/10 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                    >
                      <Check size={15} />
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(request.id, "Rejected")
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10"
                    >
                      <X size={15} />
                      Reject
                    </button>
                  </>
                )}

              </div>

            </div>

          ))}

        </div>

        {/* Empty State */}

        {filteredRequests.length === 0 && (
          <div className="px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
              <CalendarDays size={24} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
              No leave requests found
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Try changing your department, status or search.
            </p>

          </div>
        )}

      </div>

      <Modal
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title="Leave Request Details"
        wide
      >
        {selectedRequest && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 font-bold text-white">
                {selectedRequest.initials}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{selectedRequest.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedRequest.employeeId} · {selectedRequest.department}</p>
              </div>
              <div className="ml-auto"><StatusBadge status={selectedRequest.status} /></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Leave Type", selectedRequest.type],
                ["Duration", `${selectedRequest.from} to ${selectedRequest.to}`],
                ["Days", `${selectedRequest.days} ${selectedRequest.days === 1 ? "Day" : "Days"}`],
                ["Applied On", selectedRequest.applied],
                ["Reason", selectedRequest.reason],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800 sm:last:col-span-2">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* =====================================================
          LEAVE POLICY INFO
      ===================================================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 dark:border-indigo-500/10 dark:from-indigo-500/[0.06] dark:to-blue-500/[0.04]">

        <div className="flex gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <BriefcaseBusiness size={19} />
          </div>

          <div>

            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
              Leave Management Overview
            </h3>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-indigo-700/80 dark:text-indigo-300/60">
              HR can review employee leave applications, approve or reject
              requests, monitor department-wise leave activity and maintain
              a complete leave history for every employee.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-indigo-700 shadow-sm dark:bg-white/5 dark:text-indigo-300">
                Department Wise
              </span>

              <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-indigo-700 shadow-sm dark:bg-white/5 dark:text-indigo-300">
                Approval Workflow
              </span>

              <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-indigo-700 shadow-sm dark:bg-white/5 dark:text-indigo-300">
                Leave History
              </span>

              <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-indigo-700 shadow-sm dark:bg-white/5 dark:text-indigo-300">
                Employee Balance
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LeaveManagement;