import { useRef, useState } from "react";
import {
  UserPlus,
  Upload,
  User,
  BriefcaseBusiness,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  Building2,
  CreditCard,
  FileText,
  ShieldCheck,
  X,
  ChevronDown,
  Sparkles,
  Check,
  ArrowRight,
  MapPinned,
  Users,
  Banknote,
  FileCheck2,
} from "lucide-react";

const departments = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Finance",
  "Operations",
  "Design",
  "IT",
  "Sales",
  "Administration",
];

const positions = {
  Engineering: [
    "Software Engineer",
    "Senior Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
  ],
  "Human Resources": [
    "HR Executive",
    "HR Manager",
    "Recruitment Officer",
    "HR Assistant",
  ],
  Marketing: [
    "Marketing Executive",
    "Marketing Manager",
    "Digital Marketing Specialist",
    "Content Writer",
  ],
  Finance: [
    "Accountant",
    "Financial Analyst",
    "Finance Manager",
    "Accounts Executive",
  ],
  Operations: [
    "Operations Executive",
    "Operations Manager",
    "Operations Assistant",
  ],
  Design: [
    "UI/UX Designer",
    "Graphic Designer",
    "Product Designer",
  ],
  IT: [
    "IT Support Engineer",
    "System Administrator",
    "IT Manager",
  ],
  Sales: [
    "Sales Executive",
    "Sales Manager",
    "Business Development Executive",
  ],
  Administration: [
    "Admin Officer",
    "Office Manager",
    "Administrative Assistant",
  ],
};

const managers = [
  "Ahmed Khan",
  "Sara Hassan",
  "Muhammad Ali",
  "Usman Ahmed",
  "Ayesha Malik",
];

const availableSkills = [
  "Communication",
  "Leadership",
  "Teamwork",
  "JavaScript",
  "React",
  "Node.js",
  "Microsoft Office",
  "Project Management",
];

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-7 flex items-start gap-4">
      <div className="relative shrink-0">
        <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-lg" />

        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 shadow-sm dark:border-blue-500/20 dark:from-blue-500/10 dark:to-indigo-500/10">
          <Icon size={19} />
        </div>
      </div>

      <div>
        <h2 className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

function Input({ icon: Icon, ...props }) {
  return (
    <div className="group relative flex h-12 items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 focus-within:border-blue-500/50 focus-within:bg-blue-50/20 focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/20">
      {Icon && (
        <div className="flex w-11 shrink-0 items-center justify-center text-slate-400 transition-colors duration-300 group-focus-within:text-blue-500">
          <Icon size={17} />
        </div>
      )}

      <input
        {...props}
        className={
          "h-full min-w-0 flex-1 bg-transparent " +
          (Icon ? "pr-3" : "px-3") +
          " text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600"
        }
      />

      <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-500 group-focus-within:w-full" />
    </div>
  );
}

function Select({
  icon: Icon,
  children,
  ...props
}) {
  return (
    <div className="group relative">
      {Icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500">
          <Icon size={17} />
        </div>
      )}

      <select
        {...props}
        className={
          "h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pr-10 text-sm text-slate-700 outline-none transition-all duration-300 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.035] dark:text-white " +
          (Icon ? "pl-11" : "pl-3")
        }
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform group-focus-within:rotate-180 group-focus-within:text-blue-500"
      />
    </div>
  );
}

