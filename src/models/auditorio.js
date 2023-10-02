import mongoose from "mongoose";

const auditorioSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: true,
            trim: true,
        },
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        ubicacion: {
            type: String,
            required: true,
            trim: true,
        },
        capacidad: {
            type: String,
            required: true,
            unique: true,
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Auditorio", auditorioSchema);
