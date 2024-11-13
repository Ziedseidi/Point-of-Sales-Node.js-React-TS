import { Request, Response } from 'express';
import { Product } from '../models/product.model';

const productController = {
  async addProduct(req: Request, res: Response) {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getProducts(req: Request, res: Response) {
    try {
      const products = await Product.find()
        .populate('brand', 'name') 
        .populate('productUnit', 'name') 
        .exec();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Fonction pour obtenir un  par ID
  async getProductById(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id)
        .populate('brand category variations unit warehouses.warehouse');
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('brand category variations unit warehouses.warehouse');
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default productController;


