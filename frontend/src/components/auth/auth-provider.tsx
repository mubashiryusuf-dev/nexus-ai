"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { apiClient } from "@/lib/api-client";
import type { AuthResponse, AuthUser } from "@/types/api";

interface SessionState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  mode: "guest" | "authenticated";
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isReady: boolean;
  token: string | null;
  user: AuthUser | null;
  sessionMode: "guest" | "authenticated";
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  signInWithProvider: (provider: "Google" | "GitHub" | "Microsoft") => Promise<void>;
  signOut: () => void;
}

const AUTH_STORAGE_KEY = "nexusai-auth-session";
const AuthContext = createContext<AuthContextValue | null>(null);

function mapAuthResponseToSession(payload: AuthResponse): SessionState {
  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    user: payload.user,
    mode: "authenticated"
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [session, setSession] = useState<SessionState>({
    accessToken: null,
    refreshToken: null,
    user: null,
    mode: "guest"
  });
  const [isReady, setIsReady] = useState(false);

  const persistSession = (nextSession: SessionState): void => {
    setSession(nextSession);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
  };

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

      if (storedSession) {
        try {
          setSession(JSON.parse(storedSession) as SessionState);
          setIsReady(true);
          return;
        } catch {
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }

      try {
        const guestSession = await apiClient.createGuestSession("en");
        persistSession({
          accessToken: guestSession.accessToken,
          refreshToken: null,
          user: null,
          mode: "guest"
        });
      } finally {
        setIsReady(true);
      }
    };

    void initialize();
  }, []);

  const signIn = async ({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    const response = await apiClient.signIn({
      email,
      password
    });

    persistSession(mapAuthResponseToSession(response));
  };

  const signUp = async ({
    fullName,
    email,
    password,
    confirmPassword
  }: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> => {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const response = await apiClient.signUp({
      fullName,
      email,
      password
    });

    persistSession(mapAuthResponseToSession(response));
  };

  const signInWithProvider = async (
    provider: "Google" | "GitHub" | "Microsoft"
  ): Promise<void> => {
    const providerEmail = `${provider.toLowerCase()}.user@nexusai.app`;
    const response = await apiClient.signIn({
      email: providerEmail,
      password: "ProviderAuth123"
    });

    persistSession({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: {
        ...response.user,
        fullName: `${provider} User`,
        email: providerEmail
      },
      mode: "authenticated"
    });
  };

  const signOut = (): void => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession({
      accessToken: null,
      refreshToken: null,
      user: null,
      mode: "guest"
    });

    void apiClient.createGuestSession("en").then((guestSession) => {
      persistSession({
        accessToken: guestSession.accessToken,
        refreshToken: null,
        user: null,
        mode: "guest"
      });
    });
  };

  const value = useMemo<AuthContextValue>(() => {
    return {
      isAuthenticated: session.mode === "authenticated" && Boolean(session.user),
      isReady,
      token: session.accessToken,
      user: session.user,
      sessionMode: session.mode,
      signIn,
      signUp,
      signInWithProvider,
      signOut
    };
  }, [isReady, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return value;
}