const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'digiP@040708', {
    dialect: 'mysql', host: 'localhost'

});

module.exports = sequelize;