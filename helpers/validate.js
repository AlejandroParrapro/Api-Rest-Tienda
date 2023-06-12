const validator = require("validator");

const validate = (params) => {

    let resultado = false;

    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { mn: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES");

    let nick = !validator.isEmpty(params.nick) &&
        validator.isLength(params.nick, { mn: 3, max: 50 });

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email);

    let password = !validator.isEmpty(params.password);

    if(params.surname) {
        let surname = !validator.isEmpty(params.surname) &&
            validator.isLength(params.surname, { mn: 3, max: undefined }) &&
            validator.isAlpha(params.surname, "es-ES");
        
        if(!surname){
            throw new Error("No se ha superado la validacion por apellido incorrecto");
        }else{
            console.log("validacion superada en el apellido");
        } 
    }

    if(!name || !nick || !email || !password){
        throw new Error("No se ha superado la validacion");
    }else{
        console.log("Validacion superada");
        resultado = true;
    }    

    return resultado;
        
}

module.exports = validate;