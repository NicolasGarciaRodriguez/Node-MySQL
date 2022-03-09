const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieParser = require("cookie-parser")


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


app.use(cookieParser())


//////RUTAS//////
app.use('/public', express.static('public'));
app.use('/api', users)
app.use("/api", reservas)
app.use("/api", carta)


app.get("/test", (req, res) => {
    req.session.user = "pepe";
    req.session.surname = "Perez"
    res.send("test realizado")
})



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


