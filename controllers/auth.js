const bscrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
// const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "8918b5bb914e26",
        pass: "a1a531713b87fe"
    }
});

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    })
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: errors.array()
            });
    }
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422)
                    .render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Inavlid email!',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: errors.array()
                    });

            }
            bscrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true,
                            req.session.user = user
                        return req.session.save((err) => {
                            res.redirect('/');
                        });
                    }
                    return res.status(422)
                        .render('auth/login', {
                            path: '/login',
                            pageTitle: 'Login',
                            errorMessage: 'Inavlid password!',
                            oldInput: {
                                email: email,
                                password: password
                            },
                            validationErrors: errors.array()
                        });
                })
                .catch(err => {
                    res.redirect('/login');
                })

        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {
            emial: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []

    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors.array());
        return res.status(422)
            .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                errorMessage: errors.array()[0].msg,
                oldInput: { email: email, password: password, confirmPassword: req.body.confirmPassword },
                validationErrors: errors.array()
            });
    }

    bscrypt
        .hash(password, 12)
        .then(hashPassword => {
            const user = new User({
                email: email,
                password: hashPassword,
                cart: {
                    items: []
                }
            });
            return user.save();
        })
        .then(result => {
            let mailOptions = {
                from: '"digitalPoint" <node-shop@digiPoint.com>',
                to: email,
                subject: 'Nice Nodemailer test',
                text: 'Hey there, it’s our first message sent with Nodemailer ',
                html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer</br>'

            };
            res.redirect('/login');

            return transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postLogOut = (req, res, next) => {
    req.session.destroy((err) => {
        // console.log(err);
        res.redirect('/login');
    });
};

exports.getPassReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/password-reset', {
        path: '/password-reset',
        pageTitle: 'Password Reset',
        errorMessage: message
    })
};

exports.postPassReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/password-reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with email found');
                    return res.redirect('/password-reset');
                }
                user.resetToken = token;
                user.resetTokenExpiry = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                let mailOptions = {
                    from: '"digitalPoint" <node-shop@digiPoint.com>',
                    to: req.body.email,
                    subject: 'Password rest',
                    html: `
                        <p>You requested password reset</p>
                        <p>Click this <a href="http://localhost:3000/password-reset/${token}">link</a> to set a new password</p>
                        `
                };
                res.redirect('/');
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    })
};

exports.getNewPassowrd = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                passwordToken: token,
                userId: user._id.toString()
            })

        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiry: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bscrypt.hash(newPassword, 12);
        })
        .then(hashPassword => {
            resetUser.password = hashPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiry = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}