const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "test"
});

connection.connect(error => {
    if (error) throw error;
    console.log("Conectado a la base de datos!")
})

module.exports = { connection }