// Importacones
const bcrypt = require("bcrypt");
const validate = require("../helpers/validate");
const User = require("../models/user");
const jwt = require("../helpers/jwt");
const fs = require("fs");
const path = require("path");


// Accion de prueba 
const pruebaUser = (req, res) => {

    return res.status(200).send({
        status: "success",
        message: "Mensaje enviad desde: controller/user.js"
    });
}

// Registro
const registerUser = (req, res) => {

    // Recoger los datos de la peticion
    let params = req.body;

    // Comprobar que me llegan bienn 
    if (!params.name || !params.nick || !params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "faltan datos por enviar"
        });
    }

    // Validacion de datos
    try {
        validate(params);
    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Validacion no superada"
        });
    }

    // Control usuario duplicado
    let query = User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() }
        ]
    });

    query.then((users) => {
        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "error",
                message: "El usuario ya existe"
            });
        }

        let pwdPromise = bcrypt.hash(params.password, 10);

        pwdPromise.then((hash) => {
            params.password = hash;

            let userToSave = new User(params);
            let validationErrors = userToSave.validateSync();

            if (validationErrors) {
                let errors = {};
                for (let errorField in validationErrors.errors) {
                    errors[errorField] = validationErrors.errors[errorField].message;
                }


                return res.status(400).send({
                    status: "error",
                    message: "Los datos proporcionados no son válidos",
                    errors: errors
                });
            }

            userToSave.save()
                .then((userStored) => {
                    return res.status(200).send({
                        status: "success",
                        message: "Usuario registrado correctamente",
                        user: userStored
                    });
                })
                .catch((error) => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al registrar usuario"
                    });
                });
        });
    })

        .catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "*** ERROR EN LA CONSULTA DE USUARIO ***"
            });
        });
}

const login = (req, res) => {
    let params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    User.findOne({ email: params.email })
        .select("+password +role")
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el usuario"
                });
            }

            const pwd = bcrypt.compareSync(params.password, user.password);

            if (!pwd) {
                return res.status(400).send({
                    status: "error",
                    message: "Login incorrecto"
                });
            }

            let identityUser = user.toObject();
            delete identityUser.password;
            delete identityUser.role;

            const token = jwt.createToken(user);


            return res.status(200).send({
                status: "success",
                message: "Metodo de login",
                user: identityUser,
                token
            });
        });
}

const profile = (req, res) => {

    let userId = req.params.id;

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: "eroor",
                    message: "El usuario no existe"
                });
            }

            return res.status(200).send({
                status: "success",
                user
            });

        });

}

const update = async (req, res) => {
    try {
        let userIdentity = req.user;
        let userToUpdate = req.body;

        try {
            validate(userToUpdate);

        } catch (error) {
            return res.status(400).send({
                status: "error",
                message: "validacion no superada"
            })
        }

        let users = await User.find({
            $or: [
                { email: userToUpdate.email.toLowerCase() },
                { nick: userToUpdate.nick.toLowerCase() }
            ]
        }).exec();

        let userIsset = false;
        users.forEach(user => {
            if (user && user._id != userIdentity.id) userIsset = true;
        });

        if (userIsset) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;
        } else {
            delete userToUpdate.password;
        }

        let userUpdated = await User.findByIdAndUpdate(
            { _id: userIdentity.id },
            userToUpdate,
            { new: true }
        );

        if (!userUpdated) {
            return res.status(400).send({
                status: "error",
                message: "Error al actualizar"
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Metodo update datos usuario",
            user: userUpdated
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al actualizar"
        });
    }
}

const upload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(404).send({
                status: "error",
                message: "La petición no incluye la imagen"
            });
        }

        let image = req.file.originalname;
        const imageSplit = image.split(".");
        const extension = imageSplit[1];

        if (!["png", "jpg", "jpeg", "gif"].includes(extension)) {
            const filePath = req.file.path;
            fs.unlinkSync(filePath);

            return res.status(400).send({
                status: "error",
                message: "La extensión del archivo no es válida"
            });
        }

        const userUpdated = await User.findOneAndUpdate(
            { _id: req.user.id },
            { image: req.file.filename },
            { new: true }
        );

        if (!userUpdated) {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida"
            });
        }

        return res.status(200).send({
            status: "success",
            user: userUpdated,
            file: req.file
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en la subida"
        });
    }
}

const avatar = (req, res) => {

    const file = req.params.file;

    const filePath = "./uploads/avatars/" + file;

    fs.stat(filePath, (error, exists) => {

        if (error || !exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            });
        }

        return res.sendFile(path.resolve(filePath));
    })
}



// Exportar accones
module.exports = {
    pruebaUser,
    registerUser,
    login,
    profile,
    update,
    upload,
    avatar
}