const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://Neel3004:digiP%40040708@cluster0.jour5.mongodb.net/shop?retryWrites=true&w=majority';
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

//View Engines
app.set('view engine', 'ejs');
app.set('views', 'views');

//Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //CSS 
app.use(session({
    secret: 'my secret code',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// app.use((req, res, next) => {
//     User.findById('601800b0eccbc91d4707da2e')
//         .then(user => {
//             req.session.isLoggedIn = true,
//                 req.session.user = user
//             next();
//         })
//         .catch(err => {
//             console.log(err);
//         })
// });

//Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Nilesh',
                        email: 'test@test.ca',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            })
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });




