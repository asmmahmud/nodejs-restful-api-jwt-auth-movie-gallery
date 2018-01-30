const express = require('express');
const validate = require('express-validation');
const router = express.Router();
const validation = require('../config/param-validation');
const { checkToken, extractAuthUser, accessControl } = require('../helpers/auth.user');
const userController = require('../controllers/users.controller');
/* users routes listing. */
router.get('/test', function (req, res) {
  res.json({ message: 'test route' });
});
router.post('/authenticate', validate(validation.login), userController.authenticate);
router.post('/register', validate(validation.createUser), userController.register);
router.put(
  '/:_id',
  checkToken,
  extractAuthUser,
  validate(validation.updateUser),
  userController.update
);
router.delete(
  '/:_id',
  checkToken,
  extractAuthUser,
  accessControl,
  validate(validation._delete),
  userController._delete
);
router.get('/', checkToken, extractAuthUser, accessControl, userController.getAll);

module.exports = router;
