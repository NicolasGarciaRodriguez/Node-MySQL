const mysql = require("mysql");
const dotenv = require("dotenv")



dotenv.config()
const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
});

connection.connect(error => {
    if (error) throw error;
    console.log("Conectado a la base de datos!")
})

module.exports = { connection }