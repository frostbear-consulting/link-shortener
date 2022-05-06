const linkService = require('../services/link');

const createLink = async function (req, res) {
    const { body } = req;
    try {
        const result = await linkService.create(body, res.locals.session, req.app.get('db'));

        res.json(result);
    } catch (e) {
        if (e.message === 'LINK_OR_TOKEN_IN_USE') {
            res.status(412).json({ error: 'The provided token or link is already in use' });
        } else {
            console.log(e);
            res.status(500).json({ message: 'An unexpected error occured' });
        }
    }
};

const getLinks = async function (req, res) {
    const links = await linkService.getAll(res.locals.session, req.app.get('db'));

    res.json(links);
};

const getLink = async function (req, res) {
    const { id } = req.params;
    const link = await linkService.get(id, res.locals.session, req.app.get('db'));

    if (link == null) {
        return res.status(404).json({ error: 'The requested link could not be found' });
    }

    res.json(link);
};

const updateLink = async function (req, res) {
    const { body } = req;
    const { id } = req.params;

    try {
        const updated = await linkService.update(id, body, res.locals.session, req.app.get('db'));

        res.json(updated);
    } catch (e) {
        if (e.message === 'LINK_NOT_FOUND') {
            res.status(404).json({ message: 'Could not find the requested link' });
        } else {
            res.status(500).json({ message: 'An unexpected error occured' });
        }
    }
};

const deleteLink = async function (req, res) {
    const { id } = req.params;

    try {
        await linkService.delete(id, res.locals.session, req.app.get('db'));

        res.json({ success: true });
    } catch (e) {
        if (e.message === 'LINK_NOT_FOUND') {
            res.status(404).json({ message: 'Could not find the link to delete' });
        } else {
            res.status(500).json({ message: 'An unexpected error occured' });
        }
    }
};

module.exports = function (app) {
    app.post('/api/links', createLink);
    app.get('/api/links', getLinks);
    app.get('/api/links/:id', getLink);
    app.put('/api/links/:id', updateLink);
    app.delete('/api/links/:id', deleteLink);
};
