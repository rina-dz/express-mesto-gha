const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouters = require('./routes/users');
const cardRouters = require('./routes/cards');

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

app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64617e97e76e449f4257ca9a',
  };

  next();
});

app.use('/users', userRouters);

app.use('/cards', cardRouters);
