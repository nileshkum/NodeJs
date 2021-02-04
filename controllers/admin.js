
const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isLoggedIn: req.isLoggedIn
    });
};

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product
        .save()
        .then(result => {
            // console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });

};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isLoggedIn: req.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    // console.log(req.body);
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            return product.save()
        })
        .then(result => {
            console.log('Updated Product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getProducts = (req, res, next) => {

    Product.find()
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            // console.log(products); 
            res.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isLoggedIn: req.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};

// exports.getProducts = (req, res, next) => {

//     // Product.findAll()
//     req.user.getProducts()
//         .then(products => {
//             res.render('admin/products', {
//                 products: products,
//                 pageTitle: 'Admin Products',
//                 path: '/admin/products'
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });

// };

exports.postDeleteProducts = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('Deleted');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })


};