"use client";

import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type AppDialogOptions = {
  title: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
  showCloseButton?: boolean;
  onCloseAction?: () => void;
};

type Subscriber = (opts: AppDialogOptions | null) => void;

const subscribers = new Set<Subscriber>();

export function openDialog(opts: AppDialogOptions) {
  // notify all subscribers with the payload
  for (const s of subscribers) s(opts);
}

export function closeDialog() {
  // notify subscribers to close (null payload)
  for (const s of subscribers) s(null);
}

export function useDialog() {
  return { openDialog, closeDialog };
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<AppDialogOptions | null>(null);

  useEffect(() => {
    const sub: Subscriber = (opts) => {
      if (opts) {
        setPayload(opts);
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    subscribers.add(sub);
    return () => void subscribers.delete(sub);
  }, []);

  return (
    <>
      {children}
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (payload?.onCloseAction && !isOpen) payload.onCloseAction();
          if (!isOpen) setPayload(null);
        }}
      >
        <DialogContent showCloseButton={payload?.showCloseButton ?? true}>
          {payload ? (
            <>
              <DialogTitle hidden>{payload.title}</DialogTitle>
              <div className="flex flex-col gap-1">
                <h5>{payload.title}</h5>
                {payload.description && (
                  <DialogDescription>{payload.description}</DialogDescription>
                )}
              </div>

              {payload.children}

              {payload.footer && (
                <DialogFooter className="flex flex-row justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  {payload.footer}
                </DialogFooter>
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DialogProvider;
