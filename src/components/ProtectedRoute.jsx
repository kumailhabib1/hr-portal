import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function getStoredAuth() {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const userStorage =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  let user = null;

  try {
    user = userStorage
      ? JSON.parse(userStorage)
      : null;
  } catch {
    user = null;
  }

  return { token, user };
}

function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuthentication = async () => {
      const { token } = getStoredAuth();

      // No token
      if (!token) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Authentication failed"
          );
        }

        // Update latest user information
        if (data.user) {
          const isLocalStorage =
            localStorage.getItem("token") === token;

          const storage = isLocalStorage
            ? localStorage
            : sessionStorage;

          storage.setItem(
            "user",
            JSON.stringify(data.user)
          );
        }

        setAuthenticated(true);
      } catch (error) {
        console.error(
          "Authentication verification failed:",
          error
        );

        // Remove invalid authentication
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    verifyAuthentication();
  }, []);

  // While checking JWT
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

          <p className="text-sm font-medium text-slate-500">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // Invalid / expired / missing token
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Valid JWT
  return <Outlet />;
}

export default ProtectedRoute;