const Card = require('../models/card');

const defaultErr = 500;
const notFoundErr = 404;
const incorrectDataErr = 400;

// получить все карточки
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(incorrectDataErr).send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(defaultErr).send({ message: 'Ошибка по умолчанию.' });
    });
};

// удалить карточку по ID
module.exports.deleteCrad = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.send({ message: 'Карточка была удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(incorrectDataErr).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(defaultErr).send({ message: 'Ошибка по умолчанию.' });
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
        return res.status(notFoundErr).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(defaultErr).send({ message: 'Ошибка по умолчанию.' });
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
        return res.status(incorrectDataErr).send('Передан несуществующий _id карточки.');
      }
      return res.status(defaultErr).send({ message: 'Ошибка по умолчанию.' });
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
        return res.status(incorrectDataErr).send('Передан несуществующий _id карточки.');
      }
      return res.status(defaultErr).send({ message: 'Ошибка по умолчанию.' });
    });
};
