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
        return () => dialog?.removeEventListener("cancel", handleCancel)
    }, [isOpen, onClose]);

    return (
        <dialog
            ref={dialogRef}
            className="w-fit backdrop:bg-black/50 m-auto p-10 bg-black/0"
            onClick={(e: React.MouseEvent<HTMLDialogElement>) => {
                if (e.currentTarget === e.target) onClose();
            }}
        >
            <div className="relative">
                <button
                    onClick={onClose}
                    className="absolute top-[-30px] right-[-30px] text-black hover:text-red-500 text-2xl cursor-pointer bg-white w-8 h-8 flex items-center justify-center rounded-full"
                >
                    &times;
                </button>
                {children}
            </div>
        </dialog>
    );
};