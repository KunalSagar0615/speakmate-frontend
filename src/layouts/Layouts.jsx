import {
  BarChart3,
  BookUser,
  FileBarChart2,
  Home,
  LogOut,
  MessageCircle,
  Settings,
  Shield,
  Users,
  Waves,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SidebarLink } from "../components/common/UI";

export const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 to-white p-4 dark:from-slate-900 dark:to-slate-950">
    <div className="w-full max-w-lg">
      <Outlet />
    </div>
  </div>
);

const Sidebar = ({ links }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="glass flex w-full max-w-xs flex-col gap-4 rounded-2xl p-4">
      <Link to="/" className="text-xl font-extrabold text-primary">
        SpeakMate
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => (
          <SidebarLink key={link.to} {...link} />
        ))}
      </nav>
      <button
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
};

const linksUser = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/practice", icon: MessageCircle, label: "Start Practice" },
  { to: "/sessions", icon: Waves, label: "Sessions" },
  { to: "/reports", icon: FileBarChart2, label: "Reports" },
  { to: "/profile", icon: BookUser, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const linksAdmin = [
  { to: "/admin", icon: Shield, label: "Dashboard" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/sessions", icon: Waves, label: "Sessions" },
  { to: "/admin/conversations", icon: BarChart3, label: "Conversations" },
];

const MainShell = ({ links }) => (
  <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-4 p-4 lg:grid-cols-[260px_1fr]">
    <Sidebar links={links} />
    <main className="space-y-4">
      <Outlet />
    </main>
  </div>
);

export const UserLayout = () => <MainShell links={linksUser} />;
export const AdminLayout = () => <MainShell links={linksAdmin} />;
