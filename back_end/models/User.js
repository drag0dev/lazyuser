const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    games: {
        type: [String],
        default: []
    },
    token: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = User = mongoose.model('user', UserSchema);