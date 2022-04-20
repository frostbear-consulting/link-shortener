// Hi, this file is root.js

const userService = require('../services/user');

module.exports = function (app) {
    app.get('/', async function (req, res) {
        await userService.register(
            {
                name: 'rainer',
                firstName: 'Rainer',
                lastName: 'Zufall',
                email: 'r@kdb.gmbh',
                password: 'supersecurepassword',
            },
            req.app.get('db')
        );

        res.json({ a: 1, b: 'some string', c: new Date().toString(), d: true });
    });
};
