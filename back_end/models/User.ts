export {} // funny typescript things
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

const User = mongoose.model('user', UserSchema);

module.exports = User;