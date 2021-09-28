import mysql from 'mysql';

const pool = mysql.createPool({
    host: process.env?.DB_HOST,
    user: process.env?.DB_USER,
    password: process.env?.DB_PASSWORD,
    database: process.env?.DB_DATABASE_TABLE,
    port: process.env?.DB_Port ? Number(process.env?.DB_Port) : 3306
});

export default pool