import React, {useEffect, useRef} from 'react';
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
    const inputRef = useRef();

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateAvatar({
            avatar: inputRef.current.value,
        });
    }

    useEffect(() => {
        inputRef.current.value = "";
    }, [isOpen])

    return (
        <PopupWithForm
            name="avatar-edit"
            title="Обновить аватар"
            buttonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
                type="url"
                id="formLink2"
                className="popup__form-item"
                placeholder="Ссылка на картинку"
                name="avatar"
                required
                ref={inputRef}/>
            <span className="popup__form-item-error formLink2-error"></span>
        </PopupWithForm>
    );
}

export default EditAvatarPopup;
