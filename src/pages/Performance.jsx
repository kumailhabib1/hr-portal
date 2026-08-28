import { useState } from "react";
import {
  Users,
  TrendingUp,
  Award,
  Target,
  Search,
  ChevronDown,
  Star,
  Eye,
  MoreVertical,
  CheckCircle2,
  Clock3,
  AlertCircle,
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

const performanceData = [
  {
    id: "EMP-001",
    name: "Ahmed Khan",
    initials: "AK",
    position: "Senior Software Engineer",
    department: "Engineering",
    score: 92,
    rating: "Excellent",
    goals: 95,
    completed: 9,
    totalGoals: 10,
    reviews: "Completed",
  },
  {
    id: "EMP-002",
    name: "Bilal Shah",
    initials: "BS",
    position: "Frontend Developer",
    department: "Engineering",
    score: 84,
    rating: "Very Good",
    goals: 88,
    completed: 8,
    totalGoals: 10,
    reviews: "Completed",
  },
  {
    id: "EMP-003",
    name: "Sara Hassan",
    initials: "SH",
    position: "HR Manager",
    department: "Human Resources",
    score: 96,
    rating: "Excellent",
    goals: 98,
    completed: 10,
    totalGoals: 10,
    reviews: "Completed",
  },
  {
    id: "EMP-004",
    name: "Fatima Noor",
    initials: "FN",
    position: "HR Executive",
    department: "Human Resources",
    score: 76,
    rating: "Good",
    goals: 72,
    completed: 7,
    totalGoals: 10,
    reviews: "Pending",
  },
  {
    id: "EMP-005",
    name: "Muhammad Ali",
    initials: "MA",
    position: "Marketing Executive",
    department: "Marketing",
    score: 89,
    rating: "Very Good",
    goals: 91,
    completed: 9,
    totalGoals: 10,
    reviews: "Completed",
  },
  {
    id: "EMP-006",
    name: "Ayesha Malik",
    initials: "AM",
    position: "Financial Analyst",
    department: "Finance",
    score: 68,
    rating: "Needs Improvement",
    goals: 65,
    completed: 6,
    totalGoals: 10,
    reviews: "Pending",
  },
  {
    id: "EMP-007",
    name: "Usman Ahmed",
    initials: "UA",
    position: "Operations Manager",
    department: "Operations",
    score: 94,
    rating: "Excellent",
    goals: 96,
    completed: 10,
    totalGoals: 10,
    reviews: "Completed",
  },
  {
    id: "EMP-008",
    name: "Hina Raza",
    initials: "HR",
    position: "UI/UX Designer",
    department: "Design",
    score: 87,
    rating: "Very Good",
    goals: 85,
    completed: 8,
    totalGoals: 10,
    reviews: "Completed",
  },
];

function RatingBadge({ rating }) {
  const styles = {
    Excellent: "border-emerald-100 bg-emerald-50 text-emerald-700",
    "Very Good": "border-blue-100 bg-blue-50 text-blue-700",
    Good: "border-amber-100 bg-amber-50 text-amber-700",
    "Needs Improvement": "border-red-100 bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[rating]
      }`}
    >
      <Star size={13} />
      {rating}
    </span>
  );
}

function ReviewBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        status === "Completed"
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-amber-100 bg-amber-50 text-amber-700"
      }`}
    >
      {status === "Completed" ? (
        <CheckCircle2 size={13} />
      ) : (
        <Clock3 size={13} />
      )}

      {status}
    </span>
  );
}

function Score({ score }) {
  let textColor = "text-emerald-600";

  if (score < 75) {
    textColor = "text-red-500";
  } else if (score < 85) {
    textColor = "text-amber-600";
  }

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            score >= 85
              ? "bg-emerald-500"
              : score >= 75
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      <span className={`text-sm font-bold ${textColor}`}>
        {score}%
      </span>
    </div>
  );
}

