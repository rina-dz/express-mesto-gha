const router = require('express').Router();
const {
  getAllUsers,
  getOneUser,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:id', getOneUser);
router.get('/me', getUserInfo);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
