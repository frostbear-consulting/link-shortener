const securityService = require('../services/security');
const config = require('../config');

// https://insomnia.rest
// login
exports.login = async function (userName, password, db) {
    return db.transaction(async (trx) => {
        const user = await trx('user')
            .where({
                name: userName,
            })
            .first(['idUser', 'password']);

        if (!user) {
            throw new Error('User could not be found');
        }

        const hashedPassword = securityService.hashPassword(password);

        if (user.password !== hashedPassword) {
            throw new Error('The user could not be found');
        }

        const token = securityService.generateSessionToken();

        await trx('session').insert({
            token,
            user_id: user.idUser,
            expiresAt: Date.now() + config.expirationTime,
        });

        return token;
    });
};
// logout
exports.logout = async function (token, db) {
    return db.transaction(async (trx) => {
        const session = await exports.getSession(token, trx);

        if (session !== null) {
            await trx('session').where({ token }).delete();
        }
    });
};

// prolong session
exports.prolongSession = async function (token, db) {
    return db.transaction(async (trx) => {
        const session = await exports.getSession(token, trx);

        if (session !== null) {
            await trx('session')
                .update({
                    expiresAt: Date.now() + config.expirationTime,
                })
                .where({ token });
        }
    });
};

// session abfragen
exports.getSession = async function (token, db) {
    return db.transaction(async (trx) => {
        const session = await trx('session')
            .innerJoin('user', 'user.idUser', '=', 'session.user_id')
            .where({ token })
            .first(['name', 'firstName', 'lastName', 'email', 'expiresAt']);

        if (!session) {
            return null;
        }

        const currentTimestamp = Date.now();

        if (currentTimestamp > session.expiresAt) {
            await trx('session').where({ token }).delete();
            return null;
        }

        return session;
    });
};
