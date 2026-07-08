import { Loader2, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export const Card = ({ className = "", children }) => (
  <div className={`glass rounded-2xl p-5 shadow-soft ${className}`}>{children}</div>
);

export const Button = ({ className = "", children, variant = "primary", ...props }) => {
  const styles = {
    primary: "bg-primary text-white hover:bg-sky-500",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({
  label,
  className = "",
  autoCapitalize = "none",
  autoCorrect = "off",
  spellCheck = false,
  ...props
}) => (
  <label className="flex w-full flex-col gap-2 text-sm">
    {label && <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>}
    <input
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      spellCheck={spellCheck}
      className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none ring-primary/50 focus:ring dark:border-slate-700 dark:bg-slate-900 ${className}`}
      {...props}
    />
  </label>
);

export const Loader = () => <Loader2 className="h-5 w-5 animate-spin" />;

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export const StatCard = ({ title, value }) => (
  <Card>
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-50">{value}</p>
  </Card>
);

export const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-primary text-white"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
      }`
    }
  >
    <Icon size={17} /> {label}
  </NavLink>
);
