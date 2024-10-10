import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = Router();


router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    
    const newUser = new User({
      first_name,
      last_name,
      email,
      password, 
      age,
    });

    
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar el usuario', error: err.message });
  }
});

export default router;
