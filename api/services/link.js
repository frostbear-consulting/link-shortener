// create
/**
 * Erstellen eines neuen Links
 *
 * @param data.originalLink originaler Link zu dem redirected wird
 * @param data.token        Linkkürzel
 * @param session           Session des momentanen Nutzers
 * @param db                Datenbankverbindung
 * @returns {Promise<Object>} Erstellter Link
 */
exports.create = async function (data, session, db) {
    return db.transaction(async (trx) => {
        const { originalLink, token } = data;

        const exists = await trx('link').where({ originalLink }).orWhere({ token }).first('idLink');

        if (exists) {
            throw new Error('LINK_OR_TOKEN_IN_USE');
        }

        const [created] = await trx('link')
            .insert({
                originalLink,
                token,
                clicks: 0,
                user_id: session.idUser,
            })
            .returning('*');

        return created;
    });
};
// get link liste
/**
 * Abfragen aller Links für einen Benutzer
 *
 * @param session   Session des Nutzers
 * @param db        Datenbankverbindung
 * @returns {Promise<Object[]>}
 */
exports.getAll = async function (session, db) {
    return db('link').where({ user_id: session.idUser }).select('*');
};
// update
exports.update = async function (idLink, data, session, db) {
    return db.transaction(async (trx) => {
        const link = await exports.get(idLink, session, trx);

        if (link == null) {
            throw new Error('LINK_NOT_FOUND');
        }

        const [updatedLink] = await trx('link')
            .update({
                originalLink: data.originalLink,
                token: data.token,
            })
            .where({ idLink, user_id: session.idUser })
            .returning('*');

        return updatedLink;
    });
};

/**
 * Spezifischen Link mit einer ID abfragen
 *
 * @param idLink    ID des Links, der abgefragt werden soll
 * @param session   Session des Benutzers
 * @param db        Datenbankverbindung
 * @returns {Promise<Object>} | null
 */
exports.get = async function (idLink, session, db) {
    const link = await db('link').where({ idLink, user_id: session.idUser }).first();

    return link || null;
};
// delete
exports.delete = async function (idLink, session, db) {
    return db.transaction(async (trx) => {
        const link = await exports.get(idLink, session, trx);

        if (link == null) {
            throw new Error('LINK_NOT_FOUND');
        }

        await trx('link').where({ idLink, user_id: session.idUser }).delete();
    });
};

// update ads -- TODO: implement
