const cardModel = require('../models/card');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const IncorrectDataError = require('../errors/incorrectDataError');
const getCards = (req, res, next) => {
  cardModel
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  cardModel
    .create({ owner: req.user._id, ...req.body })
    .then((card) => card.populate('owner'))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next (new IncorrectDataError('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    }
    );
};

const deleteCardById = (req, res, next) => {
  cardModel
    Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточки с указанным id не существует'))
    .then((card) => {
      cardModel
        Card.deleteOne({ _id: card._id, owner: req.user._id })
        .then((result) => {
          if (result.deletedCount === 0) {
            throw new ForbiddenError(
              `Карточка с id ${req.params.cardId} не принадлежит пользователю с id ${req.user._id}`,
            );
          } else {
            res.send({ message: 'Карточка удалёна' });
          }
        })
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => card.populate(['owner', 'likes']))
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => new NotFoundError('Карточки с указанным id не существует')) ;
    .then((card) => card.populate(['owner', 'likes']))
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
