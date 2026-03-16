"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user && !!accessToken;

  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken(null);
  }, []);

  const signOut = useCallback(async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    clearAuth();
    router.push("/");
  }, [clearAuth, router]);

  const refreshSession = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        clearAuth();
        return null;
      }

      const data = await res.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      clearAuth();
      return null;
    }
  }, [clearAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      let res;
      try {
        res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
      } catch {
        throw new Error("Unable to connect. Please check your internet and try again.");
      }

      if (!res.ok) {
        if (res.status === 401) throw new Error("Incorrect email or password.");
        if (res.status === 400) throw new Error("Please enter a valid email and password.");
        throw new Error("Something went wrong. Please try again later.");
      }

      const data = await res.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
    },
    []
  );

  const register = useCallback(
    async (regData: {
      name: string;
      email: string;
      password: string;
      phoneNumber: string;
      role: string;
      profileImage?: File | null;
    }) => {
      let res;
      try {
        const hasFile = regData.profileImage instanceof File;

        if (hasFile) {
          const formData = new FormData();
          formData.append("name", regData.name);
          formData.append("email", regData.email);
          formData.append("password", regData.password);
          formData.append("phoneNumber", regData.phoneNumber);
          formData.append("role", regData.role);
          formData.append("profileImage", regData.profileImage!);

          res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
        } else {
          res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: regData.name,
              email: regData.email,
              password: regData.password,
              phoneNumber: regData.phoneNumber,
              role: regData.role,
            }),
          });
        }
      } catch {
        throw new Error("Unable to connect. Please check your internet and try again.");
      }

      if (!res.ok) {
        if (res.status === 409) throw new Error("An account with this email already exists.");
        if (res.status === 400) throw new Error("Please check your details and try again.");
        throw new Error("Something went wrong. Please try again later.");
      }

      const data = await res.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
    },
    []
  );

  // Restore session on mount — cookie sent automatically
  useEffect(() => {
    const restore = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);

          // Decode user info from access token payload
          const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
          const endpoint =
            payload.role === "manager"
              ? `/managers/${payload.userId}`
              : `/tenants/${payload.userId}`;

          const userRes = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${data.accessToken}` },
          });

          if (userRes.ok) {
            const userInfo = await userRes.json();
            setUser({
              id: userInfo.id,
              name: userInfo.name,
              email: userInfo.email,
              phoneNumber: userInfo.phoneNumber,
              role: payload.role,
              profileImageUrl: userInfo.profileImageUrl || null,
            });
          }
        }
      } catch {
        // No valid session — that's fine
      }

      setIsLoading(false);
    };

    restore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect unauthenticated users from dashboard routes
  useEffect(() => {
    if (isLoading) return;
    const isDashboard =
      pathname.startsWith("/managers") || pathname.startsWith("/tenants");
    if (isDashboard && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        accessToken,
        login,
        register,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
