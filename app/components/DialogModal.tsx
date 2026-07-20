import { ReactNode, useEffect, useRef } from "react";
import "./DialogModal.css";

// prop types 
type DialogModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function DialogModal ({isOpen, onClose, children}: DialogModalProps){
    
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current as HTMLDialogElement | null;
        if (isOpen) {
            document.documentElement.dataset.modalOpen = "true";
        } else {
            delete document.documentElement.dataset.modalOpen;
        }
        if(isOpen) {
            if(!dialog?.open) dialog?.showModal();
        } else {
            if(dialog?.open) dialog?.close();
        }

        const handleCancel = (e: Event) => {
            e.preventDefault();
            onClose();
        }
        // Add event listener for the 'cancel' event (e.g., pressing Escape)
        dialog?.addEventListener("cancel", handleCancel);
        // Clean up the event listener when the component unmounts or isOpen changes
        return () => {
            dialog?.removeEventListener("cancel", handleCancel);
            delete document.documentElement.dataset.modalOpen;
        };
    }, [isOpen, onClose]);

    return (
        <dialog
            ref={dialogRef}
            className="dialog-modal"
            onClick={(e: React.MouseEvent<HTMLDialogElement>) => {
                if (e.currentTarget === e.target) onClose();
            }}
        >
            <div className="relative">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-2 border-[var(--color-on-surface)] bg-[var(--color-on-surface)] text-2xl leading-none text-white shadow-[3px_3px_0_var(--color-surface-border)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-surface-border)] active:translate-y-0 active:shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--color-on-surface)]/30"
                    aria-label="Close preview"
                >
                    &times;
                </button>
                {children}
            </div>
        </dialog>
    );
};
