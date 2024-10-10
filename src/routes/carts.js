import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Carts.js';
import ProductRepository from '../repositories/ProductRepository.js';
import Ticket from '../models/Ticket.js';
import sendMail from '../config/mailServer.js';

const router = express.Router();

router.post('/:cid/purchase', async (req, res) => {
    const cartId = req.params.cid;


    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).json({ message: 'Invalid cart ID' });
    }

    try {
        console.log(`Buscando el carrito con ID: ${cartId}`);
        const cart = await Cart.findById(new mongoose.Types.ObjectId(cartId)).populate('products.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        let totalAmount = 0;
        let failedProducts = [];


        for (let item of cart.products) {
            if (!item.product || !item.product._id) {
                console.log('Producto no definido o sin _id:', item);
                failedProducts.push(item.product ? item.product._id : null);
                continue;
            }


            const product = await ProductRepository.getProductById(item.product._id);

            if (product && product.stock >= item.quantity) {

                product.stock -= item.quantity;
                totalAmount += product.price * item.quantity;
                await ProductRepository.updateProduct(product._id, { stock: product.stock });
            } else {

                failedProducts.push(product ? product._id : item.product._id);
            }
        }


        if (totalAmount > 0) {
            console.log('Generando ticket para la compra, Total:', totalAmount);

            const ticket = new Ticket({
                amount: totalAmount,
                purchaser: req.user.email
            });

            await ticket.save();

            console.log('Ticket guardado, enviando correo...');

            try {
                await sendMail('doom660324@gmail.com', 'Correo de prueba', 'Este es un correo de prueba', '<h1>Correo de prueba</h1>');
                res.send('Correo enviado exitosamente');
            } catch (error) {
                console.error('Error enviando el correo:', error);
                res.status(500).send('Error enviando el correo');
            }
        }

        cart.products = cart.products.filter(item => {
            
            return item.product && item.product._id && failedProducts.includes(item.product._id);
        });

        await cart.save();

        
        res.json({
            message: 'Purchase completed',
            failedProducts
        });
    } catch (error) {
        console.error('Error during purchase process:', error);
        res.status(500).json({ message: 'Internal server error' });
    }




});

router.post('/create', async (req, res) => {
    const { userId, products } = req.body;

    
    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Invalid data. Please provide a valid userId and products array.' });
    }

    try {
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        
        const newCart = new Cart({
            user: userId,
            products: products  
        });

        
        await newCart.save();

        
        res.json({ message: 'Cart created successfully', cartId: newCart._id });
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

export default router;
