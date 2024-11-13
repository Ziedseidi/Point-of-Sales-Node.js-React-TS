import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import userRouter from './routes/auth.routes';
import passwordRoutes from './routes/passwordRoutes'; 
import warehouseRoutes from './routes/warehouse.routes';
import bandRoutes from './routes/band.routes';
import variationRoutes from './routes/variation.routes';
import unitRoutes from './routes/unit.routes'; 
import productCategoryRoutes from './routes/categorie.routes';
import productRoutes from './routes/product.routes';
import supplierRoutes from './routes/supplier.route';
import customerRoutes from './routes/customer.routes';
import stockRoutes from './routes/stock.routes';
import barcodeRoutes from './routes/barcodeRoutes'; // Importer le routeur de code à barres
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app: Application = express();

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Serve static files
const uploadsPath = path.resolve(__dirname, '../uploads'); // Chemin absolu
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api', userRouter);
app.use('/api/password', passwordRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/brands', bandRoutes);
app.use('/api/variations', variationRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/categories', productCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/barcodes', barcodeRoutes); // Ajouter la route pour les codes à barres

export default app;