function AddEmployee() {
  const fileInputRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [skills, setSkills] = useState([]);

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setPhoto({
      file,
      url: imageUrl,
    });
  };

  const toggleSkill = (skill) => {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  };

  const sectionClass =
    "portal-card group relative overflow-hidden p-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_15px_50px_rgba(15,23,42,0.08)] sm:p-7";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f8fc] px-4 py-6 text-slate-900 sm:px-6 lg:px-8 dark:bg-[#070b14] dark:text-white">

      {/* BACKGROUND DECORATION */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/[0.05] blur-[100px] dark:bg-blue-500/[0.08]" />

        <div className="absolute right-0 top-[35%] h-96 w-96 rounded-full bg-violet-500/[0.05] blur-[120px] dark:bg-violet-500/[0.07]" />

        <div className="absolute bottom-0 left-[35%] h-80 w-80 rounded-full bg-indigo-500/[0.04] blur-[100px] dark:bg-indigo-500/[0.06]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-8 flex animate-[fadeIn_.5s_ease-out] flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div>

            {/* Breadcrumb */}

            <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-slate-400">
              <span>HR Portal</span>
              <span>/</span>
              <span>Employees</span>
              <span>/</span>
              <span className="text-blue-500">
                Add Employee
              </span>
            </div>

            <div className="flex items-center gap-4">

              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-blue-500/30 blur-xl" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white shadow-xl shadow-blue-500/20">
                  <UserPlus size={23} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                    Add New Employee
                  </h1>

                  <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-600 sm:block dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                    New Profile
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Create a complete employee profile and assign their department.
                </p>
              </div>

            </div>

          </div>

          {/* HEADER BUTTONS */}

          <div className="flex gap-3">

            <button
              type="button"
              className="group rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]"
            >
              Cancel
            </button>

            <button
              type="button"
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0"
            >
              <span className="absolute -left-10 top-0 h-full w-8 rotate-12 bg-white/20 blur-sm transition-all duration-700 group-hover:left-[110%]" />

              <Check size={15} />

              Save Employee
            </button>

          </div>

        </div>

        <div className="space-y-6">

          {/* =====================================================
              PERSONAL INFORMATION
          ===================================================== */}

          <section className={sectionClass}>

            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/[0.025] blur-3xl" />

            <SectionHeader
              icon={User}
              title="Personal Information"
              description="Basic personal details of the employee."
            />

            <div className="grid gap-7 lg:grid-cols-[180px_1fr]">

              {/* PROFILE PHOTO */}

              <div>

                <label className="mb-3 block text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Profile Photo
                </label>

                <div className="flex flex-col items-center">

                  {photo ? (
                    <div className="group/photo relative">

                      <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl transition-all group-hover/photo:bg-blue-500/30" />

                      <img
                        src={photo.url}
                        alt="Employee"
                        className="relative h-32 w-32 rounded-2xl object-cover ring-4 ring-white shadow-xl dark:ring-slate-900"
                      />

                      <button
                        type="button"
                        onClick={() => setPhoto(null)}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-500 text-white shadow-lg transition-transform hover:scale-110 dark:border-slate-900"
                      >
                        <X size={13} />
                      </button>

                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="group/upload relative flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50 dark:border-white/10 dark:bg-white/[0.025] dark:hover:border-blue-500/50 dark:hover:bg-blue-500/5"
                    >

                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-violet-500/0 transition-all group-hover/upload:from-blue-500/5 group-hover/upload:to-violet-500/5" />

                      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all duration-300 group-hover/upload:scale-110 group-hover/upload:text-blue-500 dark:bg-white/5">
                        <Upload size={19} />
                      </div>

                      <span className="relative mt-2 text-[10px] font-bold text-slate-500 group-hover/upload:text-blue-600">
                        Upload Photo
                      </span>

                      <span className="relative mt-1 text-[8px] text-slate-400">
                        JPG / PNG
                      </span>

                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handlePhoto}
                  />

                </div>

              </div>

              {/* FIELDS */}

              <div className="grid gap-5 sm:grid-cols-2">

                <Field label="First Name" required>
                  <Input placeholder="Enter first name" />
                </Field>

                <Field label="Last Name" required>
                  <Input placeholder="Enter last name" />
                </Field>

                <Field label="Father / Guardian Name">
                  <Input placeholder="Enter father or guardian name" />
                </Field>

                <Field label="Date of Birth">
                  <Input type="date" icon={CalendarDays} />
                </Field>

                <Field label="Gender" required>
                  <Select>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Select>
                </Field>

                <Field label="CNIC / National ID">
                  <Input placeholder="XXXXX-XXXXXXX-X" />
                </Field>

                <Field label="Marital Status">
                  <Select>
                    <option value="">Select status</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </Select>
                </Field>

                <Field label="Nationality">
                  <Input placeholder="Pakistani" />
                </Field>

              </div>

            </div>

          </section>

          {/* =====================================================
              EMPLOYMENT
          ===================================================== */}

          <section className={sectionClass}>

            <SectionHeader
              icon={BriefcaseBusiness}
              title="Employment Information"
              description="Assign the employee to a department, position and reporting structure."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <Field label="Employee ID" required>
                <Input value="EMP-009" readOnly />
              </Field>

              <Field label="Department" required>
                <Select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setPosition("");
                  }}
                  icon={Building2}
                >
                  <option value="">Select department</option>

                  {departments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Position / Designation" required>
                <Select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  disabled={!department}
                >
                  <option value="">
                    {department
                      ? "Select position"
                      : "Select department first"}
                  </option>

                  {(positions[department] || []).map(
                    (item) => (
                      <option key={item}>{item}</option>
                    )
                  )}
                </Select>
              </Field>

              <Field label="Employment Type" required>
                <Select>
                  <option value="">Select employment type</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Intern</option>
                  <option>Temporary</option>
                </Select>
              </Field>

              <Field label="Joining Date" required>
                <Input type="date" icon={CalendarDays} />
              </Field>

              <Field label="Reporting Manager">
                <Select icon={Users}>
                  <option value="">Select manager</option>

                  {managers.map((manager) => (
                    <option key={manager}>{manager}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Work Location">
                <Select icon={MapPinned}>
                  <option value="">Select location</option>
                  <option>Head Office</option>
                  <option>Branch Office</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </Select>
              </Field>

              <Field label="Employee Status" required>
                <Select>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Probation</option>
                  <option>Suspended</option>
                </Select>
              </Field>

              <Field label="Probation Period">
                <Select>
                  <option value="">Select period</option>
                  <option>None</option>
                  <option>1 Month</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                </Select>
              </Field>

            </div>

          </section>

          {/* =====================================================
              CONTACT
          ===================================================== */}

          <section className={sectionClass}>

            <SectionHeader
              icon={Phone}
              title="Contact Information"
              description="Employee's official and personal contact details."
            />

            <div className="grid gap-5 sm:grid-cols-2">

              <Field label="Work Email" required>
                <Input
                  type="email"
                  icon={Mail}
                  placeholder="employee@company.com"
                />
              </Field>

              <Field label="Personal Email">
                <Input
                  type="email"
                  icon={Mail}
                  placeholder="personal@email.com"
                />
              </Field>

              <Field label="Work Phone">
                <Input
                  icon={Phone}
                  placeholder="+92 300 1234567"
                />
              </Field>

              <Field label="Personal Phone">
                <Input
                  icon={Phone}
                  placeholder="+92 300 1234567"
                />
              </Field>

              <Field
                label="Current Address"
                className="sm:col-span-2"
              >
                <textarea
                  rows="3"
                  placeholder="Enter current residential address"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:text-white"
                />
              </Field>

              <Field label="City">
                <Input
                  icon={MapPin}
                  placeholder="Enter city"
                />
              </Field>

              <Field label="Postal Code">
                <Input placeholder="Enter postal code" />
              </Field>

              <div className="sm:col-span-2">

                <label className="group flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) =>
                      setSameAddress(e.target.checked)
                    }
                    className="peer sr-only"
                  />

                  <div className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500 dark:border-white/20">
                    {sameAddress && (
                      <Check
                        size={13}
                        className="text-white"
                      />
                    )}
                  </div>

                  <span className="text-xs text-slate-500 transition-colors group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-white">
                    Permanent address is same as current address
                  </span>

                </label>

              </div>

            </div>

          </section>

          {/* =====================================================
              EMERGENCY
          ===================================================== */}

          <section className={sectionClass}>

            <SectionHeader
              icon={ShieldCheck}
              title="Emergency Contact"
              description="Contact information to use in case of emergency."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <Field label="Contact Name" required>
                <Input placeholder="Enter contact name" />
              </Field>

              <Field label="Relationship" required>
                <Select>
                  <option value="">Select relationship</option>
                  <option>Father</option>
                  <option>Mother</option>
                  <option>Spouse</option>
                  <option>Brother</option>
                  <option>Sister</option>
                  <option>Other</option>
                </Select>
              </Field>

              <Field label="Contact Phone" required>
                <Input
                  icon={Phone}
                  placeholder="+92 300 1234567"
                />
              </Field>

              <Field
                label="Emergency Address"
                className="sm:col-span-2 lg:col-span-3"
              >
                <textarea
                  rows="2"
                  placeholder="Enter emergency contact address"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:text-white"
                />
              </Field>

            </div>

          </section>

          {/* =====================================================
              SALARY
          ===================================================== */}

          <section className={sectionClass}>

            <SectionHeader
              icon={CreditCard}
              title="Salary & Payment Information"
              description="Configure salary, payment method and banking details."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <Field label="Basic Salary" required>

                <div className="flex h-12 overflow-hidden rounded-xl border border-slate-200 bg-white transition-all focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.035]">

                  <span className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-[11px] font-bold text-slate-500 dark:border-white/10 dark:bg-white/5">
                    PKR
                  </span>

                  <input
                    type="number"
                    placeholder="0"
                    className="w-full bg-transparent px-3 text-sm outline-none dark:text-white"
                  />

                </div>

              </Field>

              <Field label="Salary Frequency">
                <Select icon={Banknote}>
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Hourly</option>
                </Select>
              </Field>

              <Field label="Payment Method">
                <Select>
                  <option value="">Select payment method</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                </Select>
              </Field>

              <Field label="Bank Name">
                <Input placeholder="Enter bank name" />
              </Field>

              <Field label="Account Title">
                <Input placeholder="Enter account title" />
              </Field>

              <Field label="IBAN">
                <Input placeholder="PK00 XXXX XXXX XXXX XXXX" />
              </Field>

            </div>

          </section>

          {/* =====================================================
              SKILLS
          ===================================================== */}

          <section className={sectionClass}>

            <SectionHeader
              icon={Sparkles}
              title="Skills & Additional Information"
              description="Add employee skills and other useful information."
            />

            <div>

              <label className="mb-3 block text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                Skills
              </label>

              <div className="flex flex-wrap gap-2">

                {availableSkills.map((skill) => {

                  const selected = skills.includes(skill);

                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={
                        "group flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-semibold transition-all duration-300 " +
                        (selected
                          ? "border-blue-500 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                          : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10")
                      }
                    >
                      {selected && (
                        <Check size={12} />
                      )}

                      {skill}
                    </button>
                  );
                })}

              </div>

            </div>

            <div className="mt-7">

              <Field label="Additional Notes">

                <textarea
                  rows="4"
                  placeholder="Add any additional information about the employee..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:text-white"
                />

              </Field>

            </div>

          </section>

          {/* =====================================================
              DOCUMENTS
          ===================================================== */}

          <section className={sectionClass}>

            <SectionHeader
              icon={FileText}
              title="Employee Documents"
              description="Upload important employee documents."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[
                "CNIC / National ID",
                "Resume / CV",
                "Educational Certificate",
                "Employment Contract",
              ].map((document) => (

                <label
                  key={document}
                  className="group/doc relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50 dark:border-white/10 dark:bg-white/[0.025] dark:hover:border-blue-500/40 dark:hover:bg-blue-500/5"
                >

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-violet-500/0 transition-all duration-300 group-hover/doc:from-blue-500/5 group-hover/doc:to-violet-500/5" />

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all duration-300 group-hover/doc:scale-110 group-hover/doc:text-blue-500 dark:bg-white/5">

                    <FileCheck2 size={20} />

                  </div>

                  <span className="relative mt-4 text-[11px] font-bold text-slate-600 group-hover/doc:text-blue-600 dark:text-slate-300">
                    {document}
                  </span>

                  <span className="relative mt-1 text-[9px] text-slate-400">
                    PDF, JPG or PNG
                  </span>

                  <input
                    type="file"
                    className="hidden"
                  />

                </label>

              ))}

            </div>

          </section>

          {/* =====================================================
              BOTTOM ACTIONS
          ===================================================== */}

          <div className="portal-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck
                size={15}
                className="text-emerald-500"
              />

              Employee information is securely stored.
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">

              <button
                type="button"
                className="rounded-xl border border-slate-200 px-6 py-3 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
              >
                Save as Draft
              </button>

              <button
                type="button"
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0"
              >

                <span className="absolute -left-12 top-0 h-full w-10 rotate-12 bg-white/20 blur-sm transition-all duration-700 group-hover:left-[120%]" />

                <span className="relative">
                  Create Employee
                </span>

                <ArrowRight
                  size={15}
                  className="relative transition-transform duration-300 group-hover:translate-x-1"
                />

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ANIMATION */}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
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

export default AddEmployee;
