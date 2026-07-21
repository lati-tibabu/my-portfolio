"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase/browser";
import type { SessionUser } from "./types";
import type { AdminRole } from "./constants";

export type AdminAuth = {
  signedIn: boolean;
  loadingSession: boolean;
  loadingProfile: boolean;
  sessionUser: SessionUser | null;
  adminName: string;
  adminRole: string;
  authEmail: string;
  authPassword: string;
  authMessage: string;
  busy: boolean;
  setAuthEmail: (value: string) => void;
  setAuthPassword: (value: string) => void;
  signIn: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
};

const fallbackAdminName = (email?: string | null) => {
  if (!email) return "latitibabu";
  return email.split("@")[0] || "latitibabu";
};

export const useAdminAuth = (): AdminAuth => {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminRole, setAdminRole] = useState<AdminRole>("admin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const signedIn = useMemo(() => Boolean(sessionUser), [sessionUser]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const { data } = await supabaseBrowser.auth.getSession();
        if (!mounted) return;
        const user = data.session?.user
          ? { id: data.session.user.id, email: data.session.user.email }
          : null;
        setSessionUser(user);
        if (user?.id) {
          await loadProfile(user.id, user.email);
        }
      } catch {
        if (mounted) setSessionUser(null);
      } finally {
        if (mounted) setLoadingSession(false);
      }
    };

    const loadProfile = async (userId: string, email?: string | null) => {
      if (!mounted) return;
      setLoadingProfile(true);
      try {
        const { data } = await supabaseBrowser
          .from("profiles")
          .select("display_name,role")
          .eq("id", userId)
          .maybeSingle();

        if (data?.display_name) {
          setAdminName(data.display_name);
          if (data.role === "admin" || data.role === "editor") {
            setAdminRole(data.role);
          }
        } else {
          const fallback = fallbackAdminName(email);
          await supabaseBrowser
            .from("profiles")
            .insert({ id: userId, display_name: fallback, role: "admin" });
          setAdminName(fallback);
        }
      } catch {
        setAdminName(fallbackAdminName(email));
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      const user = session?.user
        ? { id: session.user.id, email: session.user.email }
        : null;
      setSessionUser(user);
      setLoadingSession(false);
      if (user?.id) {
        void loadProfile(user.id, user.email);
      } else {
        setAdminName("");
        setAdminRole("admin");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    setAuthMessage("");
    setBusy(true);

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setAuthMessage(error.message);
      setBusy(false);
      return;
    }

    setAuthMessage("Signed in successfully.");
    setBusy(false);
    router.refresh();
  };

  const updateDisplayName = async (displayName: string) => {
    const name = displayName.trim();
    if (!name || !sessionUser?.email) return;

    const { data: sessionData } = await supabaseBrowser.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return;

    const { error } = await supabaseBrowser
      .from("profiles")
      .update({ display_name: name, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    setAdminName(name);
  };

  return {
    signedIn,
    loadingSession,
    loadingProfile,
    sessionUser,
    adminName: adminName || fallbackAdminName(sessionUser?.email),
    adminRole,
    authEmail,
    authPassword,
    authMessage,
    busy,
    setAuthEmail,
    setAuthPassword,
    signIn,
    updateDisplayName,
  };
};
