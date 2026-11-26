import { useEffect, useEffectEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ title, onClose, children }: ModalProps) {
  const closeOnEscape = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => closeOnEscape(e);
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h3>{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </header>
        {children}
      </div>
    </div>,
    document.body,
  );
}
