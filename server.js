const { connection } = require("./api/utils/database/connect.js");
const express = require("express")
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 8080


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})


app.get("/carta", (req, res) => {
    const sqlQuery = "SELECT * FROM carta"
    connection.query(sqlQuery, (result, error) => {
        if (result) {
            res.json(result)
        } else {
            res.send("No results")
        }
        if (error) throw error;
    })
})