const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const DefaultError = require('../utils/errors/default-err');
const IncorrectDataErr = require('../utils/errors/incorrect-data-err');
const NotFoundError = require('../utils/errors/not-found-err');

// получить всех пользователей
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next(new DefaultError('Ошибка по умолчанию.')));
};

// найти пользователя по ID
module.exports.getOneUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.status === 404) {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      if (err.name === 'CastError') {
        next(new IncorrectDataErr('Переданы некорректные данные.'));
      }
      next(new DefaultError('Ошибка по умолчанию.'));
    });
};

// добавить пользователя
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataErr('Переданы некорректные данные при создании пользователя.'));
      }
      next(new DefaultError('Ошибка по умолчанию.'));
    });
};

// обновить информацию пользователя
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataErr('Переданы некорректные данные при изменении информации.'));
      }
      next(new DefaultError('Ошибка по умолчанию.'));
    });
};

// обновить аватар пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataErr('Переданы некорректные данные при изменении информации.'));
      }
      next(new DefaultError('Ошибка по умолчанию.'));
    });
};

// контроллер login
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched, user) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      next(new DefaultError('Ошибка по умолчанию.'));
    });
};
