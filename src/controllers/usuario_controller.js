import Usuario from "../models/user.js";
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import generarJWT from "../helpers/crearJWT.js";
import mongoose from 'mongoose';

const login = async (req, res) => {
    const { email, password } = req.body;
    //Compara si no ingresa valores vacios
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    const usuarioBDD = await Usuario.findOne({ email }).select('-status -__v -token -updateAt -createdAt');
    if (usuarioBDD?.confirmEmail === false) return res.status(404).json({ msg: "Lo sentimos, debe verificar su cuenta" })
    if (!usuarioBDD) return res.status(404).json({ msg: "lo sentimos, el usuario no se encuentra registrado" })
    const verificarPassword = await usuarioBDD.matchPassword(password);
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password no es el correcto" })
    const token = generarJWT(usuarioBDD._id);
    const { nombre, apellido, _id } = usuarioBDD;
    res.status(200).json({
        token,
        nombre,
        apellido,
        _id,
        email: usuarioBDD.email,
    })
}




const registro = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Usuario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoUsuario = new Usuario(req.body)
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password)
    const token = nuevoUsuario.crearToken()
    await sendMailToUser(email,token)
    await nuevoUsuario.save()
    res.status(200).json({msg:"Cuenta creada con exito"})
}

const listarUsuarios = async (req, res) => {
    const usuario = await Usuario.findOne({ token: req.params.token })
    res.status(200).json(usuario)
  }
  

const detalleUsuario = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` })
    const usuarioBDD = await Usuario.findById(id).select("-password")
    if (!usuarioBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el usuario ${id}` })
    res.status(200).json({ msg: usuarioBDD })
}

const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id valido` })
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo setimos, debes llenar todos los campos" })
    const usuarioBDD = await Usuario.findById(id)
    if (!usuarioBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el usuario ${id}` })
    if (usuarioBDD.email != req.body.email) {
        const usuarioBDDMail = await Usuario.findOne({ email: req.body.email })
        if (usuarioBDDMail) {
            return res.status(404).json({ msg: `Lo sentimos, el existo ya se encuentra registrado` })
        }
    }
    usuarioBDD.nombre = req.body.nombre
    usuarioBDD.apellido = req.body.apellido
    usuarioBDD.apellido = req.body.email
    await usuarioBDD.save()
    res.status(200).json({ msg: "Perfil actualizado correctamente" })
}

const actualizarPassword = async (req, res) => {
    const usuarioBDD = await Usuario.findById(req.usuarioBDD._id);
    if (!usuarioBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el usuario ${id}` })
    const verificarPassword = await usuarioBDD.matchPassword(req.body.passwordactual)
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el pasword actual no es el correcto" })
    usuarioBDD.password = await usuarioBDD.encrypPassword(req.body.passwordnuevo)
    await usuarioBDD.save();
    res.status(200).json({ msg: "Password actualizado correctamente" })
}

const recuperarPassword = async (req, res) => {
    const { email } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los " })
    const usuarioBDD = await Usuario.findOne({ email })
    if (!usuarioBDD) return res.status(404).json({ msg: "Los sentimos, el usuario no se encuentra registrado" })
    const token = usuarioBDD.crearToken();
    usuarioBDD.token = token
    await sendMailToRecoveryPassword(email, password)
    await usuarioBDD.save();
    res.status(200).json({ msg: "Revisa tu correo electronico para reestablecer tu cuenta" })
}

const comprobarTokenPassword = async (req, res) => {
    if (!(req.params.toke)) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
    const usuarioBDD = await Usuario.findOne({ token: req.params.token })
    if (usuarioBDD?.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
    usuarioBDD.token = nullusdd.password = await usuarioBDD.encrypPassword(password);
    await usuarioBDD.save()
    res.status(200).json({ msg: "Felecitaciones, ya puedes iniciar sesión con tu nuevo password" })
}

const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body;
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    if (password != confirmpassword) return res.status(404).json({ msg: "Lo sentimos, los passwords no coinciden" })
    const usuarioBDD = await Usuario.findOne({ token: req.params.token })
    if (password?.token!== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    usuarioBDD.token = null
    usuarioBDD.password = await usuarioBDD.encrypPassword(password);
    await usuarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"})
}

export {
    login,
    registro,
    listarUsuarios,
    detalleUsuario,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword
}

