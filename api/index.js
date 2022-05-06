const express = require('express');
const config = require('./config');
const knex = require('knex');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser(config.cookieSecret));

const dbConn = knex({
    client: 'pg',
    connection: config.db,
    asyncStackTraces: true,
});

app.set('db', dbConn);

app.use(require('./middlewares/01_session'));

require('./routes/root')(app);
require('./routes/session')(app);
require('./routes/link')(app);

app.listen(config.port, function () {
    console.log('The app is listening on port  ' + config.port);
});
