const path = require('path');
const sequelize = require('./util/database');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const app = express();

//View Engines
app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


app.use(bodyParser.urlencoded({ extended: false }));
//Css code
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
})

//Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404Page);

//Association os DB
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// sequelize.sync({ force: true })
sequelize.sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Neel',
                email: 'test@123.com'
            });
        }
        return user;

    })
    .then(user => {
        return user.getCart()
            .then(cart => {
                if (!cart) {
                    return user.createCart();
                }
            })
            .catch(err => {
                console.log(err);
            })
    })
    .then(cart => {

        // const model = sequelize
        // for (let assoc of Object.keys(model.associations)) {
        //     for (let accessor of Object.keys(model.associations[assoc].accessors)) {
        //         console.log(model.name + '.' + model.associations[assoc].accessors[accessor] + '()');
        //     }
        // }
        //Server
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

