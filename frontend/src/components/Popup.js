import { useEffect, useCallback } from "react";

function Popup({ isOpen, onClose, type, ...props }) {
    useEffect(() => {
        function handleEscClose(evt) {
            if (evt.key === "Escape") {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("keydown", handleEscClose);
            return () => document.removeEventListener("keydown", handleEscClose);
        }
    }, [onClose, isOpen]);

    const closeByClickOnOverlay = useCallback(
        (evt) => {
            if (evt.target === evt.currentTarget) {
                onClose();
            }
        },
        [onClose]
    );
    return (
        <div
            className={`popup ${isOpen ? "popup_opened" : ""} popup_${type}`}
            onMouseDown={closeByClickOnOverlay}
        >
            <div className={`popup__container popup__container_${type}`}>
                {props.children}
                <button className="popup__close-icon" type="button" onClick={onClose}></button>
            </div>
        </div>
    );
}

export default Popup;
