// user.js
const securityService = require('./security');

/**
 * Creates a new user according to the provided data
 *
 * @param {string} data.name  name of the user to register
 * @param {string} data.firstName first name of the user to register
 * @param {string} data.lastName last name of the user to register
 * @param {string} data.email email of the user to register
 * @param {string} data.password password of the user to register
 * @param db {object} database connection
 * @returns {Promise<void>} created user
 */
exports.register = async function (data, db) {
    const { firstName, lastName, email, password, name } = data;

    const hashedPassword = securityService.hashPassword(password);

    await db('user').insert({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        name: name,
    });
};
