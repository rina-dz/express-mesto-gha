const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouters = require('./routes/users');
const cardRouters = require('./routes/cards');

const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;
const app = express();

const notFoundErr = 404;

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

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', userRouters);
app.use('/cards', cardRouters);

app.use(error);

app.get('*', (req, res) => {
  res.status(notFoundErr).send({ message: 'Запросах по несуществующему маршруту' });
});
