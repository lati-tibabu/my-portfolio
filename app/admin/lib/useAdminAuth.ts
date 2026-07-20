"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase/browser";
import type { SessionUser } from "./types";

export type AdminAuth = {
  signedIn: boolean;
  loadingSession: boolean;
  sessionUser: SessionUser | null;
  authEmail: string;
  authPassword: string;
  authMessage: string;
  busy: boolean;
  setAuthEmail: (value: string) => void;
  setAuthPassword: (value: string) => void;
  signIn: () => Promise<void>;
};

export const useAdminAuth = (): AdminAuth => {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
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
        setSessionUser(
          data.session?.user ? { email: data.session.user.email } : null,
        );
      } catch {
        if (mounted) setSessionUser(null);
      } finally {
        if (mounted) setLoadingSession(false);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ? { email: session.user.email } : null);
      setLoadingSession(false);
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

  return {
    signedIn,
    loadingSession,
    sessionUser,
    authEmail,
    authPassword,
    authMessage,
    busy,
    setAuthEmail,
    setAuthPassword,
    signIn,
  };
};
