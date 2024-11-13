// src/controllers/productcategory.controller.ts
import { Request, Response } from 'express';
import { ProductCategory } from '../models/ProductCategory';
import { Product } from '../models/product.model';
import path from 'path';

const productCategoryController = {
  async addProductCategory(req: Request, res: Response) {
    try {
      const { name, description, parentCategory } = req.body;
      if (!name || !description) {
        return res.status(400).json({ message: 'Le nom et la description de la catégorie sont requis' });
      }
  
      let logoCategoryFileName = '';
      if (req.file) {
        logoCategoryFileName = req.file.filename;
      }
  
      const newCategory = new ProductCategory({
        name,
        description,
        logoCategory: logoCategoryFileName,
        parentCategory: parentCategory || null, // Parent category est optionnel
      });
  
      await newCategory.save();
      res.status(201).json({ message: 'Catégorie ajoutée avec succès', category: newCategory });
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie :', error);
      res.status(500).json({ message: 'Erreur lors de la création de la catégorie' });
    }
  
  },

  async getProductCategories(req: Request, res: Response) {
    try {
      const productCategories = await ProductCategory.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'products'
          }
        },
        {
          $addFields: {
            productCount: { $size: '$products' }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            logoCategory: 1, // Inclure le champ logoCategory
            productCount: 1
          }
        }
      ]);

      // Manipuler les résultats directement pour ajuster les URLs des images
      const categoriesWithUrls = productCategories.map((category: any) => ({
        ...category,
        logoCategory: category.logoCategory ? path.basename(category.logoCategory) : null
      }));

      res.status(200).json(categoriesWithUrls);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories de produits :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des catégories de produits' });
    }
  },

  async getProductCategoryById(req: Request, res: Response) {
    try {
      const productCategory = await ProductCategory.findById(req.params.id);
      if (!productCategory) return res.status(404).json({ message: 'Product Category not found' });
      res.status(200).json(productCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateProductCategory(req: Request, res: Response) {
    try {
      const productCategory = await ProductCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!productCategory) return res.status(404).json({ message: 'Product Category not found' });
      res.status(200).json(productCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

 async deleteProductCategory(req: Request, res: Response) {
  try {
    const categoryId = req.params.id;

    // Mettre à jour les produits pour effacer la catégorie tout en laissant le champ vide
    await Product.updateMany(
      { category: categoryId },
      { $set: { category: null } } // Mettre à jour le champ 'category' à null
    );

    // Supprimer la catégorie
    await ProductCategory.findByIdAndDelete(categoryId);

    res.status(200).json({ message: 'Category deleted successfully and associated products updated' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category and update associated products' });
  }
}
};

export default productCategoryController;
