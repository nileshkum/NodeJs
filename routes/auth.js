
const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post(
    '/login',
    [
        check('email', 'Please enter a valid email')
            .isEmail()
            .normalizeEmail(),
        body('password', 'Please enter a password with only numbers and text and at least 5 characters')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject(
                                'Email already exist ,please pick different email!'
                            );
                        }
                    });
            })
            .normalizeEmail(),

        body('password', 'Please enter a password with only numbers and text and at least 5 characters')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password have to match')
                }
                return true;
            })
            .trim()
    ],
    authController.postSignup);

router.post('/logout', authController.postLogOut);

router.get('/password-reset', authController.getPassReset);

router.post('/password-reset', authController.postPassReset);

router.get('/password-reset/:token', authController.getNewPassowrd);

router.post('/new-password', authController.postNewPassword);

module.exports = router;