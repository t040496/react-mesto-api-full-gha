import Popup from "./Popup";

function ImagePopup({ isOpen, onClose, card }) {
    return (
        <Popup
            isOpen={isOpen}
            onClose={onClose}
            type="gallery"
        >
                <button className="popup__close-icon" type="button" onClick={onClose}></button>
                <figure className="popup__wrapper-figure">
                    <img src={card?.link} alt={card?.name} className="popup__image"/>
                    <figcaption className="popup__image-subtitle">{card?.name}</figcaption>
                </figure>
        </Popup>
    );
}

export default ImagePopup;
