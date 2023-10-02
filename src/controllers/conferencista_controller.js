import Conferencista from "../models/conferencista.js"
import mongoose from "mongoose";

const listarConferencista = async (req, res) => {
    const conferencista = await Conferencista.find().select("-createdAt -updateAt -__v").populate('user', '_id nombre apellido');
    res.status(200).json(conferencista)
  }
  
const detalleConferencista = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ mongoose: `Lo sentimos, no existe el User ${id}` })
    const conferencista = await Conferencista.findById(id).select("-createdAt -updatedAt -__v").populate('user', '__id nombre apellido')
    res.status(200).json(conferencista)
}

const registrarConferencista = async (req, res) => {
    try {
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los cambos" })
        const { nombre, apellido, cedula, genero, ciudad, direccion, fecha_nacimiento, telefono, email, empresa} = req.body;
        const nuevoConferencista = new Conferencista({ nombre, apellido, cedula, genero, ciudad, direccion, fecha_nacimiento, telefono, email, empresa })
        nuevoConferencista.user = req.body.id
        await nuevoConferencista.save()
        res.status(200).json({ msg: "Registro existoso del Conferencista" })
    } catch (error) {
        console.log(error)
    }
}

const actualizarConferencista = async (req, res) => {
    try {
        const { id } = req.params
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, no existe el User ${id}` });
        await Conferencista.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({ msg: "Actualizacion existosa del Conferencista" })
    } catch (error) {
        console.log(error)
    }
}

const eliminarConferencista = async (req, res) => {
    try {
        const { id } = req.params
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404)({ msg: `Lo sentimos, no existe el User ${id}` })
    } catch (error) {
        console.log(error)
    }
}
export{
    listarConferencista,
    detalleConferencista,
    registrarConferencista,
    actualizarConferencista,
    eliminarConferencista,
}