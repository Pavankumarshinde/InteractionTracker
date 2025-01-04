const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "Pavan@2000", // Change this to your PostgreSQL password
    host: "localhost",
    database: "InteractionTracker",
    port: 5432,
});

module.exports = pool;