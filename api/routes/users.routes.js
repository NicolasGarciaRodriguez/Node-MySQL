const express = require("express")
const { connection } = require("../utils/database/connect")
const router = express.Router()
const { check, validationResult, Result } = require("express-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



//GET ALL USERS

router.route("/users").get((req, res, next) => {
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

//GET SINGLE USER BY ID

router.route("/users/:idUser").get((req, res, next) => {
    const userId = req.params.idUser
    const sqlQuery = `SELECT * FROM users WHERE idUsers=${userId}`
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

//GET SINGLE USER BY TELEFONO

router.route("/users/telefono/:telefonoUser").get((req, res, next) => {
    const userTelefono = req.params.telefonoUser
    connection.query(`SELECT * FROM users WHERE telefono=${userTelefono}`, (error, response) => {
        if (error) {
            return next(error)
        }
        else {
            res.status(200).json(response)
        }
    })
})

//////////////////////////////////////////////////////////////////////////


//GET SINGLE USER BY EMAIL

router.route("/users/email/:emailUser").get((req, res, next) => {
    const userEmail = req.params.emailUser
    connection.query(`SELECT * FROM users WHERE email="${userEmail}"`, (error, response) => {
        if (error) {
            return next(error)
        }
        else {
            res.status(200).json(response)
        }
    })
})

//////////////////////////////////////////////////////////////////////////


//REGISTER USER
router.post("/register", 
[
    check("name", "Nombre inválido")
        .not()
        .isEmpty()
        .isLength({ min: 3, max: 25 }),
    check("password", "Contraseña inválida")
        .not()
        .isEmpty()
        .isLength({ min: 4 }),
    check("email", "Email inválido")
        .not()
        .isEmpty()
        .isEmail(),
    check("telefono", "Telefono nválido")
        .not()
        .isEmpty()
        .isMobilePhone()

],
(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    else {
        bcrypt.hash(req.body.password, 10).then((hash) => {
            const user = {
                name: req.body.name,
                email: req.body.email,
                password: hash,
                telefono: req.body.telefono
            }
            connection.query(`SELECT idUsers FROM users WHERE email="${user.email}" or telefono=${user.telefono}`, (error, result) => {
                if (result.length === 0) {
                    console.log(result)
                    const sqlQuery = "INSERT INTO users SET ?"
                    connection.query(sqlQuery, user, (err, response) => {
                        if (err) {
                            return next(err)
                        } else {
                            res.status(200).send("User created")
                        }
                    })
                } else {
                    res.send("User already exist")
                    return next(error)
                }
            })
        })
    }
})

//////////////////////////////////////////////////////////////////////////


module.exports = router