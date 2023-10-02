import { Router } from "express";
import {
    login,
    registro,
    listarUsuarios,
    detalleUsuario,
    actualizarPerfil,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPassword,
	nuevoPassword
} from "../controllers/usuario_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";

const router = Router();

router.post('/login',login)
router.post('/registro', registro)
router.get('/usuarios', listarUsuarios)
router.get('/recuperar-password',recuperarPassword)
router.get('/recuperar-password/:token', comprobarTokenPassword)
router.post('/nuevo-password/:token', nuevoPassword)

router.put('/usuario/actualizarpassword', verificarAutenticacion, actualizarPassword)
router.get('/usuario/:id', verificarAutenticacion, detalleUsuario)
router.put('/usuario/:id', verificarAutenticacion, actualizarPerfil)

export default router;