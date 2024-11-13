import { Request, Response, NextFunction } from 'express';
import bwipjs from 'bwip-js';
import { Product } from '../models/product.model'; // Assurez-vous d'utiliser le bon chemin pour l'importation
import mongoose from 'mongoose';

const generateBarcode = (bcid: string, text: string, res: Response) => {
  bwipjs.toBuffer({
    bcid,          // Type de code à barres (ex: 'code128', 'ean13', etc.)
    text,          // Le texte ou code à coder
    scale: 3,      // Échelle de l'image
    height: 15,    // Hauteur du code à barres
    includetext: true, // Inclure le texte sous le code à barres
    textxalign: 'center', // Alignement du texte
  }, (err, png) => {
    if (err) {
      res.status(500).send('Erreur de génération du code à barres.');
    } else {
      res.setHeader('Content-Type', 'image/png');
      res.send(png);
    }
  });
};

const barcodeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.query;

  if (typeof productId !== 'string') {
    return res.status(400).send('Paramètre productId manquant ou invalide.');
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send('ID de produit invalide.');
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Produit non trouvé.');
    }

    // Générer le code à barres basé sur le code du produit
    generateBarcode('code128', product.code, res);
  } catch (error) {
    res.status(500).send('Erreur de génération du code à barres.');
  }
};


export default barcodeMiddleware;
