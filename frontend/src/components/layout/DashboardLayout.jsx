import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  return (
    <div className="
      min-h-screen
      bg-slate-100
      text-slate-900
      dark:bg-slate-950
      dark:text-slate-100
    ">
      <Sidebar />

      <div className="
        lg:ml-64
      ">
        <Navbar />

        <main className="
          p-4 sm:p-6 lg:p-8
        ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;