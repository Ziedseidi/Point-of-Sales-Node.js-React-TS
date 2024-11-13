import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific variables from .env file
const environment = process.env.NODE_ENV || 'dev'
const envFilePath = path.resolve(process.cwd(), `./configs/env/.env.${environment}`);

dotenv.config({ path: envFilePath });

// Define your configuration object
const envConfig = {

  port: process.env.PORT,
  sg_api_key: process.env.SENDGRID_API_KEY,
  database: {
    dbUrl: process.env.DATABASE_URL || ''
    // other db configs
  }
};

export default envConfig;