"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

function Modal({ open, onClose, title, description, children, size = "md" }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={[
        "w-full rounded-[--radius-2xl] border border-[--color-border]",
        "bg-[--color-card] p-0 shadow-[--shadow-lg]",
        "backdrop:bg-black/70 backdrop:backdrop-blur-sm",
        "open:flex open:flex-col",
        sizeClasses[size],
      ].join(" ")}
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      {(title || description) && (
        <div className="flex items-start justify-between p-6 border-b border-[--color-border]">
          <div>
            {title && (
              <h2
                id="modal-title"
                className="font-[--font-display] text-lg font-semibold text-[--color-text]"
              >
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="mt-1 text-sm text-[--color-text-muted]">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-[--radius-md] p-1.5 text-[--color-text-muted] hover:bg-[--color-surface] hover:text-[--color-text] transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="p-6">{children}</div>
    </dialog>
  );
}

export { Modal };
