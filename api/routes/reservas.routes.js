const express = require("express")
const { connection } = require("../utils/database/connect")
const router = express.Router()


//GET ALL RESERVAS

router.route("/reservas").get((req, res, next) => {
    const sqlQuery = "SELECT * FROM reservas"
    connection.query(sqlQuery, (err, response) => {
        if (err) {
            return next(err)
        }
        else {
            res.status(200).json(response)
        }
    })
})

//////////////////////////////////////////////////////////////////////////

//GET SINGLE RESERVA BY ID

router.route("/reservas/:idReserva").get((req, res, next) => {
    const reservaId = req.params.idReserva
    const sqlQuery = `SELECT * FROM reservas WHERE idReserva=${reservaId}`
    connection.query(sqlQuery, (error, response) => {
        if (error) {
            return next(error)
        }
        else {
            res.status(200).json(response)
        }
    })
})

//////////////////////////////////////////////////////////////////////////

//GET RESERVAS BY USERID

router.route("/reservas/user/:idUser").get((req, res, next) => {
    const userId = req.params.idUser
    const sqlQuery = `SELECT * FROM reservas WHERE codUser=${userId}`
    connection.query(sqlQuery, (error, response) => {
        if (error) {
            return next(error)
        }
        else {
            res.status(200).json(response)
        }
    })
})

//////////////////////////////////////////////////////////////////////////

//REGISTER RESERVA

router.post("/reservas/:idUser", (req, res, next) => {
    const inputData = {
        codUser: req.params.idUser,
        date: req.body.date,
        numero: req.body.numero,
        hour: req.body.hour
    }
    connection.query("INSERT INTO reservas SET ?", inputData, (error, result) => {
        if (error) {
            res.status(500).send({msg: "Ha ocurrido un error al registrar la reserva"})
            return next(error)
        } else {
            res.status(200).send({msg: "Reserva registrada correctamente"})
        }
    })
})

//////////////////////////////////////////////////////////////////////////

//DELETE RESERVA

router.delete("/reservas/:idReserva/delete", (req, res, next) => {
    const reservaId = req.params.idReserva
    connection.query(`DELETE FROM reservas WHERE idReserva=${reservaId}`, (error, result) => {
        if (error) {
            res.status(500).send({msg: "Ha ocurrido un error no se puede eliminar la reserva"})
        } else {
            res.status(200).send({msg: "Reserva eliminada correctamente"})
        }
    })
})

module.exports = router