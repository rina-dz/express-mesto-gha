const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const userRouters = require('./routes/users');
const cardRouters = require('./routes/cards');

const {
  createUser,
  login,
} = require('./controllers/users');

const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const NotFoundError = require('./utils/errors/not-found-err');

const { PORT = 3000 } = process.env;
const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('MongoDB работает');
  })
  .catch((err) => {
    console.log(`Что-то идёт не так: ${err}`);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/^https?:\/\/(wwq\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]{1,}#?$/i),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/users', userRouters);
app.use('/cards', cardRouters);

app.get('*', (req, res) => {
  next(new NotFoundError('Запрос по несуществующему маршруту'));
});

app.use(errors());

app.use(error);
