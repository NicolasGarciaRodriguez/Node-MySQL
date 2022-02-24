const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")


const users = require("./api/routes/users.routes")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());


app.use('/public', express.static('public'));
app.use('/api', users)



// Manejamos los errores
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})


