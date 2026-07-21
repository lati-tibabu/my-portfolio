import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "../../lib/supabase/server";
import type { AdminRole } from "./constants";

export function getServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function requireAuth() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Unauthorized. Sign in to manage users.");
  }

  return data.user;
}

export async function requireAdminRole(role: AdminRole = "admin") {
  const user = await requireAuth();
  const serviceClient = getServiceRoleClient();

  if (role === "admin") {
    const { data: profile, error } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      throw new Error("Could not verify admin role.");
    }

    if (profile?.role !== "admin") {
      throw new Error("Admins only.");
    }
  }

  return user;
}
