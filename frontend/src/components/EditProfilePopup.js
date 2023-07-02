import React, {useContext, useEffect, useState} from 'react';
import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from "../context/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            name="edit-profile"
            title="Редактировать профиль"
            buttonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
                id="formName"
                type="text"
                className="popup__form-item popup__form-item_type_name"
                placeholder="Ваше имя"
                name="name"
                required
                minLength="2"
                maxLength="40"
                onChange={(e) => {setName(e.target.value)}}
                value={name || ''}/>
            <span className="popup__form-item-error formName-error"></span>
            <input id="formSpecial"
                   type="text"
                   className="popup__form-item"
                   placeholder="Ваша профессия"
                   name="about"
                   required
                   minLength="2"
                   maxLength="200"
                   onChange={(e) => {setDescription(e.target.value)}}
                   value={description || ''}/>
            <span className="popup__form-item-error formSpecial-error"></span>
        </PopupWithForm>
    );
}

export default EditProfilePopup;
