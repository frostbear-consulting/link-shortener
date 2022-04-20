const express = require('express');
const config = require('./config');
const knex = require('knex');

const app = express();

const dbConn = knex({
    client: 'pg',
    connection: config.db,
    asyncStackTraces: true,
});

app.set('db', dbConn);

app.use(require('./middlewares/01_session'));

require('./routes/root')(app);

app.listen(config.port, function () {
    console.log('The app is listening on port  ' + config.port);
});
