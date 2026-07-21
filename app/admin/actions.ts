"use server";

import { getServiceRoleClient, requireAdminRole } from "./lib/server";

export type AdminUser = {
  id: string;
  email: string | null;
  displayName: string;
  role: string;
  createdAt: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
  displayName: string;
  role: "admin" | "editor";
};

export type UpdateUserInput = {
  id: string;
  displayName: string;
  role: "admin" | "editor";
};

export async function listUsers(): Promise<AdminUser[]> {
  await requireAdminRole("admin");
  const serviceClient = getServiceRoleClient();

  const { data: authData, error: authError } = await serviceClient.auth.admin.listUsers();
  if (authError) {
    throw new Error(authError.message);
  }

  const users = authData.users;
  if (users.length === 0) {
    return [];
  }

  const ids = users.map((user) => user.id);
  const { data: profiles, error: profilesError } = await serviceClient
    .from("profiles")
    .select("id,display_name,role")
    .in("id", ids);

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  const profileById = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      {
        displayName: String(profile.display_name ?? ""),
        role: String(profile.role ?? "admin"),
      },
    ]),
  );

  return users.map((user) => {
    const profile = profileById.get(user.id);
    return {
      id: user.id,
      email: user.email ?? null,
      displayName:
        profile?.displayName ||
        String(user.user_metadata?.name ?? user.user_metadata?.full_name ?? ""),
      role: profile?.role || "admin",
      createdAt: user.created_at,
    };
  });
}

export async function createUser(input: CreateUserInput): Promise<void> {
  await requireAdminRole("admin");
  const serviceClient = getServiceRoleClient();

  const { data, error } = await serviceClient.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { name: input.displayName },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("User was not created.");
  }

  const { error: profileError } = await serviceClient.from("profiles").upsert(
    {
      id: data.user.id,
      display_name: input.displayName,
      role: input.role,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (profileError) {
    throw new Error(profileError.message);
  }
}

export async function updateUser(input: UpdateUserInput): Promise<void> {
  await requireAdminRole("admin");
  const serviceClient = getServiceRoleClient();

  const { error } = await serviceClient.from("profiles").upsert(
    {
      id: input.id,
      display_name: input.displayName,
      role: input.role,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteUser(id: string): Promise<void> {
  const currentUser = await requireAdminRole("admin");

  if (id === currentUser.id) {
    throw new Error("You cannot delete your own account.");
  }

  const serviceClient = getServiceRoleClient();
  const { error } = await serviceClient.auth.admin.deleteUser(id);

  if (error) {
    throw new Error(error.message);
  }
}
