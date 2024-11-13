import { Request, Response } from 'express';
import User from '../models/user.model';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendMail } from '../utils/sendConfirmationEmail';

const passwordController = {
    async requestPasswordReset(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email }).exec();

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const token = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
            await user.save();

            const resetURL = `http://localhost:5173/password/reset-password/${token}`;
 
            const emailContent = `You requested a password reset. Click the following link to reset your password: <a href="${resetURL}">${resetURL}</a>`;

            await sendMail(user.email, 'Password Reset Request', emailContent, true);

            res.status(200).json({ message: 'Password reset email sent' });
        } catch (error) {
            console.error('Error during password reset request:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    async resetPassword(req: Request, res: Response) {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Token, new password, and confirm password are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Validate the new password strength
        const passwordCriteria = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/;
        if (!passwordCriteria.test(newPassword)) {
            return res.status(400).json({ message: 'Password must be at least 12 characters long and include numbers, uppercase letters, lowercase letters, and special characters' });
        }

        try {
            console.log('Received token:', token); // Log du token reçu

            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            }).exec();

            if (!user) {
                console.log('Invalid or expired token'); // Log si le token est invalide ou expiré
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(200).json({ message: 'Password has been reset' });
        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export default passwordController;