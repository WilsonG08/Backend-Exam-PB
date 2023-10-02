import Conferencista from "../models/conferencista.js";
import Reserva from "../models/reservas.js"
import mongoose from "mongoose";
import Auditorio from "../models/auditorio.js";

const listarReserva = async (req, res) => {
  const reserva = await Reserva.find().select("-createdAt -updateAt -__v").populate('user', '_id nombre apellido');
  res.status(200).json(reserva)
}

const detalleReserva= async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ mongoose: `Lo sentimos, no existe el usuario ${id}` })
    const reserva = await Reserva.findById(id).select("-createdAt -updatedAt -__v").populate('user', '__id nombre apellido')
    res.status(200).json(reserva)
}

const registrarReserva = async (req, res) => {
    try {
      // Validar los datos del cuerpo de la petición
      const { codigo, codigo_auditorio,descripcion, password, cedula, } = req.body;
      if (!codigo || !codigo_auditorio || !descripcion || !password || !cedula ) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
      }
  
      // Buscar el conferencista por su cédula
      const conferencista = await Conferencista.findOne({ cedula });
      if (!conferencista) {
        return res.status(404).json({ msg: "No se encontró ningún cliente con esa cédula" });
      }
  
      // Buscar el auditorio por su codigo
      const auditorio = await Auditorio.findOne({ codigo });
      if (!auditorio) {
        return res.status(404).json({ msg: "No se encontró ningún vehículo con esa codigo" });
      }
  
      // Crear la reserva con los ids del cliente y el vehículo
      const nuevaReserva = new Reserva({
        codigo,
        descripcion,
        password,
        codigo,
        cedula,
        nombre_conferencista:conferencista.nombre,
        nombre_auditorio: auditorio.nombre,
        conferencistaiD: conferencista._id,
        auditorioiD: auditorio._id,
        user: req.body.id,
      });
      // Guardar la reserva en la base de datos
      await nuevaReserva.save();
      res.status(200).json({ msg: "Registro exitoso de la reserva" });
    } catch (error) {
      console.log(error);
    }
  };
  
  

  const actualizarReserva = async (req, res) => {
    try {
      // Validar los datos del cuerpo de la petición
      const { id, descripcion, password } = req.body;
      if (!id || !descripcion || !password) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
      }
  
      // Buscar el cliente por su cédula
      const conferencista = await Conferencista.findOne({ cedula });
      if (!conferencista) {
        return res.status(404).json({ msg: "No se encontró ningún conferencista con esa cédula" });
      }
  
      // Buscar el vehículo por su placa
      const auditorio = await Auditorio.findOne({ codigo });
      if (!auditorio) {
        return res.status(404).json({ msg: "No se encontró ningún auditorio con ese codigo" });
      }
  
      // Actualizar la reserva con los nuevos datos
      const reservaActualizada = await Reserva.findByIdAndUpdate(
        id,
        {
          descripcion,
          conferencistaiD: conferencista._id,
          auditorioiD: auditorio._id,
        },
        { new: true }
      );
  
      // Enviar la respuesta con la reserva actualizada
      res.status(200).json({ msg: "Actualización exitosa de la reserva", reserva: reservaActualizada });
    } catch (error) {
      console.log(error);
    }
  };
  
  const eliminarReserva = async (req, res) => {
    try {
      // Obtener el id de la reserva a eliminar
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ msg: "Lo sentimos, debes especificar el id de la reserva" });
      }
  
      // Eliminar la reserva de la base de datos
      const reservaEliminada = await Reserva.findByIdAndDelete(id);
  
      // Enviar la respuesta con la reserva eliminada
      res.status(200).json({ msg: "Eliminación exitosa de la reserva", reserva: reservaEliminada });
    } catch (error) {
      console.log(error);
    }
  };
  
export{
    listarReserva,
    detalleReserva,
    registrarReserva,
    actualizarReserva,
    eliminarReserva,
}