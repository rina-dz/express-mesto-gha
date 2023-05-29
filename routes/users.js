const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getOneUser,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  getUserInfo,
);
router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum(),
    }).unknown(true),
  }),
  getOneUser,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfo,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(/^https?:\/\/(wwq\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]{1,}#?$/i),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;
