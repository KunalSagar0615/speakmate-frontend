import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { userService } from "../services/userService";
import { dashboardService } from "../services/dashboardService";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const { userId, user: cachedUser, setUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // =========================================================
  // CACHE KEY
  // =========================================================

  const ANALYTICS_CACHE_KEY =
    userId
      ? `speakmate_dashboard_analytics_${userId}`
      : null;

  // =========================================================
  // LOAD SETTINGS
  // =========================================================

  const loadSettings = useCallback(
    async (forceRefresh = false) => {
      if (!userId) {
        setProfile(null);
        setAnalytics(null);
        setLoaded(false);
        return;
      }

      // Already loaded → don't request again
      if (loaded && !forceRefresh) {
        return;
      }

      setLoading(true);

      try {
        // -----------------------------------------------------
        // LOAD CACHED ANALYTICS IMMEDIATELY
        // -----------------------------------------------------

        if (ANALYTICS_CACHE_KEY) {
          const cachedAnalytics =
            localStorage.getItem(ANALYTICS_CACHE_KEY);

          if (cachedAnalytics) {
            try {
              setAnalytics(
                JSON.parse(cachedAnalytics)
              );
            } catch {
              localStorage.removeItem(
                ANALYTICS_CACHE_KEY
              );
            }
          }
        }

        // -----------------------------------------------------
        // LOAD PROFILE + ANALYTICS
        // -----------------------------------------------------

        const [profileData, analyticsData] =
          await Promise.all([
            userService.getProfile(),

            dashboardService.getAnalytics(),
          ]);

        // -----------------------------------------------------
        // PROFILE
        // -----------------------------------------------------

        setProfile(profileData);

        setUser({
          ...profileData,
          role: cachedUser?.role,
        });

        // -----------------------------------------------------
        // ANALYTICS
        // -----------------------------------------------------

        setAnalytics(analyticsData);

        if (ANALYTICS_CACHE_KEY) {
          localStorage.setItem(
            ANALYTICS_CACHE_KEY,
            JSON.stringify(analyticsData)
          );
        }

        setLoaded(true);
      } catch {
        // -----------------------------------------------------
        // PROFILE FALLBACK
        // -----------------------------------------------------

        if (!profile) {
          setProfile(cachedUser || null);
        }

        // -----------------------------------------------------
        // Analytics can still remain from localStorage
        // -----------------------------------------------------

        setLoaded(true);
      } finally {
        setLoading(false);
      }
    },
    [
      userId,
      cachedUser,
      setUser,
      loaded,
      ANALYTICS_CACHE_KEY,
      profile,
    ]
  );

  // =========================================================
  // PRELOAD WHEN USER IS AVAILABLE
  // =========================================================

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setAnalytics(null);
      setLoaded(false);
      return;
    }

    loadSettings();
  }, [userId, loadSettings]);

  // =========================================================
  // REFRESH SETTINGS
  // =========================================================

  const refreshSettings = useCallback(async () => {
    setLoaded(false);

    await loadSettings(true);
  }, [loadSettings]);

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value = {
    profile,
    analytics,

    loading,
    loaded,

    loadSettings,
    refreshSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
};