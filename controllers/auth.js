const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req
    //     .get('Cookie')
    //     .split('=')[1] === 'true';
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isLoggedIn: false
    })
};

exports.postLogin = (req, res, next) => {

    User.findById('601800b0eccbc91d4707da2e')
        .then(user => {
            req.session.isLoggedIn = true,
                req.session.user = user
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postLogOut = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/login');
    });
};