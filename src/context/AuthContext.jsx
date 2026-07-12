import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { storageGet, storageSet, storageRemove } from "../lib/storage";
import { createResourceSync } from "../lib/adminSync";

const AuthContext = createContext(null);

const SESSION_KEY = "session";
const usersApi = createResourceSync("users", "username");

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = storageGet(SESSION_KEY, null);
    if (!session) {
      setReady(true);
      return;
    }
    usersApi
      .get(session)
      .then((user) => setCurrentUser(user))
      .catch(() => storageRemove(SESSION_KEY))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (username, password) => {
    const uname = username.trim().toLowerCase();
    const user = await usersApi.get(uname).catch(() => null);
    if (!user || user.password !== password) {
      return { ok: false, error: "Username or password is incorrect." };
    }
    setCurrentUser(user);
    storageSet(SESSION_KEY, uname);
    return { ok: true, user };
  }, []);

  const signup = useCallback(
    async ({ displayName, username, age, password }) => {
      const uname = username.trim().toLowerCase();
      if (!displayName || !uname || !age || !password) {
        return { ok: false, error: "Please fill in every field." };
      }
      const newUser = {
        username: uname,
        displayName: displayName.trim(),
        age,
        password,
        xp: 0,
        badges: [],
        completed: {},
        joined: new Date().toISOString(),
      };
      try {
        await usersApi.create(newUser);
      } catch {
        return { ok: false, error: "That username is taken — try another." };
      }
      setCurrentUser(newUser);
      storageSet(SESSION_KEY, uname);
      return { ok: true, user: newUser };
    },
    [],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    storageRemove(SESSION_KEY);
  }, []);

  const updateAccount = useCallback(
    async ({ displayName, username, email, currentPassword, newPassword }) => {
      if (!currentUser) return { ok: false, error: "Not logged in." };
      if (!currentPassword || currentUser.password !== currentPassword) {
        return { ok: false, error: "Current password is incorrect." };
      }
      const uname = username.trim().toLowerCase();
      if (!displayName.trim() || !uname) {
        return { ok: false, error: "Please fill in every required field." };
      }
      if (newPassword && newPassword.length < 4) {
        return {
          ok: false,
          error: "New password must be at least 4 characters.",
        };
      }

      const updated = {
        ...currentUser,
        displayName: displayName.trim(),
        username: uname,
        email: email.trim(),
        password: newPassword || currentUser.password,
      };

      try {
        if (uname !== currentUser.username) {
          const existing = await usersApi.get(uname).catch(() => null);
          if (existing)
            return {
              ok: false,
              error: "That username is taken — try another.",
            };
          await usersApi.create(updated);
          await usersApi.remove(currentUser.username);
        } else {
          await usersApi.update(uname, updated);
        }
      } catch (e) {
        return { ok: false, error: e.message || "Could not save changes." };
      }

      setCurrentUser(updated);
      storageSet(SESSION_KEY, uname);
      return { ok: true, user: updated };
    },
    [currentUser],
  );

  const saveCurrentUser = useCallback((updated) => {
    setCurrentUser(updated);
    usersApi.update(updated.username, updated).catch(() => {});
  }, []);

  const value = {
    currentUser,
    ready,
    login,
    signup,
    logout,
    saveCurrentUser,
    updateAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

// Exposed for the admin "Users" manager, which needs to see/edit every
// account, not just the currently logged-in one.
export function getAllUsers() {
  return usersApi.list();
}
export function saveUser(user) {
  return usersApi.update(user.username, user);
}
export function deleteUser(username) {
  return usersApi.remove(username);
}
