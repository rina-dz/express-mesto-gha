const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllCards,
  deleteCrad,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required(),
    }),
  }),
  createCard,
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum(),
    }).unknown(true),
  }),
  deleteCrad,
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum(),
    }).unknown(true),
  }),
  likeCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum(),
    }).unknown(true),
  }),
  dislikeCard,
);

module.exports = router;
