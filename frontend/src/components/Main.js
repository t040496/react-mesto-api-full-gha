import { useContext } from "react";
import Card from "./Card";
import { CurrentUserContext } from "../context/CurrentUserContext";

function Main({ cards, onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardLike, onCardDelete }) {
    const currentUser = useContext(CurrentUserContext);

  return (
      <main className="page-content">
          <section className="profile">
              <div className="profile__items">
                  <button className="profile__edit-photo"
                          onClick={onEditAvatar}>
                      <img src={currentUser.avatar}
                           alt="Аватар пользователя"
                           className="profile__image"/>
                  </button>
                  <div className="profile__info">
                      <div className="profile__item">
                          <h1 className="profile__title">{currentUser.name}</h1>
                          <button
                              className="button profile__button-edit"
                              type="button"
                              onClick={onEditProfile}></button>
                      </div>
                      <p className="profile__subtitle">{currentUser.about}</p>
                  </div>
              </div>
              <button
                  className="button profile__button-add"
                  type="button"
                  onClick={onAddPlace}></button>
          </section>
          <section className="elements">
            {cards.map((card, i) => (
               <Card
                   card={card}
                   key={card._id}
                   onCardClick={onCardClick}
                   onCardLike={onCardLike}
                   onCardDelete={onCardDelete} />
            ))}
          </section>
      </main>
  );
}

export default Main;
