// controllers/Brand.controller.ts

import { Request, Response } from 'express';
import { Brand } from '../models/Brand.model';
import { Product } from '../models/product.model'; // Assurez-vous que le chemin est correct
import path from 'path';

const bandController = {
  // Fonction pour ajouter une marque
  async addBrand(req: Request, res: Response) {
    try {
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ message: 'Le nom de la marque est requis' });
      }
  
      let logoBrandFileName = '';
      if (req.file) {
        logoBrandFileName = req.file.filename; // Conservez uniquement le nom du fichier
      }
  
      const newBrand = new Brand({
        name,
        logoBrand: logoBrandFileName, // Utilisez uniquement le nom du fichier ici
      });
  
      await newBrand.save();
  
      res.status(201).json({ message: 'Marque ajoutée avec succès', brand: newBrand });
    } catch (error) {
      console.error('Erreur lors de la création de la marque :', error);
      res.status(500).json({ message: 'Erreur lors de la création de la marque' });
    }
  },

  // Fonction pour obtenir toutes les marques avec le nombre de produits
  async getBrands(req: Request, res: Response) {
    try {
        const brands = await Brand.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'brand',
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
                    logoBrand: 1, // Inclure le champ logoBrand
                    productCount: 1
                }
            }
        ]);

        // Manipuler les résultats directement, car ce sont des objets ordinaires
        const brandsWithUrls = brands.map((brand: any) => ({
            ...brand,
            logoBrand: brand.logoBrand ? path.basename(brand.logoBrand) : null
        }));

        res.status(200).json(brandsWithUrls);
    } catch (error) {
        console.error('Erreur lors de la récupération des marques :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des marques' });
    }
},
  
  // Fonction pour obtenir une marque par ID
  async getBrandById(req: Request, res: Response) {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) return res.status(404).json({ message: 'Marque non trouvée' });
      res.status(200).json(brand);
    } catch (error) {
      console.error('Erreur lors de la récupération de la marque :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de la marque' });
    }
  },

  // Fonction pour mettre à jour une marque
  async updateBrand(req: Request, res: Response) {
    try {
      console.log('Received Request:', {
        body: req.body,
        file: req.file,
        params: req.params
      });

      const { name } = req.body;
      let logoBrandFileName = '';

      // Si un fichier est uploadé, utilisez le nom du nouveau fichier
      if (req.file) {
        logoBrandFileName = req.file.filename;
      } else {
        // Sinon, récupérez le nom du fichier existant depuis la base de données
        const existingBrand = await Brand.findById(req.params.id);
        if (existingBrand) {
          logoBrandFileName = existingBrand.logoBrand;
        }
      }

      // Créez l'URL du logo si un fichier est présent
      const logoBrandUrl = logoBrandFileName ? 'http://localhost:4000/uploads/' + logoBrandFileName : '';

      // Mettez à jour la marque avec le nouveau nom et l'URL du logo
      const updatedBrand = await Brand.findByIdAndUpdate(
        req.params.id,
        { name, logoBrand: logoBrandUrl },
        { new: true }
      );

      if (!updatedBrand) {
        console.log('Brand not found:', req.params.id);
        return res.status(404).json({ message: 'Marque non trouvée' });
      }
      console.log('Updated Brand:', updatedBrand);
      res.status(200).json(updatedBrand);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la marque :', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la marque' });
    }
  },
  

  // Fonction pour supprimer une marque
  async deleteBrand(req: Request, res: Response) {
    try {
      const brandId = req.params.id;
  
      // Mettre à jour les produits pour effacer la marque tout en laissant le champ vide
      await Product.updateMany(
        { brand: brandId },
        { $set: { brand: null } } // Mettre à jour le champ 'brand' à null
      );
  
      // Supprimer la marque
      const brand = await Brand.findByIdAndDelete(brandId);
      if (!brand) return res.status(404).json({ message: 'Marque non trouvée' });
  
      res.status(200).json({ message: 'Marque supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la marque :', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de la marque' });
    }
  }
};

export default bandController;
