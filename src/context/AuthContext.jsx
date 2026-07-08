import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { ROLE_KEY, TOKEN_KEY, USER_KEY } from "../utils/constants";
import { getUserIdFromToken } from "../utils/jwt";
import { getStored, removeStored, setStored } from "../utils/storage";
import { getErrorMessage } from "../utils/errorMessages";

const AuthContext = createContext(null);

const resolveUserId = (user, token) => user?.id ?? getUserIdFromToken(token);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStored(TOKEN_KEY));
  const [role, setRole] = useState(getStored(ROLE_KEY));
  const [user, setUser] = useState(() => {
    const raw = getStored(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    setStored(USER_KEY, JSON.stringify(nextUser));
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const data = await authService.login(payload);
      setToken(data.token);
      setRole(data.role);

      let nextUser = data.user || { username: payload.username, role: data.role };

      try {
        const profile = await userService.getProfile();
        nextUser = { ...profile, role: data.role };
      } catch {
        nextUser = { ...nextUser, username: data.username || payload.username };
      }

      persistUser(nextUser);
      setStored(TOKEN_KEY, data.token);
      setStored(ROLE_KEY, data.role);
      toast.success("Login successful");
      return { ...data, user: nextUser };
    } catch (error) {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
