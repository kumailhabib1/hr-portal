import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import SplashScreen from "./pages/SplashScreen";
import Profile from "./pages/profile";
import Settings from "./pages/Settings";

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-[#f6f8fc] dark:bg-black">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <main className={`min-h-screen transition-all duration-300 ${collapsed ? "lg:ml-[82px]" : "lg:ml-[270px]"}`}>
              <Header />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/employees" element={<div className="p-8 text-xl font-bold">Employees</div>} />
                <Route path="/employees/add" element={<div className="p-8 text-xl font-bold">Add Employee</div>} />
                <Route path="/attendance" element={<div className="p-8 text-xl font-bold">Attendance</div>} />
                <Route path="/leave" element={<div className="p-8 text-xl font-bold">Leave Management</div>} />
                <Route path="/payroll" element={<div className="p-8 text-xl font-bold">Payroll</div>} />
                <Route path="/departments" element={<div className="p-8 text-xl font-bold">Departments</div>} />
                <Route path="/performance" element={<div className="p-8 text-xl font-bold">Performance</div>} />
                <Route path="/documents" element={<div className="p-8 text-xl font-bold">Documents</div>} />
                <Route path="/reports" element={<div className="p-8 text-xl font-bold">Reports</div>} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

export default App;