import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function PortalLayout() {
  return (
    <div className="portal">

      <Sidebar />

      <div className="portal-main">

        <Header />

        <main className="content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default PortalLayout;