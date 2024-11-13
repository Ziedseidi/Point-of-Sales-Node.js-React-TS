import { Request, Response } from 'express';
import bwipjs from 'bwip-js';
import { Barcode } from '../models/Barcode';
import { Product } from '../models/product.model';
import { Stock } from '../models/Stock.model';
import mongoose from 'mongoose';

// Fonction pour générer une image de code-barres
const generateBarcode = (bcid: string, text: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer({
      bcid,
      text,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    }, (err, png) => {
      if (err) {
        reject(err);
      } else {
        resolve(png);
      }
    });
  });
};

// Fonction pour générer un nombre aléatoire
const generateRandomNumber = (length: number): string => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const barcodeController = {
  async addBarcode(req: Request, res: Response) {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID.' });
    }

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      // Vérifier si un code à barres existe déjà pour ce produit
      let barcode = await Barcode.findOne({ product: productId });

      if (!barcode) {
        // Générer un code à barres unique pour le produit
        const randomNumber = generateRandomNumber(6); // Par exemple, générer un nombre aléatoire de 6 chiffres
        const barcodeCode = `${product.code}-${randomNumber}`;

        // Générer le code à barres
        const barcodeImage = await generateBarcode('code128', barcodeCode);

        // Créer un nouvel enregistrement pour le code à barres
        barcode = new Barcode({
          code: barcodeCode,
          product: productId,
        });

        await barcode.save();

        // Envoyer l'image du code à barres en réponse
        res.setHeader('Content-Type', 'image/png');
        res.send(barcodeImage);
      } else {
        // Code à barres déjà existant, renvoyer l'image existante
        const barcodeImage = await generateBarcode('code128', barcode.code);
        res.setHeader('Content-Type', 'image/png');
        res.send(barcodeImage);
      }

    } catch (error) {
      res.status(500).json({ message: 'Error generating and saving barcodes.', error });
    }
  },

  
};

export default barcodeController;
