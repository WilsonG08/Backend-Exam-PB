import {Router} from 'express'
import {
    listarAuditorio,
    detalleAuditorio,
    registrarAuditorio,
    actualizarAuditorio,
    eliminarAuditorio,
} from "../controllers/auditorio_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";

const router = Router()


router.get("/auditorios",verificarAutenticacion,listarAuditorio);
router.get("/auditorio/:id",verificarAutenticacion, detalleAuditorio);
router.post("/auditorio/registro", verificarAutenticacion,registrarAuditorio);
router.put("/auditorio/actualizar/:id", verificarAutenticacion,actualizarAuditorio);
router.delete("/auditorio/eliminar/:id", verificarAutenticacion,eliminarAuditorio);


export default router