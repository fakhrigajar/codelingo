import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { storageGet, storageSet, storageRemove } from "../lib/storage";
import { createLocalCollection } from "../lib/localStore";
import { DEFAULT_USERS } from "../data/data";

const AuthContext = createContext(null);

const SESSION_KEY = "session";
const usersStore = createLocalCollection("users", "username", DEFAULT_USERS);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = storageGet(SESSION_KEY, null);
    if (!session) {
      setReady(true);
      return;
    }

    let cancelled = false;

    usersStore.get(session)
      .then((user) => { if (!cancelled) setCurrentUser(user); })
      .catch(() => { if (!cancelled) storageRemove(SESSION_KEY); })
      .finally(() => { if (!cancelled) setReady(true); });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const uname = username.trim().toLowerCase();
    const user = await usersStore.get(uname).catch(() => null);
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
        role: "community",
        xp: 0,
        badges: [],
        completed: {},
        favorites: [],
        joined: new Date().toISOString(),
      };
      try {
        await usersStore.create(newUser);
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
      // Current password is only checked when actually changing the
      // password — editing username/email doesn't need re-authentication.
      if (newPassword) {
        if (!currentPassword || currentUser.password !== currentPassword) {
          return { ok: false, error: "Current password is incorrect." };
        }
        if (newPassword.length < 4) {
          return {
            ok: false,
            error: "New password must be at least 4 characters.",
          };
        }
      }
      const uname = username.trim().toLowerCase();
      if (!displayName.trim() || !uname) {
        return { ok: false, error: "Please fill in every required field." };
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
          const existing = await usersStore.get(uname).catch(() => null);
          if (existing)
            return {
              ok: false,
              error: "That username is taken — try another.",
            };
          await usersStore.create(updated);
          await usersStore.remove(currentUser.username);
        } else {
          await usersStore.update(uname, updated);
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
    usersStore.update(updated.username, updated).catch(() => {});
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
  return usersStore.list();
}
export function saveUser(user) {
  return usersStore.update(user.username, user);
}
export function deleteUser(username) {
  return usersStore.remove(username);
}
