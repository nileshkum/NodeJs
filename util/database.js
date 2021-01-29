const mongodb = require('mongodb');
const MongoClinet = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClinet.connect('mongodb+srv://Neel3004:digiP@040708@cluster0.jour5.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('connectd');
            _db = client.db();
            callback();
            // callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    } else {
        throw 'No Database found'
    }
}



// module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;