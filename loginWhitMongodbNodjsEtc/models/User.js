const mongodb = require('mongoose'); // require mongoose

// mongoose Schema
const UserSchema = mongodb.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongodb.model('User', UserSchema); // mongoose model 

module.exports = User; // exports