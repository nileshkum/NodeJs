
const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth')

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogOut);

router.get('/password-reset', authController.getPassReset);

router.post('/password-reset', authController.postPassReset);

router.get('/password-reset/:token', authController.getNewPassowrd);

router.post('/new-password', authController.postNewPassword);

module.exports = router;