// security.js
const crypto = require('crypto');

exports.hashPassword = function (password) {
    return crypto.createHash('sha512').update(password).digest('hex');
};

exports.generateSessionToken = function () {
    return crypto.randomBytes(12).toString('hex');
};
