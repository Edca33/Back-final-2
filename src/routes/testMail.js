import express from 'express';
import sendMail from '../config/mailServer.js';  

const router = express.Router();


router.post('/:cid/purchase', async (req, res) => {
    try {
        await sendMail('doom660324@gmail.com', 'Correo de prueba', 'Este es un correo de prueba', '<h1>Correo de prueba</h1>');
        res.send('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error enviando el correo:', error);
        res.status(500).send('Error enviando el correo');
    }
});

export default router;