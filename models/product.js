const { RSA_PKCS1_OAEP_PADDING } = require('constants');
const fs = require('fs');
const path = require('path');

const Cart = require('./cart');
// const products = [];
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'product.json');

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(fileContent));
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {

        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            // const productIndex = products.findIndex(p => p.id === id);
            // cb(product);
            const product = products.find(prod => prod.id === id);
            const updateProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updateProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);

                }
            });
        });

    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}