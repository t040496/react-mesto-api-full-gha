import Popup from "./Popup";

function PopupWithForm({ name, title, buttonText, isOpen, onClose, onSubmit, onOverlayClick, ...props }) {
  return (
      <Popup
          isOpen={isOpen}
          onClose={onClose}
          type="form"
      >
        <form className="popup__form"
              action="#"
              name={`${name}`}
              id={`${name}`}
              onSubmit={onSubmit}>
          <h3 className="popup__title">{title}</h3>
          <fieldset className="popup__profile-info">
            {props.children}
          </fieldset>
          <button className="popup__button popup__button_create popup__button_invalid"
                  type="submit"
                  form={`${name}`}>{buttonText}
          </button>
        </form>
      </Popup>
  );
}

export default PopupWithForm;
