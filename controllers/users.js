const User = require('../models/user');

const defaultErr = 500;
const notFoundErr = 404;
const incorrectDataErr = 400;

// получить всех пользователей
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(defaultErr).send({ message: 'Ошибка по умолчанию.' }));
};

// найти пользователя по ID
module.exports.getOneUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь с указанным _id не найден.');
        err.status = notFoundErr;
        throw err;
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.status === 404) {
        return res.status(notFoundErr).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err.name === 'CastError') {
        return res.status(incorrectDataErr).send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(defaultErr).send({ message: 'Ошибка по умолчанию.' });
    });
};

// добавить пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(incorrectDataErr).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(defaultErr).send({ message: 'Ошибка по умолчанию.' });
    });
};

// обновить информацию пользователя
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(incorrectDataErr).send({ message: 'Переданы некорректные данные при изменении информации.' });
      }
      return res.status(defaultErr).send({ message: 'Ошибка по умолчанию.' });
    });
};

// обновить аватар пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(incorrectDataErr).send({ message: 'Переданы некорректные данные при изменении информации.' });
      }
      return res.status(defaultErr).send({ message: 'Ошибка по умолчанию.' });
    });
};
