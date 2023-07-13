import { useContext } from "react";
import { CurrentUserContext } from "../context/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
    const currentUser = useContext(CurrentUserContext);
    const isCardCreatedByMe = card.owner === currentUser._id;
    const isCardLikedByMe = card.likes.some((id) => id === currentUser._id);

    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card);
    }

    function handleDeleteClick() {
        onCardDelete(card)
    }

    return (
        <article className="elements__item">
            {
                isCardCreatedByMe
                &&
                <button className="elements__button" onClick={handleDeleteClick}></button>
            }
            <img
                src={card.link}
                alt={card.name}
                onClick={handleClick}
                className="elements__image" />
            <div className="elements__info">
                <h2 className="elements__title">{card.name}</h2>
                <div className="elements__like-container">
                    <button
                        onClick={handleLikeClick}
                        className={`elements__like ${isCardLikedByMe ? ' elements__like_active' : ''}`}
                        type="button"></button>
                    <div className="elements__like-counter">{card.likes.length}</div>
                </div>
            </div>
        </article>
    );
}

export default Card;
