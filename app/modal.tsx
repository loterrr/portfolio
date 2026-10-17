"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function Modal({ children, kind, labelId, onClose }: {
  children: ReactNode;
  kind: "comments" | "details" | "image";
  labelId: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  return <dialog ref={ref} className={`modal modal-${kind}`} aria-labelledby={labelId} onKeyDown={(event) => { if (kind === "image") event.stopPropagation(); }} onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>{children}</dialog>;
}
