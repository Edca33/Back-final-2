import ProductDAO from '../DAO/ProductDAO.js';
import Product from '../models/Product.js';

class ProductRepository {
    constructor() {
        this.dao = ProductDAO;
    }

    getAllProducts() {
        return this.dao.getAll();
    }

    getProductById(id) {
        return this.dao.getById(id);
    }

    createProduct(productData) {
        return this.dao.create(productData);
    }

    updateProduct(id, productData) {
        return this.dao.update(id, productData);
    }

    deleteProduct(id) {
        return this.dao.delete(id);
    }
    
    async getProductById(id) {
        return await Product.findById(id);
    }

    async updateProduct(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

}





export default new ProductRepository();
