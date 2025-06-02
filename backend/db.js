const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "marius",
    host: "localhost",
    port: 5432,
    database: "leafee"
});

module.exports = pool;