const express = require("express")
const { connection } = require("../utils/database/connect")
const router = express.Router()




//GET ALL PLATOS

router.route("/carta").get((req, res, next) => {
    const sqlQuery = "SELECT * FROM carta"
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

//GET SINGLE PLATO BY ID

router.route("/carta/:idPlato").get((req, res, next) => {
    const platoId = req.params.idPlato
    const sqlQuery = `SELECT * FROM carta WHERE idPlato=${platoId}`
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

//GET SINGLE PLATO BY TYPE

router.route("/carta/type/:type").get((req, res, next) => {
    const platoType = req.params.type
    const sqlQuery = `SELECT * FROM carta WHERE type="${platoType}"`
    connection.query(sqlQuery, (error, response) => {
        if (error) {
            return next(error)
        }
        else {
            res.status(200).json(response)
        }
    })
})
















module.exports = router