"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export type ConfirmOptions = {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  onConfirm: () => void | Promise<void>;
};

export type ConfirmDialogBinding = {
  open: boolean;
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [busy, setBusy] = useState(false);

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    setOpen(true);
  };

  const cancel = () => {
    if (busy) return;
    setOpen(false);
    setOptions(null);
  };

  const onConfirm = async () => {
    if (!options) return;
    setBusy(true);
    try {
      await options.onConfirm();
      setOpen(false);
      setOptions(null);
    } finally {
      setBusy(false);
    }
  };

  const dialogProps: ConfirmDialogBinding = {
    open,
    title: options?.title ?? "",
    message: options?.message,
    confirmLabel: options?.confirmLabel,
    cancelLabel: options?.cancelLabel,
    tone: options?.tone,
    busy,
    onConfirm,
    onCancel: cancel,
  };

  return { confirm, dialogProps };
}