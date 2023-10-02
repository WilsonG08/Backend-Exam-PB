import Auditorio from "../models/auditorio.js"
import mongoose from "mongoose";

const listarAuditorio = async (req, res) => {
    const auditorio = await Auditorio.find().select("-createdAt -updateAt -__v").populate('user', '_id nombre apellido');
    res.status(200).json(auditorio)
  }
  
const detalleAuditorio = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ mongoose: `Lo sentimos, no existe el usuario ${id}` })
    const auditorio = await Auditorio.findById(id).select("-createdAt -updatedAt -__v").populate('user', '__id marca modelo')
    res.status(200).json(auditorio)
}

const registrarAuditorio = async (req, res) => {
    try {
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los cambos" })
        const { codigo, nombre, ubicacion, capacidad, descripcion} = req.body;
        const nuevoAuditorio = new Auditorio({ codigo, nombre, ubicacion, capacidad, descripcion })
        nuevoAuditorio.user = req.body.id
        await nuevoAuditorio.save()
        res.status(200).json({ msg: "Registro existoso del Auditorio" })
    } catch (error) {
        console.log(error)
    }
}

const actualizarAuditorio = async (req, res) => {
    try {
        const { id } = req.params
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, no existe el usuario ${id}` });
        await Auditorio.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({ msg: "Actualizacion existosa del Auditorio" })
    } catch (error) {
        console.log(error)
    }
}

const eliminarAuditorio = async (req, res) => {
    try {
        const { id } = req.params
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404)({ msg: `Lo sentimos, no existe el usuario ${id}` })
    } catch (error) {
        console.log(error)
    }
}
export{
    listarAuditorio,
    detalleAuditorio,
    registrarAuditorio,
    actualizarAuditorio,
    eliminarAuditorio,
}