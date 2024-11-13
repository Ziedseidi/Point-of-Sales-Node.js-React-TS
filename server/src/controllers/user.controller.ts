import { Request, Response } from 'express';
import { hashPassword, comparePassword } from '../utils/hashingandCrypto utils';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/user.model';
import { sendMail } from '../utils/sendConfirmationEmail';
import { generateCode } from '../utils/generateCode';  // Si vous utilisez export default
import Role, {IRoleDocument} from '../models/role.model'
import { ObjectId } from 'mongoose';
import crypto from 'crypto';
import { Types } from 'mongoose';
import { IUser } from '../typesAndinterfaces/IUserInterface';
import path from 'path';


const userController = {
    async  addUser(req: Request, res: Response) {
        try {
            const { userName, email, password, dateOfBirth, phone } = req.body;
    
            if (!userName || !email || !password || !dateOfBirth || !phone) {
                return res.status(400).json({ message: 'Tous les champs sont requis' });
            }
    
            const hashedPassword = await hashPassword(password);
    
            const existingUser = await User.findOne({ userName });
            if (existingUser) {
                return res.status(409).json({ message: 'Nom d’utilisateur déjà pris' });
            }
    
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(409).json({ message: 'Email déjà existant' });
            }
    
            // Nom du fichier image téléchargé
            let profileImage = '';
            if (req.file) {
                profileImage = 'http://localhost:4000/uploads/' + req.file.filename;
            }
    
            const newUser = new User({
                userName,
                email,
                password: hashedPassword,
                dateOfBirth,
                phone,
                profileImage, // Ajout de l'image de profil
                isActive: false,
            });
    
            await newUser.save();
    
            res.status(201).json({ message: 'Inscription réussie', user: newUser });
        } catch (error) {
            console.error('Erreur lors de la création de l’utilisateur :', error);
            res.status(500).json({ message: 'Erreur lors de la création de l’utilisateur' });
        }
    }
