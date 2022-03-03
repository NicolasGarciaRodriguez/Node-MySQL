const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")


const users = require("./api/routes/users.routes")
const reservas = require("./api/routes/reservas.routes")
const carta = require("./api/routes/carta.routes")


//////////////////////////////////////////////////////////////////////////////

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

//////RUTAS//////
app.use('/public', express.static('public'));
app.use('/api', users)
app.use("/api", reservas)
app.use("/api", carta)



////MANEJADOR DE ERRORES////
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});


////CONFIGURACION DEL PUERTO////
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})


