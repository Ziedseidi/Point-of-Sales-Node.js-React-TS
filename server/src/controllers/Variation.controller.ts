import { Request, Response } from 'express';
import { Variation } from '../models/Variation.model';

const variationController = {
  // Fonction pour ajouter une variation
  async addVariation(req: Request, res: Response) {
    try {
      const variation = new Variation(req.body);
      await variation.save();
      res.status(201).json(variation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Fonction pour obtenir toutes les variations
  async getVariations(req: Request, res: Response) {
    try {
      const variations = await Variation.find();
      res.status(200).json(variations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Fonction pour obtenir une variation par ID
  async getVariationById(req: Request, res: Response) {
    try {
      const variation = await Variation.findById(req.params.id);
      if (!variation) return res.status(404).json({ message: 'Variation not found' });
      res.status(200).json(variation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Fonction pour mettre à jour une variation
  async updateVariation(req: Request, res: Response) {
    try {
      const variation = await Variation.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!variation) return res.status(404).json({ message: 'Variation not found' });
      res.status(200).json(variation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Fonction pour supprimer une variation
  async deleteVariation(req: Request, res: Response) {
    try {
      const variation = await Variation.findByIdAndDelete(req.params.id);
      if (!variation) return res.status(404).json({ message: 'Variation not found' });
      res.status(200).json({ message: 'Variation deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default variationController;
