import { useEffect, useRef, useState } from "react";
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
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Trash2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =========================================================
   POSITION LIST
========================================================= */

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

/* =========================================================
   SKILLS
========================================================= */

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

/* =========================================================
   DOCUMENT TYPES
========================================================= */

const documentTypes = [
  {
    key: "cnic",
    label: "CNIC / National ID",
  },
  {
    key: "resume",
    label: "Resume / CV",
  },
  {
    key: "education",
    label: "Educational Certificate",
  },
  {
    key: "contract",
    label: "Employment Contract",
  },
];

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
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

/* =========================================================
   FIELD
========================================================= */

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

/* =========================================================
   INPUT
========================================================= */

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

/* =========================================================
   SELECT
========================================================= */

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

/* =========================================================
   DOCUMENT UPLOAD CARD
========================================================= */

function DocumentCard({
  label,
  file,
  onSelect,
  onRemove,
}) {
  return (
    <div className="group/doc relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50 dark:border-white/10 dark:bg-white/[0.025]">
      {!file ? (
        <label className="flex cursor-pointer flex-col items-center justify-center">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all duration-300 group-hover/doc:scale-110 group-hover/doc:text-blue-500 dark:bg-white/5">
            <FileCheck2 size={20} />
          </div>

          <span className="mt-4 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {label}
          </span>

          <span className="mt-1 text-[9px] text-slate-400">
            PDF, JPG, PNG, DOC or DOCX
          </span>

          <span className="mt-2 inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[9px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Upload size={11} />
            Choose File
          </span>

          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(event) => {
              onSelect(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
            <CheckCircle2 size={21} />
          </div>

          <p className="mt-3 max-w-full truncate px-2 text-[11px] font-bold text-slate-700 dark:text-slate-200">
            {file.name}
          </p>

          <p className="mt-1 text-[9px] text-slate-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>

          <button
            type="button"
            onClick={onRemove}
            className="mt-3 inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[9px] font-bold text-red-500 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
          >
            <Trash2 size={11} />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ADD EMPLOYEE
========================================================= */

function AddEmployee() {
  const fileInputRef = useRef(null);

  /* -------------------------------------------------------
     PHOTO
  ------------------------------------------------------- */

  const [photo, setPhoto] = useState(null);

  /* -------------------------------------------------------
     DEPARTMENTS / EMPLOYEES
  ------------------------------------------------------- */

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loadingDepartments, setLoadingDepartments] =
    useState(true);

  const [loadingManagers, setLoadingManagers] =
    useState(true);

  /* -------------------------------------------------------
     FORM STATUS
  ------------------------------------------------------- */

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* -------------------------------------------------------
     FORM
  ------------------------------------------------------- */

  const [form, setForm] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Pakistan",
    department_id: "",
    position: "",
    manager_id: "",
    joining_date: "",
    employment_type: "",
    salary: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    status: "Active",
  });

  /* -------------------------------------------------------
     OTHER UI STATES
  ------------------------------------------------------- */

  const [sameAddress, setSameAddress] =
    useState(false);

  const [skills, setSkills] = useState([]);

  /* -------------------------------------------------------
     DOCUMENT STATES
  ------------------------------------------------------- */

  const [documents, setDocuments] = useState({
    cnic: null,
    resume: null,
    education: null,
    contract: null,
  });

  /* =======================================================
     AUTH TOKEN
  ======================================================= */

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  /* =======================================================
     LOAD DEPARTMENTS
  ======================================================= */

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoadingDepartments(true);

        const token = getToken();

        if (!token) {
          setError("Please login again.");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/departments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load departments"
          );
        }

        setDepartments(data.departments || []);
      } catch (err) {
        console.error(
          "Department loading error:",
          err
        );

        setError(
          err.message ||
            "Failed to load departments."
        );
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, []);

  /* =======================================================
     LOAD EMPLOYEES / MANAGERS
  ======================================================= */

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingManagers(true);

        const token = getToken();

        if (!token) return;

        const response = await fetch(
          `${API_URL}/api/employees`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load employees"
          );
        }

        setEmployees(data.employees || []);
      } catch (err) {
        console.error(
          "Manager loading error:",
          err
        );
      } finally {
        setLoadingManagers(false);
      }
    };

    loadEmployees();
  }, []);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =======================================================
     DEPARTMENT CHANGE
  ======================================================= */

  const handleDepartmentChange = (event) => {
    const value = event.target.value;

    setForm((current) => ({
      ...current,
      department_id: value,
      position: "",
      manager_id: "",
    }));

    setError("");
    setSuccess("");
  };

  /* =======================================================
     POSITION CHANGE
  ======================================================= */

  const handlePositionChange = (event) => {
    const value = event.target.value;

    setForm((current) => ({
      ...current,
      position: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =======================================================
     PHOTO
  ======================================================= */

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      !["image/jpeg", "image/png"].includes(
        file.type
      )
    ) {
      setError(
        "Only JPG and PNG images are allowed."
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile photo must be less than 5MB."
      );

      return;
    }

    if (photo?.url) {
      URL.revokeObjectURL(photo.url);
    }

    const imageUrl = URL.createObjectURL(file);

    setPhoto({
      file,
      url: imageUrl,
    });

    setError("");
    setSuccess("");
  };

  /* =======================================================
     DOCUMENT SELECT
  ======================================================= */

  const handleDocumentSelect = (type, file) => {
    if (!file) return;

    const allowedExtensions = [
      "pdf",
      "jpg",
      "jpeg",
      "png",
      "doc",
      "docx",
    ];

    const extension =
      file.name.split(".").pop()?.toLowerCase();

    if (
      !extension ||
      !allowedExtensions.includes(extension)
    ) {
      setError(
        "Only PDF, JPG, PNG, DOC and DOCX documents are allowed."
      );

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Document size must be less than 10MB."
      );

      return;
    }

    setDocuments((current) => ({
      ...current,
      [type]: file,
    }));

    setError("");
    setSuccess("");
  };

  /* =======================================================
     REMOVE DOCUMENT
  ======================================================= */

  const removeDocument = (type) => {
    setDocuments((current) => ({
      ...current,
      [type]: null,
    }));

    setError("");
  };

  /* =======================================================
     SKILLS
  ======================================================= */

  const toggleSkill = (skill) => {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter(
            (item) => item !== skill
          )
        : [...current, skill]
    );
  };

  /* =======================================================
     GENERATE EMPLOYEE CODE
  ======================================================= */

  const generateEmployeeCode = () => {
    if (employees.length === 0) {
      return "EMP-001";
    }

    const numbers = employees
      .map((employee) => {
        const match =
          employee.employee_code?.match(
            /(\d+)$/
          );

        return match
          ? Number(match[1])
          : 0;
      })
      .filter(Boolean);

    const highest =
      numbers.length > 0
        ? Math.max(...numbers)
        : 0;

    return `EMP-${String(
      highest + 1
    ).padStart(3, "0")}`;
  };

  /* =======================================================
     UPLOAD DOCUMENTS
  ======================================================= */

  const uploadEmployeeDocuments = async (
    employeeId,
    token
  ) => {
    const selectedDocuments =
      Object.entries(documents).filter(
        ([, file]) => file
      );

    if (
      selectedDocuments.length === 0
    ) {
      return {
        success: true,
        uploaded: 0,
      };
    }

    const formData = new FormData();

    selectedDocuments.forEach(
      ([type, file], index) => {
        formData.append(
          "documents",
          file
        );

        formData.append(
          `document_type_${index}`,
          getDocumentType(type)
        );
      }
    );

    const response = await fetch(
      `${API_URL}/api/documents/employee/${employeeId}`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Employee created but document upload failed."
      );
    }

    return data;
  };

  /* =======================================================
     DOCUMENT TYPE NAME
  ======================================================= */

  const getDocumentType = (type) => {
    const types = {
      cnic: "CNIC / National ID",
      resume: "Resume / CV",
      education:
        "Educational Certificate",
      contract:
        "Employment Contract",
    };

    return types[type] || "Other Document";
  };

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setForm({
      employee_code: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "Pakistan",
      department_id: "",
      position: "",
      manager_id: "",
      joining_date: "",
      employment_type: "",
      salary: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      status: "Active",
    });

    setSkills([]);

    setDocuments({
      cnic: null,
      resume: null,
      education: null,
      contract: null,
    });

    if (photo?.url) {
      URL.revokeObjectURL(photo.url);
    }

    setPhoto(null);
  };

  /* =======================================================
     SAVE EMPLOYEE
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!form.first_name.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.last_name.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Work email is required.");
      return;
    }

    if (!form.gender) {
      setError("Please select gender.");
      return;
    }

    if (!form.department_id) {
      setError("Please select a department.");
      return;
    }

    if (!form.position) {
      setError("Please select a position.");
      return;
    }

    if (!form.employment_type) {
      setError(
        "Please select employment type."
      );
      return;
    }

    if (!form.joining_date) {
      setError("Joining date is required.");
      return;
    }

    if (
      !form.emergency_contact_name.trim()
    ) {
      setError(
        "Emergency contact name is required."
      );
      return;
    }

    if (
      !form.emergency_contact_phone.trim()
    ) {
      setError(
        "Emergency contact phone is required."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Your login session has expired. Please login again."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      /* ---------------------------------------------------
         EMPLOYEE CODE
      --------------------------------------------------- */

      const employeeCode =
        form.employee_code ||
        generateEmployeeCode();

      /* ---------------------------------------------------
         EMPLOYEE PAYLOAD
      --------------------------------------------------- */

      const payload = {
        employee_code: employeeCode,

        first_name:
          form.first_name.trim(),

        last_name:
          form.last_name.trim(),

        email:
          form.email.trim(),

        phone:
          form.phone.trim() || null,

        date_of_birth:
          form.date_of_birth || null,

        gender:
          form.gender,

        address:
          form.address.trim() || null,

        city:
          form.city.trim() || null,

        country:
          form.country.trim() ||
          "Pakistan",

        department_id:
          Number(form.department_id),

        position:
          form.position,

        manager_id:
          form.manager_id
            ? Number(form.manager_id)
            : null,

        joining_date:
          form.joining_date,

        employment_type:
          form.employment_type,

        salary:
          form.salary
            ? Number(form.salary)
            : 0,

        skills:
          skills.length > 0
            ? skills.join(", ")
            : null,

        emergency_contact_name:
          form.emergency_contact_name.trim(),

        emergency_contact_phone:
          form.emergency_contact_phone.trim(),

        status:
          form.status || "Active",
      };

      /* ---------------------------------------------------
         CREATE EMPLOYEE
      --------------------------------------------------- */

      const response = await fetch(
        `${API_URL}/api/employees`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          throw new Error(
            "Your login session has expired. Please login again."
          );
        }

        throw new Error(
          data.message ||
            "Failed to create employee."
        );
      }

      /* ---------------------------------------------------
         GET NEW EMPLOYEE ID
      --------------------------------------------------- */

      const employeeId =
        data.employeeId ||
        data.employee?.id ||
        data.id;

      if (!employeeId) {
        throw new Error(
          "Employee was created but the employee ID was not returned by the server."
        );
      }

      /* ---------------------------------------------------
         UPLOAD DOCUMENTS
      --------------------------------------------------- */

      const selectedDocuments =
        Object.values(documents).filter(
          Boolean
        ).length;

      let uploadedDocuments = 0;

      if (selectedDocuments > 0) {
        const documentResult =
          await uploadEmployeeDocuments(
            employeeId,
            token
          );

        uploadedDocuments =
          documentResult.documents
            ?.length ||
          documentResult.uploaded ||
          selectedDocuments;
      }

      /* ---------------------------------------------------
         SUCCESS
      --------------------------------------------------- */

      setSuccess(
        uploadedDocuments > 0
          ? `Employee ${employeeCode} created successfully with ${uploadedDocuments} document${uploadedDocuments > 1 ? "s" : ""}.`
          : `Employee ${employeeCode} created successfully.`
      );

      /* ---------------------------------------------------
         RESET
      --------------------------------------------------- */

      resetForm();

      /* ---------------------------------------------------
         RELOAD EMPLOYEES
      --------------------------------------------------- */

      const employeeResponse =
        await fetch(
          `${API_URL}/api/employees`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (employeeResponse.ok) {
        const employeeData =
          await employeeResponse.json();

        if (employeeData.success) {
          setEmployees(
            employeeData.employees || []
          );
        }
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (err) {
      console.error(
        "Create employee error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while creating employee."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = () => {
    window.history.back();
  };

  /* =======================================================
     DEPARTMENT
  ======================================================= */

  const selectedDepartment =
    departments.find(
      (item) =>
        String(item.id) ===
        String(form.department_id)
    );

  const departmentName =
    selectedDepartment?.name || "";

  const departmentPositions =
    positions[departmentName] || [];

  /* =======================================================
     SECTION CLASS
  ======================================================= */

  const sectionClass =
    "portal-card group relative overflow-hidden p-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_15px_50px_rgba(15,23,42,0.08)] sm:p-7";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f8fc] px-4 py-6 text-slate-900 sm:px-6 lg:px-8 dark:bg-[#070b14] dark:text-white">

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/[0.05] blur-[100px] dark:bg-blue-500/[0.08]" />

        <div className="absolute right-0 top-[35%] h-96 w-96 rounded-full bg-violet-500/[0.05] blur-[120px] dark:bg-violet-500/[0.07]" />

        <div className="absolute bottom-0 left-[35%] h-80 w-80 rounded-full bg-indigo-500/[0.04] blur-[100px] dark:bg-indigo-500/[0.06]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex animate-[fadeIn_.5s_ease-out] flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div>

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

          <div className="flex gap-3">

            <button
              type="button"
              onClick={handleCancel}
              className="group rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="employee-form"
              disabled={isSubmitting}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Check size={15} />
              )}

              {isSubmitting
                ? "Saving..."
                : "Save Employee"}
            </button>

          </div>
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-bold">
                Employee Created
              </p>

              <p className="mt-1 text-xs">
                {success}
              </p>
            </div>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-bold">
                Unable to save employee
              </p>

              <p className="mt-1 text-xs">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          id="employee-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <section className={sectionClass}>

            <SectionHeader
              icon={User}
              title="Personal Information"
              description="Basic personal details of the employee."
            />

            <div className="grid gap-7 lg:grid-cols-[180px_1fr]">

              {/* PHOTO */}

              <div>

                <label className="mb-3 block text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Profile Photo
                </label>

                <div className="flex flex-col items-center">

                  {photo ? (
                    <div className="group/photo relative">

                      <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl" />

                      <img
                        src={photo.url}
                        alt="Employee"
                        className="relative h-32 w-32 rounded-2xl object-cover ring-4 ring-white shadow-xl dark:ring-slate-900"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(
                            photo.url
                          );

                          setPhoto(null);
                        }}
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
                      className="group/upload relative flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50 dark:border-white/10 dark:bg-white/[0.025]"
                    >

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

              {/* PERSONAL FIELDS */}

              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="First Name"
                  required
                >
                  <Input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </Field>

                <Field
                  label="Last Name"
                  required
                >
                  <Input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </Field>

                <Field label="Date of Birth">
                  <Input
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    type="date"
                    icon={CalendarDays}
                  />
                </Field>

                <Field
                  label="Gender"
                  required
                >
                  <Select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select gender
                    </option>

                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Select>
                </Field>

                <Field
                  label="Work Email"
                  required
                >
                  <Input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    icon={Mail}
                    placeholder="employee@company.com"
                  />
                </Field>

                <Field label="Work Phone">
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    icon={Phone}
                    placeholder="+92 300 1234567"
                  />
                </Field>

              </div>
            </div>
          </section>

          {/* =================================================
              EMPLOYMENT
          ================================================= */}

          <section className={sectionClass}>

            <SectionHeader
              icon={BriefcaseBusiness}
              title="Employment Information"
              description="Assign the employee to a department, position and reporting structure."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <Field
                label="Employee ID"
                required
              >
                <Input
                  name="employee_code"
                  value={
                    form.employee_code ||
                    generateEmployeeCode()
                  }
                  onChange={handleChange}
                  placeholder="EMP-001"
                />
              </Field>

              <Field
                label="Department"
                required
              >
                <Select
                  name="department_id"
                  value={form.department_id}
                  onChange={
                    handleDepartmentChange
                  }
                  icon={Building2}
                  disabled={
                    loadingDepartments
                  }
                >
                  <option value="">
                    {loadingDepartments
                      ? "Loading departments..."
                      : "Select department"}
                  </option>

                  {departments.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </Select>
              </Field>

              <Field
                label="Position / Designation"
                required
              >
                <Select
                  name="position"
                  value={form.position}
                  onChange={
                    handlePositionChange
                  }
                  disabled={
                    !form.department_id ||
                    departmentPositions.length ===
                      0
                  }
                >
                  <option value="">
                    {form.department_id
                      ? "Select position"
                      : "Select department first"}
                  </option>

                  {departmentPositions.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </Select>
              </Field>

              <Field
                label="Employment Type"
                required
              >
                <Select
                  name="employment_type"
                  value={
                    form.employment_type
                  }
                  onChange={handleChange}
                >
                  <option value="">
                    Select employment type
                  </option>

                  <option>
                    Full Time
                  </option>

                  <option>
                    Part Time
                  </option>

                  <option>
                    Contract
                  </option>

                  <option>
                    Intern
                  </option>

                  <option>
                    Temporary
                  </option>
                </Select>
              </Field>

              <Field
                label="Joining Date"
                required
              >
                <Input
                  name="joining_date"
                  value={form.joining_date}
                  onChange={handleChange}
                  type="date"
                  icon={CalendarDays}
                />
              </Field>

              <Field label="Reporting Manager">
                <Select
                  name="manager_id"
                  value={form.manager_id}
                  onChange={handleChange}
                  icon={Users}
                  disabled={loadingManagers}
                >
                  <option value="">
                    {loadingManagers
                      ? "Loading managers..."
                      : "Select manager"}
                  </option>

                  {employees.map(
                    (employee) => (
                      <option
                        key={employee.id}
                        value={employee.id}
                      >
                        {employee.first_name}{" "}
                        {employee.last_name}

                        {employee.position
                          ? ` — ${employee.position}`
                          : ""}
                      </option>
                    )
                  )}
                </Select>
              </Field>

              <Field label="Work Location">
                <Select icon={MapPinned}>
                  <option value="">
                    Select location
                  </option>

                  <option>
                    Head Office
                  </option>

                  <option>
                    Branch Office
                  </option>

                  <option>
                    Remote
                  </option>

                  <option>
                    Hybrid
                  </option>
                </Select>
              </Field>

              <Field
                label="Employee Status"
                required
              >
                <Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>
                    Active
                  </option>

                  <option>
                    Inactive
                  </option>

                  <option>
                    Suspended
                  </option>
                </Select>
              </Field>

            </div>
          </section>

          {/* =================================================
              CONTACT
          ================================================= */}

          <section className={sectionClass}>

            <SectionHeader
              icon={Phone}
              title="Contact Information"
              description="Employee's official and personal contact details."
            />

            <div className="grid gap-5 sm:grid-cols-2">

              <Field
                label="Email"
                required
              >
                <Input
                  type="email"
                  name="email"
                  icon={Mail}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="employee@company.com"
                />
              </Field>

              <Field label="Phone">
                <Input
                  name="phone"
                  icon={Phone}
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                />
              </Field>

              <Field
                label="Current Address"
                className="sm:col-span-2"
              >
                <textarea
                  rows="3"
                  value={form.address}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      address:
                        e.target.value,
                    }))
                  }
                  placeholder="Enter current residential address"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:text-white"
                />
              </Field>

              <Field label="City">
                <Input
                  name="city"
                  icon={MapPin}
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </Field>

              <Field label="Country">
                <Input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Pakistan"
                />
              </Field>

              <div className="sm:col-span-2">

                <label className="group flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) =>
                      setSameAddress(
                        e.target.checked
                      )
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

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Permanent address is same as current address
                  </span>

                </label>

              </div>

            </div>
          </section>

          {/* =================================================
              EMERGENCY
          ================================================= */}

          <section className={sectionClass}>

            <SectionHeader
              icon={ShieldCheck}
              title="Emergency Contact"
              description="Contact information to use in case of emergency."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <Field
                label="Contact Name"
                required
              >
                <Input
                  name="emergency_contact_name"
                  value={
                    form.emergency_contact_name
                  }
                  onChange={handleChange}
                  placeholder="Enter contact name"
                />
              </Field>

              <Field label="Relationship">
                <Select>
                  <option value="">
                    Select relationship
                  </option>

                  <option>
                    Father
                  </option>

                  <option>
                    Mother
                  </option>

                  <option>
                    Spouse
                  </option>

                  <option>
                    Brother
                  </option>

                  <option>
                    Sister
                  </option>

                  <option>
                    Other
                  </option>
                </Select>
              </Field>

              <Field
                label="Contact Phone"
                required
              >
                <Input
                  name="emergency_contact_phone"
                  value={
                    form.emergency_contact_phone
                  }
                  onChange={handleChange}
                  icon={Phone}
                  placeholder="+92 300 1234567"
                />
              </Field>

            </div>
          </section>

          {/* =================================================
              SALARY
          ================================================= */}

          <section className={sectionClass}>

            <SectionHeader
              icon={CreditCard}
              title="Salary & Payment Information"
              description="Configure the employee's basic salary."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <Field
                label="Basic Salary"
                required
              >
                <div className="flex h-12 overflow-hidden rounded-xl border border-slate-200 bg-white transition-all focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.035]">

                  <span className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-[11px] font-bold text-slate-500 dark:border-white/10 dark:bg-white/5">
                    PKR
                  </span>

                  <input
                    name="salary"
                    type="number"
                    min="0"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full bg-transparent px-3 text-sm outline-none dark:text-white"
                  />

                </div>
              </Field>

              <Field label="Salary Frequency">
                <Select>
                  <option>
                    Monthly
                  </option>

                  <option>
                    Weekly
                  </option>

                  <option>
                    Hourly
                  </option>
                </Select>
              </Field>

              <Field label="Payment Method">
                <Select>
                  <option value="">
                    Select payment method
                  </option>

                  <option>
                    Bank Transfer
                  </option>

                  <option>
                    Cash
                  </option>

                  <option>
                    Cheque
                  </option>
                </Select>
              </Field>

            </div>
          </section>

          {/* =================================================
              SKILLS
          ================================================= */}

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

                {availableSkills.map(
                  (skill) => {
                    const selected =
                      skills.includes(skill);

                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() =>
                          toggleSkill(
                            skill
                          )
                        }
                        className={
                          "group flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-semibold transition-all duration-300 " +
                          (selected
                            ? "border-blue-500 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                            : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300")
                        }
                      >
                        {selected && (
                          <Check size={12} />
                        )}

                        {skill}
                      </button>
                    );
                  }
                )}

              </div>
            </div>
          </section>

          {/* =================================================
              DOCUMENTS
          ================================================= */}

          <section className={sectionClass}>

            <SectionHeader
              icon={FileText}
              title="Employee Documents"
              description="Upload important employee documents. Files are securely linked to this employee."
            />

            <div className="mb-5 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">

              <ShieldCheck
                size={16}
                className="shrink-0"
              />

              <span>
                Supported formats: PDF, JPG,
                PNG, DOC, DOCX. Maximum file
                size is 10MB.
              </span>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {documentTypes.map(
                (document) => (
                  <DocumentCard
                    key={document.key}
                    label={
                      document.label
                    }
                    file={
                      documents[
                        document.key
                      ]
                    }
                    onSelect={(file) =>
                      handleDocumentSelect(
                        document.key,
                        file
                      )
                    }
                    onRemove={() =>
                      removeDocument(
                        document.key
                      )
                    }
                  />
                )
              )}

            </div>

            {/* UPLOAD STATUS */}

            {Object.values(documents).some(
              Boolean
            ) && (
              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                  />

                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    {
                      Object.values(
                        documents
                      ).filter(Boolean)
                        .length
                    }{" "}
                    document
                    {Object.values(
                      documents
                    ).filter(Boolean)
                      .length !== 1
                      ? "s"
                      : ""}{" "}
                    selected and ready to upload.
                  </span>

                </div>

              </div>
            )}

          </section>

          {/* =================================================
              BOTTOM ACTIONS
          ================================================= */}

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
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-200 px-6 py-3 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-50 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                onClick={() => {
                  setSuccess(
                    "Draft functionality will be connected to the Documents/Drafts system."
                  );

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Save as Draft
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {isSubmitting ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />

                    <span>
                      Creating...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Create Employee
                    </span>

                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

            </div>
          </div>

        </form>
      </div>

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