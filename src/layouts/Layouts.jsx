import {
  BarChart3,
  LogOut,
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
   ADMIN SIDEBAR
   Keep admin layout separate from user redesign
========================================================= */

const linksAdmin = [
  {
    to: "/admin",
    icon: Shield,
    label: "Dashboard",
  },
  {
    to: "/admin/users",
    icon: Users,
    label: "Users",
  },
  {
    to: "/admin/sessions",
    icon: Waves,
    label: "Sessions",
  },
  {
    to: "/admin/conversations",
    icon: BarChart3,
    label: "Conversations",
  },
];

const AdminSidebar = ({ links }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="glass flex w-full max-w-xs flex-col gap-4 rounded-2xl p-4">

      <Link
        to="/admin"
        className="text-xl font-extrabold text-primary"
      >
        SpeakMate
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            {...link}
          />
        ))}
      </nav>

      <button
        type="button"
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-900/30"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        <LogOut size={16} />

        Logout
      </button>
    </aside>
  );
};

/* =========================================================
   ADMIN LAYOUT
========================================================= */

const AdminShell = () => {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-4 p-4 lg:grid-cols-[260px_1fr]">

      <AdminSidebar links={linksAdmin} />

      <main className="space-y-4">
        <Outlet />
      </main>
    </div>
  );
};

export const AdminLayout = () => <AdminShell />;