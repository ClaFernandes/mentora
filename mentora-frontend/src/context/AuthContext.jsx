import { createContext, useState, useMemo, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../services/authService.js";
import { getMentorProfile } from "../services/mentorService.js";
import { getMenteeProfile } from "../services/menteeService.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  async function buildFullUser(basicUser) {
    if (basicUser.role === "mentor") {
      const profile = await getMentorProfile(basicUser.id);
      return {
        ...basicUser,
        bio: profile.bio,
        mentorProfile: {
          areas: profile.areas,
          isVerified: profile.isVerified,
          avgRating: profile.avgRating,
          offerings: profile.offerings,
        },
      };
    }

    if (basicUser.role === "mentee") {
      const profile = await getMenteeProfile(basicUser.id);
      return {
        ...basicUser,
        bio: profile.bio,
        menteeProfile: {
          interests: profile.interests,
          followingMentors: profile.followingMentors,
        },
      };
    }

    return basicUser;
  }

  async function login(email, password) {
    const { token, user } = await loginUser(email, password);
    localStorage.setItem("token", token);
    setToken(token);
    const fullUser = await buildFullUser(user);
    setUser(fullUser);
    return fullUser;
  }

  async function register({ name, email, password, confirmPassword, role }) {
    const { token, user } = await registerUser({ name, email, password, confirmPassword, role });
    localStorage.setItem("token", token);
    setToken(token);
    const fullUser = await buildFullUser(user);
    setUser(fullUser);
    return fullUser;
  }

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await getCurrentUser(token);
        setToken(token);
        const fullUser = await buildFullUser(currentUser);
        setUser(fullUser);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);


  // Falta corrigir
  function updateUser(updates) {
    setUser((prev) => ({ ...prev, ...updates }));
    return Promise.resolve();
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, setUser, loading, token, login, register, updateUser, logout }),
    [user, loading, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
