const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');


const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

//View Engines
app.set('view engine', 'ejs');
app.set('views', 'views');

//Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //CSS 

app.use((req, res, next) => {
    User.findById('6012ad22c3e5dcc6892438ca')
        .then(user => {
            // req.user = user;
            req.user = new User(user.name, user.email, user.cart, user._id)
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

//Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

mongoConnect(() => {
    // console.log();
    app.listen(3000);
});





