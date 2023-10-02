import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

//Creacion del transporte
const transport = nodemailer.createTransport({
    host: process.env.HOST_GMAIL,
    port: process.env.PORT_GMAIL,
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL
    }
})

//sen mail with defined transport object
const sendMailToUser = async(userMail, token)=>{
    let info = await transport.sendMail({
        from: 'restacar@fastycars.com',
        to: userMail,
        subject: "Verifica tu cuenta de correo electronico",
        html: `
        <h1>Sistema de gestion de matriculas </h1>
        <hr>
        <a href="http://localhost:3000/api/confirmar/${token}">Clic para confirmar tu cuenta</a>
        <hr>
        <footer>FastyCars te da la Bienvenida!</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente", info.messageId);
}

const sendMailToRecoveryPassword = async(userMail, token)=>{
    let info = await transport.sendMail({
        from: 'restacar@fastycars.com',
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <h1>Sistema de gestion de matriculas </h1>
        <hr>
        <a href="http://localhost:3000/api/recuperar-password/${token}">Clic para confirmar tu cuenta</a>
        <hr>
        <footer>FastyCars te da la Bienvenida!</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente", info.messageId);
}

export{
    sendMailToUser,
    sendMailToRecoveryPassword
}

