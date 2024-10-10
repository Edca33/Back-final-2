import Product from '../models/Product.js';

class ProductDAO {
    async getAll() {
        try {
            return await Product.find(); 
        } catch (error) {
            throw new Error('Error getting all products: ' + error.message);
        }
    }

    async getById(id) {
        try {
            return await Product.findById(id); 
        } catch (error) {
            throw new Error('Error getting product by ID: ' + error.message);
        }
    }

    async create(data) {
        try {
            const newProduct = new Product(data);
            return await newProduct.save(); 
        } catch (error) {
            throw new Error('Error creating product: ' + error.message);
        }
    }

    async update(id, data) {
        try {
            return await Product.findByIdAndUpdate(id, data, { new: true }); 
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async delete(id) {
        try {
            return await Product.findByIdAndDelete(id); 
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }
}

export default new ProductDAO();
