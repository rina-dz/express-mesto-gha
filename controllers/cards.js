const Card = require('../models/card');

const DefaultError = require('../utils/errors/default-err');
const IncorrectDataErr = require('../utils/errors/incorrect-data-err');
const NotFoundError = require('../utils/errors/not-found-err');

// получить все карточки
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new DefaultError('Ошибка по умолчанию.')));
};

// удалить карточку
module.exports.deleteCrad = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner._id !== req.user._id) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new IncorrectDataErr('Передан несуществующий _id карточки.'));
          }
          next(new DefaultError('Ошибка по умолчанию.'));
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
        next(new NotFoundError('Переданы некорректные данные при создании карточки.'))
      }
      next(new DefaultError('Ошибка по умолчанию.'));
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataErr('Передан несуществующий _id карточки.'));
      }
      next(new DefaultError('Ошибка по умолчанию.'));
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataErr('Передан несуществующий _id карточки.'));
      }
      next(new DefaultError('Ошибка по умолчанию.'));
    });
};
