// 01_session.js

const ignorePath = function (verb, path) {
    return false;
};

module.exports = async function (req, res, next) {
    if (ignorePath(req.method, req.path)) {
        res.status(401).json({ error: 'You must log in first' });
    } else {
        next();
    }
};
