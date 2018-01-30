const express = require('express');
const router = express.Router();
// const config = require('../config/index');

const usersRoutes = require('./users');
const filmsRoutes = require('./films');

// router.use('/user', usersRoutes);
router.use('/users', usersRoutes);
router.use('/films', filmsRoutes);
router.use('/', function (req, res) {
  res.json({ message: 'API index', auth_user: req.auth_user });
});

module.exports = router;
