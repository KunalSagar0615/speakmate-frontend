import {
  BriefcaseBusiness,
  Globe2,
  GraduationCap,
  LogOut,
  Mail,
  Moon,
  Phone,
  Shield,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PulseGridLoader from "../../components/common/PulseGridLoader";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { userService } from "../../services/userService";
import { isEmailVerified } from "../../utils/emailVerified";

export const AdminSettingsPage = () => {
  const { theme, setTheme } = useTheme();

  const {
    user: cachedUser,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  // =========================================================
  // LOAD ADMIN PROFILE
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setProfileError("");

      try {
        const data = await userService.getProfile();

        if (cancelled) return;

        setProfile(data);
      } catch (error) {
        if (cancelled) return;

        setProfile(cachedUser || null);
        setProfileError(
          "Unable to refresh admin profile information."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <PulseGridLoader />
      </div>
    );
  }

  // =========================================================
  // PROFILE
  // =========================================================

  const verified = isEmailVerified(
    profile?.emailVerified
  );

  const profileFields = [
    {
      label: "Email",
      value: profile?.email,
      icon: Mail,
    },
    {
      label: "Mobile Number",
      value: profile?.mobileNumber,
      icon: Phone,
    },
    {
      label: "Country",
      value: profile?.country,
      icon: Globe2,
    },
    {
      label: "Education",
      value: profile?.highestEducation,
      icon: GraduationCap,
    },
    {
      label: "Occupation",
      value: profile?.currentOccupation,
      icon: BriefcaseBusiness,
    },
  ].filter((item) => item.value);

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section>
        <p className="text-sm font-semibold text-sky-500">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage your admin account and application preferences.
        </p>
      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {profileError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
          {profileError}
        </div>
      )}

      {/* =====================================================
          ADMIN PROFILE
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        {/* PROFILE HEADER */}

        <div className="relative overflow-hidden px-5 py-6 sm:px-7">

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-sky-100 blur-3xl dark:bg-sky-950/40" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
              <Shield size={30} />
            </div>

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="truncate text-xl font-bold text-slate-900 dark:text-white">
                  {profile?.name ||
                    profile?.username ||
                    "SpeakMate Admin"}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                  <Shield size={13} />
                  ADMIN
                </span>

                {verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <ShieldCheck size={13} />
                    Verified
                  </span>
                )}

              </div>

              {profile?.username && (
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  @{profile.username}
                </p>
              )}

              {profile?.email && (
                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                  {profile.email}
                </p>
              )}

            </div>
          </div>
        </div>

        {/* PROFILE INFORMATION */}

        <div className="border-t border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-7">

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Admin Information
          </h3>

          <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">

            {profileFields.map(
              ({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex min-w-0 items-start gap-3"
                >

                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-medium text-slate-400">
                      {label}
                    </p>

                    <p className="mt-0.5 break-words text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {value}
                    </p>

                  </div>
                </div>
              )
            )}

          </div>

          {/* ROLE */}

          <div className="mt-5 flex items-start gap-3">

            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-500 dark:bg-sky-950/30 dark:text-sky-400">
              <Shield size={17} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Role
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {profile?.role || "ADMIN"}
              </p>
            </div>

          </div>

          {/* CREATED DATE */}

          {profile?.createdAt && (
            <div className="mt-5 flex items-start gap-3">

              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <User size={17} />
              </div>

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Account Created
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {new Date(
                    profile.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>

            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          APPEARANCE
      ===================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Customize how the admin panel looks.
          </p>

        </div>

        <div className="grid gap-3 sm:grid-cols-2">

          {/* LIGHT */}

          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
              theme === "light"
                ? "border-sky-400 bg-sky-50 ring-2 ring-sky-500/10 dark:bg-sky-950/20"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            }`}
          >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/30">
              <Sun size={21} />
            </div>

            <div>

              <p className="font-semibold text-slate-900 dark:text-white">
                Light Mode
              </p>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Bright and clean interface
              </p>

            </div>

            <div
              className={`ml-auto h-4 w-4 rounded-full border-2 ${
                theme === "light"
                  ? "border-sky-500 bg-sky-500 ring-4 ring-sky-500/10"
                  : "border-slate-300 dark:border-slate-600"
              }`}
            />

          </button>

          {/* DARK */}

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
              theme === "dark"
                ? "border-sky-400 bg-sky-50 ring-2 ring-sky-500/10 dark:bg-sky-950/20"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            }`}
          >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400">
              <Moon size={21} />
            </div>

            <div>

              <p className="font-semibold text-slate-900 dark:text-white">
                Dark Mode
              </p>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Comfortable for low-light environments
              </p>

            </div>

            <div
              className={`ml-auto h-4 w-4 rounded-full border-2 ${
                theme === "dark"
                  ? "border-sky-500 bg-sky-500 ring-4 ring-sky-500/10"
                  : "border-slate-300 dark:border-slate-600"
              }`}
            />

          </button>

        </div>
      </section>

      {/* =====================================================
          ACCOUNT
      ===================================================== */}

      <section className="border-t border-slate-200 pt-6 dark:border-slate-800">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="font-bold text-slate-900 dark:text-white">
              Account
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign out of the admin account on this device.
            </p>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/30 sm:self-auto"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </section>

    </div>
  );
};