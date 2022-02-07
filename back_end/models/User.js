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
    },
    emailVerified: {
        type: Boolean,
        required: true,
        unique: false
    },
    emailVerificationToken: {
        type: String,
        required: false
    }
});

module.exports = User = mongoose.model('user', UserSchema);