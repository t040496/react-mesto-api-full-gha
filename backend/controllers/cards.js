const cardModel = require('../models/card');

const ForbiddenError = require('../errors/forbiddenError');

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
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  cardModel
    .findById(req.params.cardId)
    .orFail()
    .then((card) => {
      cardModel
        .deleteOne({ _id: card._id, owner: req.user._id })
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
    .orFail()
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
    .orFail()
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