,

    async verifyConfirmationCode(req: Request, res: Response) {
        try {
            const { email, confirmationCode } = req.body;
            
            console.log('Received in backend:', { email, confirmationCode });

            if (!email || !confirmationCode) {
                return res.status(400).json({ message: 'Email et code de confirmation requis' });
            }

            const user = await User.findOne({ email, confirmationCode });

            if (!user) {
                return res.status(400).json({ message: 'Code de confirmation invalide' });
            }

            user.isActive = true;
            user.confirmationCode = ''; 
            
            await user.save();

            res.status(200).json({ message: 'Account activated successfully' });
        } catch (error) {
            console.error('Error while verifying confirmation code:', error);
            res.status(500).json({ message: 'Error while verifying confirmation code' });
        }
    },
    async resendConfirmationCode(req: Request, res: Response) {
        try {
            const { email } = req.body;
            
            console.log('Resending code for email:', email);

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const newConfirmationCode = generateCode();
            user.confirmationCode = newConfirmationCode;
            await user.save();

            await sendMail(email, 'Confirm your signup', `Your new signup code is: ${newConfirmationCode}`, false);

            res.status(200).json({ message: 'Confirmation code resent' });
        } catch (error) {
            console.error('Error resending confirmation code:', error);
            res.status(500).json({ message: 'Failed to resend confirmation code' });
        }
    },


    async disableUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;



            const user = await User.findById(userId);

            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
        
            // Toggle the isDisabled field
            user.isDisabled = !user.isDisabled;
        
            // Save the updated user
            await user.save();
        
            // Send the updated user back in the response
            res.json(user);
          } catch (error) {
            console.error('Error disabling user:', error);
            res.status(500).json({ message: 'Internal server error' });
          }
        },


    async  login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
    
            const user = await User.findOne({ email }).populate('role');
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            if (user.isDisabled) {
                return res.status(403).json({ message: 'Utilisateur désactivé' });
              }
    
            if (!user.isActive) {
                const newConfirmationCode = generateCode();
                user.confirmationCode = newConfirmationCode;
                await user.save();
    
                await sendMail(email, 'Confirmez votre inscription', `Votre code de confirmation est : ${newConfirmationCode}`, false);
    
                return res.status(403).json({ message: 'Compte non activé', needsActivation: true });
            }
    
            const validPassword = await comparePassword(password, user.password);
            if (!validPassword) {
                console.error('Mot de passe incorrect pour l\'utilisateur:', email);
                return res.status(401).json({ message: 'Mot de passe incorrect' });
            }
    
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
            const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
    
            user.refreshToken = refreshToken;
            await user.save();
    
            const welcomeMessage = `Bienvenue, ${user.userName} (${user.role})`;
    
            // Afficher l'access token dans la console
            console.log('Access Token:', token);
    
            res.status(200).json({
                message: welcomeMessage,
                token,
                refreshToken,
                user: { userName: user.userName, role: user.role }
            });
        } catch (error) {
            console.error('Erreur lors de la connexion de l’utilisateur :', error);
            res.status(500).json({ message: 'Erreur lors de la connexion de l’utilisateur' });
        }
    }
    ,
    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token manquant' });
            }
            const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as { userId: string };

            const user = await User.findById(decodedToken.userId);

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            if (user.refreshToken !== refreshToken) {
                return res.status(401).json({ message: 'Refresh token invalide' });
            }

            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

            res.status(200).json({ token });
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token :', error);
            res.status(500).json({ message: 'Erreur lors du rafraîchissement du token' });
        }
    },
    async logoutUser(req: Request, res: Response) {
        try {
            res.clearCookie('token', { path: '/' });
            res.status(200).json({ message: 'Déconnexion réussie' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        }
    },


    
    async assignRoleToUser(req: Request, res: Response) {
        try {
            const { userName, roleName } = req.body;
    
            if (!userName || !roleName) {
                return res.status(400).json({ message: 'userName and roleName are required' });
            }
    
            const user = await User.findOne({ userName });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const role = await Role.findOne({ name: roleName });
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
    
            user.role = role._id as Types.ObjectId; // Type assertion for role._id
            await user.save();
    
            res.status(200).json({ message: 'Role assigned successfully' });
        } catch (error) {
            console.error('Error assigning role:', error);
            res.status(500).json({ message: 'Error assigning role' });
        }
    }
,
    async getUsers(req: Request, res: Response) {
    try {
        const users = await User.find().populate('role');

        const transformedUsers = users.map(user => ({
            ...user.toObject(),
            profileImage: user.profileImage ? path.basename(user.profileImage) : null
        }));

        res.status(200).json(transformedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
},


    async getCurrentUser(req: Request, res: Response) {
        try {
          const token = req.headers.authorization?.split(' ')[1];
          if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
          }
      
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      
          const user = await User.findById(decodedToken.userId).populate('role');
          if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
          }
      
          // Transformez les données pour inclure seulement le nom du fichier pour profileImage
          const transformedUser = {
            ...user.toObject(),
            profileImage: user.profileImage ? path.basename(user.profileImage) : null
          };
      
          res.status(200).json({ user: transformedUser });
        } catch (error) {
          console.error('Erreur lors de la récupération de l’utilisateur actuel :', error);
          res.status(500).json({ message: 'Erreur lors de la récupération de l’utilisateur actuel' });
        }
      }
      ,


      async updateUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { userName, email, phone, dateOfBirth, password } = req.body;
    
            // Prepare fields to update, excluding `role`
            const updatedFields: Partial<IUserDocument> = {};
            if (userName) updatedFields.userName = userName;
            if (email) updatedFields.email = email;
            if (phone) updatedFields.phone = phone;
            if (dateOfBirth) updatedFields.dateOfBirth = dateOfBirth;
            if (password) updatedFields.password = await hashPassword(password);
    
            console.log('Updating user with ID:', userId);
            console.log('Update fields:', updatedFields);
    
            // Find the user without modifying their role
            const user = await User.findById(userId).exec();
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Update user fields, but keep the role intact
            const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true }).exec();
            if (!updatedUser) {
                console.log('Failed to update user');
                return res.status(404).json({ message: 'User not found' });
            }
    
            console.log('User updated successfully:', updatedUser);
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user' });
        }
    },
    
    


      async deleteUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            // Récupérer l'utilisateur avec le rôle peuplé
            const user = await User.findById(userId).populate<{ role: { name: string } }>('role');
            
            if (user.role && user.role.name === 'Admin') {
                return res.status(403).json({ message: 'Impossible de supprimer l\'administrateur' });
            }

            const deletedUser = await User.findByIdAndDelete(userId);

            if (!deletedUser) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression de l’utilisateur :', error);
            res.status(500).json({ message: 'Erreur lors de la suppression de l’utilisateur' });
        }
    }
    
    



    
    
    

};

export default userController;
