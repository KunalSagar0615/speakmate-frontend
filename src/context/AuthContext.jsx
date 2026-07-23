import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { ROLE_KEY, TOKEN_KEY, USER_KEY } from "../utils/constants";
import { getUserIdFromToken } from "../utils/jwt";
import { getStored, removeStored, setStored } from "../utils/storage";
import { getErrorMessage } from "../utils/errorMessages";

const AuthContext = createContext(null);

const resolveUserId = (user, token) =>
  user?.id ?? getUserIdFromToken(token);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStored(TOKEN_KEY));
  const [role, setRole] = useState(() => getStored(ROLE_KEY));

  const [user, setUser] = useState(() => {
    const raw = getStored(USER_KEY);

    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      removeStored(USER_KEY);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const persistUser = (nextUser) => {
    setUser(nextUser);

    if (nextUser) {
      setStored(USER_KEY, JSON.stringify(nextUser));
    } else {
      removeStored(USER_KEY);
    }
  };

  const login = async (payload) => {
    setLoading(true);

    try {
      // 1. Login
      const data = await authService.login(payload);

      if (!data?.token) {
        throw new Error("Authentication token was not returned by the server.");
      }

      // 2. IMPORTANT:
      // Persist token BEFORE making any authenticated request.
      setStored(TOKEN_KEY, data.token);

      if (data.role) {
        setStored(ROLE_KEY, data.role);
      } else {
        removeStored(ROLE_KEY);
      }

      // 3. Update React state
      setToken(data.token);
      setRole(data.role ?? null);

      let nextUser =
        data.user || {
          username: data.username || payload.username,
          role: data.role,
        };

      // 4. Now axiosClient can read the NEW token from localStorage.
      try {
        const profile = await userService.getProfile();

        nextUser = {
          ...profile,
          role: data.role ?? profile?.role,
        };
      } catch (profileError) {
        console.warn(
          "Unable to load profile after login:",
          profileError
        );

        nextUser = {
          ...nextUser,
          username:
            nextUser?.username ||
            data.username ||
            payload.username,
        };
      }

      // 5. Store user
      persistUser(nextUser);

      toast.success("Login successful");

      return {
        ...data,
        user: nextUser,
      };
    } catch (error) {
      // If login itself failed, don't leave stale auth data behind.
      setToken(null);
      setRole(null);
      setUser(null);

      removeStored(TOKEN_KEY);
      removeStored(ROLE_KEY);
      removeStored(USER_KEY);

      toast.error(getErrorMessage(error) || "Login failed");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);

    removeStored(TOKEN_KEY);
    removeStored(ROLE_KEY);
    removeStored(USER_KEY);

    toast.success("Logged out");
  };

  const value = useMemo(
    () => ({
      token,
      role,
      user,
      loading,
      login,
      logout,
      setUser: persistUser,
      userId: resolveUserId(user, token),
      isAuthenticated: Boolean(token),
    }),
    [token, role, user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};