const express = require("express")
const { connection } = require("../utils/database/connect")
const router = express.Router()
const { check, validationResult, Result } = require("express-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")




//GET ALL USERS

router.route("/users").get((req, res, next) => {
    const sqlQuery = "SELECT * FROM users"
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
    connection.query(`SELECT * FROM users WHERE phone=${userTelefono}`, (error, response) => {
        if (error) {
            res.status(404).send({error: "Usuario no encontrado"})
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
        if (response.length === 0) {
            res.status(404).send("User not found")
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
    check("name", "Nombre inv??lido")
        .not()
        .isEmpty()
        .isLength({ min: 3, max: 30 }),
    check("surname", "Apellido inv??lido")
        .not()
        .isEmpty()
        .isLength({ min: 3, max: 60 }),
    check("email", "Email inv??lido")
        .not()
        .isEmpty()
        .isEmail(),
    check("password", "Contrase??a inv??lida")
        .not()
        .isEmpty()
        .isLength({ min: 4 }),
    check("phone", "Telefono nv??lido")
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
                surname: req.body.surname,
                email: req.body.email,
                password: hash,
                phone: req.body.phone
            }
            connection.query(`SELECT idUsers FROM users WHERE email="${user.email}" or phone=${user.phone}`, (error, result) => {
                if (result.length === 0) {
                    const sqlQuery = "INSERT INTO users SET ?"
                    connection.query(sqlQuery, user, (err, response) => {
                        if (err) {
                            return next(err)
                        } else {
                            res.status(200).send("Usuario creado correctamente")
                        }
                    })
                } else {
                    res.send("Ya existe un usuario con esas credenciales")
                    return next(error)
                }
            })
        })
    }
})

//////////////////////////////////////////////////////////////////////////

//LOGIN USER

router.post("/login", (req, res, next) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    }
    connection.query(`SELECT * from users WHERE email="${user.email}"`, async (error, result) => {
        if (result.length === 0 || !(await bcrypt.compare(user.password, result[0].password))) {
            res.send("Email o contrase??a incorrectos")
        }
        else {
            try {
                const jwtToken = jwt.sign({
                    email: result[0].email,
                    userId: result[0].idUsers
                }, "longer-secret-is-better", {
                    expiresIn: "1h"
                });
                res.cookie("session cookie", result[0].email, {expire: new Date() + 9999})
                res.status(200).send({
                    user: result[0].email,
                    msg: 'Logged in!',
                    token: jwtToken,
                    expiresIn: 3600
                });
            } catch (err) {
                res.send({
                    error: "Error inesperado"
                });
                return next(error)
            }
        }  
    })
})

//////////////////////////////////////////////////////////////////////////


//LOGOUT

router.post("/logout", (req, res, next) => {
    try {
        res.clearCookie("session cookie").send("sesion cerrada")
    } catch {
        res.status(500).send("Ha ocurrido un error")
    }
})


//////////////////////////////////////////////////////////////////////////////

//UPDATE USER

router.put("/user/:idUser/update", (req, res, next) => {
    const userId = req.params.idUser
    const inputData = req.body
    connection.query(`SELECT * FROM users WHERE email="${inputData.email}" or phone="${inputData.phone}"`, (error, result) => {
        if (result.length === 0) {
            connection.query(`UPDATE users SET ? WHERE idUsers=${userId}`, inputData, (error, result) => {
                if (error) {
                    next(error)
                } else {
                    res.status(200).send({
                        msg: "Usuario actualizado correctamente",
                    })        
                }
            })
        } else {
            res.status(500).send({msg: "Ya existe un usuario con esas credenciales"})
        }
    })
})

//////////////////////////////////////////////////////////////////////////


//DELETE USER

router.delete("/user/:idUser/delete", (req, res, next) => {
    const userId = req.params.idUser
    connection.query(`DELETE FROM users WHERE idUsers=${userId}`, (error, result) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).send("Usuario eliminado correctamente")
        }
    })
})



module.exports = router