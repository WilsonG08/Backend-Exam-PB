import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: true,
            trim: true,
        },
        codigo_auditorio: {
            type: String,
            required: true,
            trim: true,
        },
        cedula: {
            type: String,
            required: true,
            trim: true,
        },
        descripcion: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        nombre_auditorio:{
            type: String,
            trim: true,
        },
        nombre_conferencista:{
            type: String,
            trim: true,
        },
        conferencistaiD: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Conferencista',
        },
        auditorioiD: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Auditorio',
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Reserva", reservaSchema);
