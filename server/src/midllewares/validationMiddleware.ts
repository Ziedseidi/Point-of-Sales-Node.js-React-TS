import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

export const validateForm = (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, password, dateOfBirth, phone, role } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate username
    if (!validator.isLength(userName, { min: 4 })) {
        return res.status(400).json({ message: 'Username must be at least 4 characters long' });
    }

    // Validate password
    const passwordCriteria = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/;
    if (!passwordCriteria.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 12 characters long and include numbers, uppercase letters, lowercase letters, and special characters' });
    }

    // Validate date of birth
    if (!validator.isDate(dateOfBirth)) {
        return res.status(400).json({ message: 'Invalid date of birth' });
    }

    // Validate phone
    if (!validator.isMobilePhone(phone, 'any')) {
        return res.status(400).json({ message: 'Invalid phone number' });
    }

   

    
    next();
};
