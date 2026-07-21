"use client";

import { useCallback, useEffect, useState } from "react";
import { inputClass, sectionClass } from "../lib/constants";
import { useConfirmDialog } from "../lib/useConfirmDialog";
import {
  type AdminUser,
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "../actions";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  FormField,
  FormSection,
  ListCard,
  PanelHeader,
} from "./ui";

export type UsersPanelProps = {
  currentUserId?: string;
  currentUserEmail?: string | null;
  adminName: string;
  onAdminNameChange?: (displayName: string) => Promise<void>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setMessage: (value: string) => void;
};

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
];

export default function UsersPanel({
  currentUserId,
  currentUserEmail,
  adminName,
  onAdminNameChange,
  busy,
  setBusy,
  setMessage,
}: UsersPanelProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "admin" as "admin" | "editor",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    displayName: "",
    role: "admin" as "admin" | "editor",
  });
  const [localAdminName, setLocalAdminName] = useState(adminName);
  const { confirm, dialogProps } = useConfirmDialog();

  useEffect(() => {
    setLocalAdminName(adminName);
  }, [adminName]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load users.",
      );
    } finally {
      setLoading(false);
    }
  }, [setMessage]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleCreate = async () => {
    if (!newUser.email.trim() || !newUser.password.trim()) {
      setMessage("Email and password are required.");
      return;
    }
    setBusy(true);
    try {
      await createUser({
        email: newUser.email.trim(),
        password: newUser.password,
        displayName: newUser.displayName.trim() || newUser.email.split("@")[0],
        role: newUser.role,
      });
      setMessage("User created successfully.");
      setNewUser({
        email: "",
        password: "",
        displayName: "",
        role: "admin",
      });
      await refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to create user.",
      );
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (user: AdminUser) => {
    setEditingId(user.id);
    setEditForm({ displayName: user.displayName, role: user.role as "admin" | "editor" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ displayName: "", role: "admin" });
  };

  const handleUpdate = async (id: string) => {
    setBusy(true);
    try {
      await updateUser({
        id,
        displayName: editForm.displayName.trim(),
        role: editForm.role,
      });
      setMessage("User updated.");
      setEditingId(null);
      await refresh();
      if (id === currentUserId && onAdminNameChange) {
        await onAdminNameChange(editForm.displayName.trim());
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to update user.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = (user: AdminUser) => {
    if (user.id === currentUserId) {
      setMessage("You cannot delete your own account.");
      return;
    }
    confirm({
      title: "Delete user?",
      message: `${user.email ?? user.displayName} will be permanently removed.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        setBusy(true);
        try {
          await deleteUser(user.id);
          setMessage("User deleted.");
          await refresh();
        } catch (error) {
          setMessage(
            error instanceof Error ? error.message : "Failed to delete user.",
          );
        } finally {
          setBusy(false);
        }
      },
    });
  };

  const handleSaveAdminName = async () => {
    if (!onAdminNameChange) return;
    setBusy(true);
    try {
      await onAdminNameChange(localAdminName.trim());
      setMessage("Your display name was updated.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update display name.",
      );
    } finally {
      setBusy(false);
    }
  };

  const isSelf = (id: string) => id === currentUserId;

  return (
    <div className="space-y-4">
      <PanelHeader
        title="Users"
        subtitle="Admin accounts"
        count={users.length}
        views={[]}
        view="list"
        onViewChange={() => {}}
        actions={
          <Button variant="secondary" onClick={refresh} disabled={busy || loading}>
            Refresh
          </Button>
        }
      />

      <FormSection title="Your profile" description="Display name used as the author on content.">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <FormField label="Signed in as" className="flex-1">
            <input
              className={inputClass}
              value={currentUserEmail ?? ""}
              disabled
            />
          </FormField>
          <FormField label="Display name" className="flex-1">
            <input
              className={inputClass}
              value={localAdminName}
              placeholder="latitibabu"
              onChange={(e) => setLocalAdminName(e.target.value)}
            />
          </FormField>
          <Button
            variant="primary"
            onClick={handleSaveAdminName}
            disabled={busy || !localAdminName.trim()}
          >
            Save
          </Button>
        </div>
      </FormSection>

      <FormSection
        title="Invite admin user"
        columns={2}
        description="Create a new Supabase auth user. They can sign in with the email and password below."
      >
        <FormField label="Email">
          <input
            className={inputClass}
            type="email"
            value={newUser.email}
            placeholder="editor@example.com"
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </FormField>
        <FormField label="Password">
          <input
            className={inputClass}
            type="password"
            value={newUser.password}
            placeholder="Minimum 6 characters"
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
        </FormField>
        <FormField label="Display name">
          <input
            className={inputClass}
            value={newUser.displayName}
            placeholder="Jane Doe"
            onChange={(e) =>
              setNewUser({ ...newUser, displayName: e.target.value })
            }
          />
        </FormField>
        <FormField label="Role">
          <select
            className={inputClass}
            value={newUser.role}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                role: e.target.value as "admin" | "editor",
              })
            }
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <div className="sm:col-span-2">
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={busy || !newUser.email.trim() || !newUser.password.trim()}
          >
            Create user
          </Button>
        </div>
      </FormSection>

      <div className={sectionClass}>
        <h3 className="font-heading text-[20px] text-[var(--color-on-surface)]">
          All users
        </h3>

        {users.length === 0 && !loading ? (
          <EmptyState
            title="No users found"
            description="There are no admin accounts to display."
          />
        ) : (
          <div className="mt-4 space-y-3">
            {users.map((user) => {
              const editing = editingId === user.id;
              return (
                <ListCard
                  key={user.id}
                  title={user.displayName || user.email || "Unnamed user"}
                  meta={user.email ?? undefined}
                  pills={
                    <>
                      <span className="inline-flex items-center rounded-full bg-[var(--color-surface-container)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-on-surface-variant)]">
                        {user.role}
                      </span>
                      {isSelf(user.id) ? (
                        <span className="inline-flex items-center rounded-full bg-[var(--color-electric-blue)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-electric-blue)]">
                          You
                        </span>
                      ) : null}
                    </>
                  }
                  actions={
                    editing ? (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUpdate(user.id)}
                          disabled={busy}
                        >
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={cancelEdit} disabled={busy}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" onClick={() => startEdit(user)} disabled={busy}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(user)}
                          disabled={busy || isSelf(user.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )
                  }
                >
                  {editing ? (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <FormField label="Display name">
                        <input
                          className={inputClass}
                          value={editForm.displayName}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              displayName: e.target.value,
                            })
                          }
                        />
                      </FormField>
                      <FormField label="Role">
                        <select
                          className={inputClass}
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              role: e.target.value as "admin" | "editor",
                            })
                          }
                        >
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormField>
                    </div>
                  ) : null}
                </ListCard>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
