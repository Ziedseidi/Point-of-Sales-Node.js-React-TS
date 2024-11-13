import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads'); // Répertoire de destination pour les fichiers
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Création d'un nouveau nom de fichier avec un timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Fonction pour filtrer les fichiers
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
) => {
  const filetypes = /jpeg|jpg|png|gif|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true); // Accepter le fichier
  } else {
    cb(null, false); // Rejeter le fichier
  }
};

// Configuration de multer
const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1000000 } // Limite de taille des fichiers à 1 Mo (1000000 bytes)
});

export default uploadImage;

