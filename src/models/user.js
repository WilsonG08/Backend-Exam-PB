import mongoose from "mongoose";
import bycrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        apellido: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);



//Método para cifrar el password del usuario
userSchema.methods.encrypPassword = async function(password){
    const salt = await bycrypt.genSalt(10);
    const passwordEncryp = await bycrypt.hash(password,salt);
    return passwordEncryp;
}

//Método para verificar si el password ingresado es el mismo de la BDD
userSchema.methods.matchPassword = async function(password){
    const reponse = await bycrypt.compare(password, this.password);
    return reponse;
}

//Método para crear un token
userSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2);
    return tokenGenerado;
}

export default mongoose.model("User", userSchema);
