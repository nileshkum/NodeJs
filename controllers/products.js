
const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-products',
        activeAddProduct: true,
        formCss: true,
        productCss: true
    });
}

exports.postNewProducts = (req, res, next) => {
    // products.push({ title: req.body.title });
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    // console.log('shop.js', adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    // const products = adminData.products;
    // const products = Product.fetchAll();
    Product.fetchAll(products => {
        res.render('shop', {
            products: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCss: true
        });
    });

}