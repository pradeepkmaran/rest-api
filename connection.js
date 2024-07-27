const mongoose = require('mongoose');

function connectToMongo(url) {
    return mongoose.connect(url);
}

module.exports = {
    connectToMongo
};
