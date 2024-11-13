import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { IUserDocument } from '../models/user.model';



dotenv.config({ path: './configs/env/.env.dev' });

declare global {
    namespace Express {
      interface Request {
        userId?: string;
        user?: IUserDocument;
      }
    }
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('Token not found in authorization header');
        return res.status(401).send('Authentication failed: invalid token');
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: string };
        console.log('Decoded token:', decodedToken);
        req.userId = decodedToken.userId;

       
        const user = await User.findById(req.userId).populate('role').exec();
        if (!user) {
            console.log('User not found for ID:', req.userId);
            return res.status(401).send('Authentication failed: user not found');
        }
        console.log('Authenticated user:', user);
        req.user = user;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).send('Authentication failed: invalid token');
    }
};

export default authenticateToken;
