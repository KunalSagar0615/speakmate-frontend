import {
  BarChart3,
  Settings,
  Shield,
  Users,
  Waves,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SidebarLink } from "../components/common/UI";
import speakMateLogo from "../assets/speakmate-logo.png";

/* =========================================================
   AUTH LAYOUT
========================================================= */

export const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 to-white p-4 dark:from-slate-900 dark:to-slate-950">
    <div className="w-full max-w-lg">
      <Outlet />
    </div>
  </div>
);

/* =========================================================
   USER NAVBAR
========================================================= */

const UserNavbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="group flex items-center gap-3"
        >
          <img
            src={speakMateLogo}
            alt="SpeakMate"
            className="h-10 w-10 rounded-md object-cover shadow-sm transition duration-200 group-hover:scale-105"
          />

          <div className="leading-tight">
            <p className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              SpeakMate
            </p>

            <p className="hidden text-[11px] font-medium text-slate-500 sm:block dark:text-slate-400">
              Your AI Friend
            </p>
          </div>
        </Link>

        {/* Settings */}
        <Link
          to="/settings"
          aria-label="Settings"
          title="Settings"
          className="group flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-400"
        >
          <Settings
            size={20}
            className="transition-transform duration-300 group-hover:rotate-45"
          />
        </Link>
      </div>
    </header >
  );
};

/* =========================================================
   USER FOOTER
========================================================= */

const UserFooter = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/70 dark:border-slate-800/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">

        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <img
            src={speakMateLogo}
            alt="SpeakMate"
            className="h-6 w-6 rounded-sm object-cover"
          />
          <span>SpeakMate AI Friend</span>
        </div>

        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Practice. Improve. Succeed.
        </p>
      </div>
    </footer>
  );
};

/* =========================================================
   USER LAYOUT
========================================================= */

export const UserLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">

      <UserNavbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <Outlet />
      </main>

      <UserFooter />
    </div>
  );
};

/* =========================================================
ADMIN NAVBAR
========================================================= */

const adminLinks = [
  {
    to: "/admin/users",
    icon: Users,
    label: "Users",
  },
];

const AdminNavbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/admin"
          className="group flex items-center gap-3"
        >
          <img
            src={speakMateLogo}
            alt="SpeakMate"
            className="h-9 w-9 rounded-lg object-cover shadow-sm transition duration-200 group-hover:scale-105"
          />

          <div className="leading-tight">
            <p className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              SpeakMate
            </p>

            <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:block dark:text-slate-400">
              Admin Panel
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="ml-auto flex items-center gap-2">
          {adminLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-400"
              >
                <Icon
                  size={18}
                  className="transition-transform duration-200 group-hover:scale-110"
                />

                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">

          {/* Settings */}
          <Link
            to="/admin/settings"
            aria-label="Admin Settings"
            title="Settings"
            className="group flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-400"
          >
            <Settings
              size={20}
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </Link>

        </div>
      </div>

    </header>
  );
};


/* =========================================================
ADMIN FOOTER
========================================================= */

const AdminFooter = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">

        {/* Brand */}
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <img
            src={speakMateLogo}
            alt="SpeakMate"
            className="h-6 w-6 rounded-sm object-cover"
          />

          <span>
            SpeakMate AI Friend
          </span>
        </div>

        {/* Slogan */}
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Practice. Improve. Succeed.
        </p>

      </div>
    </footer>
  );
};


/* =========================================================
ADMIN LAYOUT
========================================================= */

const AdminShell = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">

      {/* Navbar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <AdminFooter />

    </div>
  );
};

export const AdminLayout = () => <AdminShell />;