import { useState, useEffect, useCallback } from "react";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import { api } from "../utils/api";
import { CurrentUserContext } from "../context/CurrentUserContext";
import AddPlacePopup from "./AddPlacePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import DeleteCardPopup from "./DeleteCardPopup";
import Register from "./Register";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Login";
import ProtectedRouteElement from "./ProtectedRoute";
import AppLayout from "./AppLayout";
import InfoTooltip from "./InfoTooltip";
import * as authApi from "../utils/authApi";

function App() {
    const [isEditAvatarPopupOpen, setEditAvatarPopupOpeningState] = useState(false);
    const [isEditProfilePopupOpen, setEditProfilePopupOpeningState] = useState(false);
    const [isAddPlacePopupOpen, setAddPlacePopupOpeningState] = useState(false);
    const [isDeleteCardPopupOpen, setDeleteCardPopupOpeningState] = useState(false);
    const [isHamburgerOpen, setHamburgerOpeningState] = useState(false);
    const [isImagePopupOpen, setImagePopupOpeningState] = useState(false);
    const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpeningState] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [cardToDelete, setCardToDelete] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [InfoTooltipStatus, setInfoTooltipStatus] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        loggedIn && Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([userData, cardsData]) => {
                setCurrentUser(userData);
                setCards(cardsData);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [loggedIn]);

    function handleEditAvatarClick() {
        setEditAvatarPopupOpeningState(true);
    }

    function handleEditProfileClick() {
        setEditProfilePopupOpeningState(true);
    }

    function handleAddPlaceClick() {
        setAddPlacePopupOpeningState(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setImagePopupOpeningState(true);
    }

    function handleDeleteClick(card) {
        setCardToDelete(card);
        setDeleteCardPopupOpeningState(true);
    }


    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        const responsePromise = isLiked ? api.deleteCardLike(card._id) : api.setCardLike(card._id);

        responsePromise
            .then((newCard) => {
                setCards((state) => state.map((item) => item._id === card._id ? newCard : item));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(() => {
                setCards((state) => state.filter((item) => item._id !== card._id))
            })
            .then(() => {
                closeAllPopups();
                setSelectedCard(null);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function handleUpdateUser(userData) {
        api.setUserInfo(userData)
            .then((newUserData) => {
                setCurrentUser(newUserData);
            })
            .then(() => {
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleUpdateAvatar(avatarData) {
        api.setUserAvatar(avatarData)
            .then((newAvatarData) => {
                setCurrentUser(newAvatarData);
            })
            .then(() => {
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleAddPlaceSubmit(cardData) {
        api.sendNewCardInfo(cardData)
            .then((newCardsData) => {
                setCards([newCardsData, ...cards]);
            })
            .then(() => {
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const closeAllPopups = useCallback(() => {
        setEditAvatarPopupOpeningState(false);
        setEditProfilePopupOpeningState(false);
        setAddPlacePopupOpeningState(false);
        setDeleteCardPopupOpeningState(false);
        setImagePopupOpeningState(false);
        setInfoTooltipPopupOpeningState(false);
        setInfoTooltipStatus("");
    }, []);

    const handleHamburgerClick = useCallback(() => {
        if (isHamburgerOpen === false) {
            setHamburgerOpeningState(true);
        } else {
            setHamburgerOpeningState(false);
        }
    }, [isHamburgerOpen]);

    const handleUserRegistration = useCallback(
        async (userData) => {
            try {
                const data = await authApi.register(userData);
                if (data) {
                    setInfoTooltipStatus("success");
                    setInfoTooltipPopupOpeningState(true);
                    navigate("/sign-in", { replace: true });
                }
            } catch (err) {
                console.error(err);
            }
        },
        [navigate]
    );

    const handleUserAuthorization = useCallback(
        async (userData) => {
            try {
                const data = await authApi.authorize(userData);
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    setLoggedIn(true);
                    setUserEmail(userData.email);
                    navigate("/", { replace: true });
                }
            } catch (err) {
                console.error(err);
                setInfoTooltipStatus("fail");
                setInfoTooltipPopupOpeningState(true);
            } finally {
            }
        },
        [navigate]
    );

    const tokenCheck = useCallback(async () => {
        if (localStorage.getItem("token")) {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const user = await authApi.getContent(token);
                    if (!user) {
                        throw new Error("Данные пользователя отсутствует");
                    }
                    setUserEmail(user.email);
                    setLoggedIn(true);
                    navigate("/", { replace: true });
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }, [navigate]);

    const handleUserLogOut = useCallback(() => {
        localStorage.removeItem("token");
        setLoggedIn(false);
        setUserEmail("");
        setHamburgerOpeningState(false);
        navigate("/sign-in", { replace: true });
    }, [navigate]);

    useEffect(() => {
        tokenCheck();
    }, [tokenCheck]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page-content">
                <div className="page">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <AppLayout
                                    email={userEmail}
                                    isOpen={isHamburgerOpen}
                                    onHamburgerClick={handleHamburgerClick}
                                    onLogOut={handleUserLogOut}
                                />
                            }
                        >
                            <Route
                                index
                                element={
                                    <ProtectedRouteElement
                                        element={Main}
                                        cards={cards}
                                        onEditAvatar={handleEditAvatarClick}
                                        onEditProfile={handleEditProfileClick}
                                        onAddPlace={handleAddPlaceClick}
                                        onCardClick={handleCardClick}
                                        onCardLike={handleCardLike}
                                        onCardDelete={handleDeleteClick}
                                        loggedIn={loggedIn}
                                    />
                                }
                            />
                            <Route
                                path="/sign-in"
                                element={
                                    <Login
                                        onLogin={handleUserAuthorization}
                                    />
                                }
                            />
                            <Route
                                path="/sign-up"
                                element={
                                    <Register
                                        onRegistr={handleUserRegistration}
                                    />
                                }
                            />
                        </Route>
                    </Routes>
                    <EditAvatarPopup
                        isOpen={isEditAvatarPopupOpen}
                        onClose={closeAllPopups}
                        onUpdateAvatar={handleUpdateAvatar}
                    />
                    <EditProfilePopup
                        isOpen={isEditProfilePopupOpen}
                        onClose={closeAllPopups}
                        onUpdateUser={handleUpdateUser}
                    />
                    <AddPlacePopup
                        isOpen={isAddPlacePopupOpen}
                        onClose={closeAllPopups}
                        onAddPlace={handleAddPlaceSubmit}
                    />
                    <ImagePopup
                        isOpen={isImagePopupOpen}
                        card={selectedCard}
                        onClose={closeAllPopups}
                    />
                    <DeleteCardPopup
                        isOpen={isDeleteCardPopupOpen}
                        onClose={closeAllPopups}
                        onDeleteCard={handleCardDelete}
                        card={cardToDelete} />
                    <InfoTooltip
                        isOpen={isInfoTooltipPopupOpen}
                        onClose={closeAllPopups}
                        status={InfoTooltipStatus}
                    />
                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