function Performance() {
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");

  const [search, setSearch] = useState("");

  const [selectedRating, setSelectedRating] = useState("All");

  const filteredEmployees = performanceData.filter((employee) => {
    const departmentMatch =
      selectedDepartment === "All Departments" ||
      employee.department === selectedDepartment;

    const ratingMatch =
      selectedRating === "All" ||
      employee.rating === selectedRating;

    const searchMatch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.id.toLowerCase().includes(search.toLowerCase()) ||
      employee.department
        .toLowerCase()
        .includes(search.toLowerCase());

    return departmentMatch && ratingMatch && searchMatch;
  });

  const averageScore = Math.round(
    performanceData.reduce(
      (total, employee) => total + employee.score,
      0
    ) / performanceData.length
  );

  const excellentCount = performanceData.filter(
    (employee) => employee.rating === "Excellent"
  ).length;

  const completedReviews = performanceData.filter(
    (employee) => employee.reviews === "Completed"
  ).length;

  const needsImprovement = performanceData.filter(
    (employee) => employee.score < 75
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span>HR Portal</span>
            <span>/</span>
            <span className="font-medium text-slate-700">
              Performance
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Performance
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track employee performance, goals and review progress.
          </p>
        </div>

        {/* REVIEW PERIOD */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

          <Target
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Review Period
            </p>

            <p className="text-sm font-semibold text-slate-800">
              Q3 2026
            </p>
          </div>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

        <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
          <Target size={17} />
          Manage Goals
        </button>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">
          <Award size={17} />
          Start Review
        </button>

      </div>

      {/* SUMMARY CARDS */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Average */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={21} />
            </div>

            <span className="text-xs font-semibold text-emerald-600">
              +6.4%
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Average Performance
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {averageScore}%
          </h2>

        </div>

        {/* Employees */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users size={21} />
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Employees Reviewed
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {completedReviews}
          </h2>

        </div>

        {/* Excellent */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Award size={21} />
            </div>

            <span className="text-xs font-semibold text-emerald-600">
              Top Performers
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Excellent Performers
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {excellentCount}
          </h2>

        </div>

        {/* Improvement */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle size={21} />
            </div>

            <span className="text-xs font-semibold text-amber-600">
              Attention
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Needs Improvement
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {needsImprovement}
          </h2>

        </div>

      </div>

      {/* PERFORMANCE OVERVIEW */}
      <div className="mb-8 grid gap-4 lg:grid-cols-3">

        {/* Overall Score */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Performance Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Organization-wide performance summary
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-emerald-600">
                Overall
              </p>

              <p className="text-xl font-bold text-emerald-700">
                {averageScore}%
              </p>
            </div>

          </div>

          <div className="mt-7 space-y-5">

            {[
              {
                label: "Goal Achievement",
                value: 88,
              },
              {
                label: "Quality of Work",
                value: 91,
              },
              {
                label: "Team Collaboration",
                value: 86,
              },
              {
                label: "Attendance & Reliability",
                value: 94,
              },
            ].map((item) => (

              <div key={item.label}>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-600">
                    {item.label}
                  </span>

                  <span className="text-sm font-bold text-slate-800">
                    {item.value}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${item.value}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Rating Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Rating Distribution
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current employee ratings
          </p>

          <div className="mt-6 space-y-5">

            {[
              {
                label: "Excellent",
                value: performanceData.filter(
                  (e) => e.rating === "Excellent"
                ).length,
                total: performanceData.length,
              },
              {
                label: "Very Good",
                value: performanceData.filter(
                  (e) => e.rating === "Very Good"
                ).length,
                total: performanceData.length,
              },
              {
                label: "Good",
                value: performanceData.filter(
                  (e) => e.rating === "Good"
                ).length,
                total: performanceData.length,
              },
              {
                label: "Needs Improvement",
                value: performanceData.filter(
                  (e) => e.rating === "Needs Improvement"
                ).length,
                total: performanceData.length,
              },
            ].map((item) => {

              const percentage = Math.round(
                (item.value / item.total) * 100
              );

              return (
                <div key={item.label}>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-600">
                      {item.label}
                    </span>

                    <span className="text-xs font-bold text-slate-700">
                      {item.value}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={`h-full rounded-full ${
                        item.label === "Excellent"
                          ? "bg-emerald-500"
                          : item.label === "Very Good"
                          ? "bg-blue-500"
                          : item.label === "Good"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* DEPARTMENTS */}
      <div className="mb-6">

        <div className="mb-4">

          <h2 className="text-lg font-bold text-slate-900">
            Performance by Department
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a department to view employee performance.
          </p>

        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">

          {departments.map((department) => (

            <button
              key={department.name}
              onClick={() =>
                setSelectedDepartment(department.name)
              }
              className={`flex min-w-fit items-center gap-3 rounded-xl border px-4 py-3 transition ${
                selectedDepartment === department.name
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >

              <Users size={16} />

              <span className="text-sm font-semibold">
                {department.name}
              </span>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  selectedDepartment === department.name
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {department.count}
              </span>

            </button>

          ))}

        </div>

      </div>

      {/* PERFORMANCE TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* TOOLBAR */}
        <div className="border-b border-slate-200 p-5 sm:p-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                {selectedDepartment === "All Departments"
                  ? "Employee Performance"
                  : `${selectedDepartment} Performance`}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredEmployees.length} employees
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}
              <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-400 focus-within:bg-white">

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
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-56"
                />

              </div>

              {/* RATING */}
              <div className="relative">

                <select
                  value={selectedRating}
                  onChange={(e) =>
                    setSelectedRating(e.target.value)
                  }
                  className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-sm font-medium text-slate-600 outline-none focus:border-emerald-400"
                >
                  <option value="All">All Ratings</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Needs Improvement">
                    Needs Improvement
                  </option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>

            </div>

          </div>

        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto lg:block">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Employee
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Performance Score
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rating
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Goals
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Review
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredEmployees.map((employee) => (

                <tr
                  key={employee.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >

                  {/* EMPLOYEE */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
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

                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                      {employee.department}
                    </span>

                  </td>

                  {/* SCORE */}
                  <td className="px-6 py-5">

                    <Score score={employee.score} />

                  </td>

                  {/* RATING */}
                  <td className="px-6 py-5">

                    <RatingBadge
                      rating={employee.rating}
                    />

                  </td>

                  {/* GOALS */}
                  <td className="px-6 py-5">

                    <div>

                      <p className="text-sm font-semibold text-slate-700">
                        {employee.completed}/{employee.totalGoals}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Goals completed
                      </p>

                    </div>

                  </td>

                  {/* REVIEW */}
                  <td className="px-6 py-5">

                    <ReviewBadge
                      status={employee.reviews}
                    />

                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5">

                    <div className="flex justify-end gap-2">

                      <button
                        title="View Performance"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="More"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
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

          {filteredEmployees.map((employee) => (

            <div
              key={employee.id}
              className="p-5"
            >

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
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

                <span className="text-lg font-bold text-emerald-600">
                  {employee.score}%
                </span>

              </div>

              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-xs text-slate-400">
                    Performance Score
                  </span>

                  <span className="text-xs font-semibold text-slate-600">
                    {employee.score}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className={`h-full rounded-full ${
                      employee.score >= 85
                        ? "bg-emerald-500"
                        : employee.score >= 75
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${employee.score}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-[10px] uppercase text-slate-400">
                    Rating
                  </p>

                  <div className="mt-1">
                    <RatingBadge
                      rating={employee.rating}
                    />
                  </div>

                </div>

                <div className="rounded-xl bg-blue-50 p-3">

                  <p className="text-[10px] uppercase text-blue-500">
                    Goals
                  </p>

                  <p className="mt-1 text-sm font-bold text-blue-700">
                    {employee.completed}/{employee.totalGoals}
                  </p>

                </div>

              </div>

              <div className="mt-4 flex gap-2">

                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600">
                  <Eye size={15} />
                  View Performance
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500">
                  <MoreVertical size={16} />
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* EMPTY */}
        {filteredEmployees.length === 0 && (

          <div className="p-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Target size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No performance records found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another department, rating or search term.
            </p>

          </div>

        )}

      </div>

      {/* INFO */}
      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

        <div className="flex gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Award size={19} />
          </div>

          <div>

            <h3 className="text-sm font-bold text-blue-900">
              Performance Management
            </h3>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              Track employee goals, performance scores, reviews
              and development progress from one centralized HR
              workspace.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-medium text-blue-700">
                Performance Reviews
              </span>

              <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-medium text-blue-700">
                Employee Goals
              </span>

              <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-medium text-blue-700">
                Performance Score
              </span>

              <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-medium text-blue-700">
                Development Tracking
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Performance;