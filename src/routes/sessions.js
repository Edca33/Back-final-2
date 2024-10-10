import currentUser from '../middleware/Usuario.js';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = Router();

const sessionRoutes = (router) => {
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Usuario no encontrado' });
            }

            
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }

            
            const token = jwt.sign({ id: user._id, role: user.role }, 'secretKey', {
                expiresIn: '1h',
            });

            
            res.cookie('token', token, { httpOnly: true });

            return res.json({ message: 'Login exitoso', token });
        } catch (err) {
            res.status(500).json({ message: 'Error en el servidor', error: err.message });
        }
    });
};

export default sessionRoutes