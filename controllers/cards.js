const Card = require('../models/card');

const DefaultError = require('../utils/errors/default-err');
const IncorrectDataErr = require('../utils/errors/incorrect-data-err');
const NotFoundError = require('../utils/errors/not-found-err');
const AccessError = require('../utils/errors/access-err');

// получить все карточки
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// удалить карточку
module.exports.deleteCrad = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new AccessError('Вы не можете удалить чужую карточку.');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new IncorrectDataErr('Передан несуществующий _id карточки.'));
          }
          next(err);
        });
      return res.send({ message: 'Карточка была удалена' });
    });
};

// добавить карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new NotFoundError('Переданы некорректные данные при создании карточки.'))
      }
      next(err);
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectDataErr('Передан несуществующий _id карточки.'));
      }
      next(err);
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectDataErr('Передан несуществующий _id карточки.'));
      }
      next(err);
    });
};
