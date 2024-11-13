import { Request, Response, NextFunction } from 'express';
import Role from '../models/role.model';

const checkPermissions = (requiredModule: string, requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Récupérez le rôle de l'utilisateur via req.user.role
            const roleId = req.user.role;

            if (!roleId) {
                return res.status(403).json({ message: 'Role not assigned to user' });
            }

            // Recherchez le rôle avec les permissions et modules associés
            const role = await Role.findById(roleId);

            if (!role) {
                return res.status(403).json({ message: 'Role not found' });
            }

            // Vérifiez si le module et la permission existent dans le rôle
            const hasPermission = role.modulePermissions.some(modulePerm => 
                modulePerm.module === requiredModule && 
                modulePerm.permissions.includes(requiredPermission)
            );

            if (!hasPermission) {
                return res.status(403).json({ message: 'Insufficient permissions' });
            }

            // Si tout est correct, passez au middleware suivant
            next();
        } catch (error) {
            console.error('Error checking permissions:', error);
            res.status(500).json({ message: 'Error checking permissions' });
        }
    };
};

export default checkPermissions;
