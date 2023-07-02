import PopupWithForm from "./PopupWithForm";

function DeleteCardPopup({ isOpen, onClose, onDeleteCard, card }) {
    function handleSubmit(e) {
        e.preventDefault();
        onDeleteCard(card);
    }
    return (
        <PopupWithForm
            name="card-delete"
            title="Вы&nbsp;уверены?"
            buttonText="Да"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        />
    );
}

export default DeleteCardPopup;
