// 01_session.js
const sessionService = require('../services/session');
const config = require('../config');

const ignorePath = function (verb, path) {
    if (verb === 'POST' && path === '/api/login') {
        return true;
    }

    if (verb === 'POST' && path === '/api/register') {
        return true;
    }

    if (!path.startsWith('/api')) {
        return true;
    }

    return false;
};

module.exports = async function (req, res, next) {
    if (ignorePath(req.method, req.path)) {
        next();
    } else {
        const token = req.cookies[config.cookieName];

        if (!token) {
            return res.status(401).json({ message: 'Please log in to continue.' });
        }

        const session = await sessionService.getSession(token, req.app.get('db'));

        if (!session) {
            return res.status(401).json({ message: 'Your session may have expired. Please log in to continue.' });
        }

        await sessionService.prolongSession(token, req.app.get('db'));

        res.locals.session = session;
        res.locals.token = token;

        next();
    }
};
