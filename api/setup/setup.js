const knex = require('knex');
const fs = require('fs');

const user = process.argv[2];

if (!user) {
    throw new Error(`Please call the script with a user as the first parameter`);
}

const password = process.argv[3];

if (!password) {
    throw new Error(`Please call the script with the password as second parameter`);
}


async function run() {
    const connection = knex({
        client: 'pg',
        connection: `postgres://${user}:${password}@kdb.sh:6082/${user}_shortener`,
        asyncStackTraces: true
    });


    const setupScript = fs.readFileSync('./db.sql', {encoding: 'utf-8'});
    await connection.raw(setupScript);
    console.log('Set up the database!');
    process.exit(0);
}

run();