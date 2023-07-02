import React, {useEffect, useState} from 'react';
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({isOpen, onClose, onAddPlace}) {
    const [cardName, setCardName] = useState('');
    const [imageLink, setImageLink] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({
            name: cardName,
            link: imageLink,
        });
    }

    useEffect(() => {
        setCardName('');
        setImageLink('');
    }, [isOpen])

    return (
        <PopupWithForm
            name="add-card"
            title="Новое место"
            buttonText="Создать"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input id="formTitle"
                   type="text"
                   className="popup__form-item popup__form-item_type_name"
                   placeholder="Название"
                   name="name"
                   minLength="2"
                   maxLength="30"
                   required
                   onChange={(e) => setCardName(e.target.value)}
                   value={cardName || ''}/>
            <span className="popup__form-item-error formTitle-error"></span>
            <input type="url"
                   id="formLink"
                   className="popup__form-item"
                   placeholder="Ссылка на картинку"
                   name="link"
                   required
                   onChange={(e) => setImageLink(e.target.value)}
                   value={imageLink || ''}/>
            <span className="popup__form-item-error formLink-error"></span>
        </PopupWithForm>
    );
}

export default AddPlacePopup;
