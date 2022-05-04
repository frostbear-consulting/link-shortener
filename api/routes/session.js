// session.js
const sessionService = require('../services/session');
const userService = require('../services/user');
const config = require('../config');

const login = async function (req, res) {
    const { body } = req;
    const db = req.app.get('db');

    const token = await sessionService.login(body.user, body.password, db);

    res.cookie(config.cookieName, token);

    const session = await sessionService.getSession(token, db);

    res.json(session);
};

const getSession = async function (req, res) {
    res.json(res.locals.session);
};

const logout = async function (req, res) {
    await sessionService.logout(res.locals.token, req.app.get('db'));
    res.clearCookie(config.cookieName);
    res.json({ success: true });
};

const register = async function (req, res) {
    const { body } = req;
    const db = req.app.get('db');

    await userService.register(body, db);

    const token = await sessionService.login(body.name, body.password, db);

    res.cookie(config.cookieName, token);

    const session = await sessionService.getSession(token, db);

    res.json(session);
};

module.exports = function (app) {
    // Login
    app.post('/api/login', login);
    // Query session
    app.get('/api/session', getSession);
    // Logout
    app.delete('/api/session', logout);

    app.post('/api/register', register);
};
