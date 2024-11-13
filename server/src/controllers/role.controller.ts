import { Request, Response } from 'express';
import Role from '../models/role.model';

const roleController = {
    async addRole(req: Request, res: Response) {
        try {
            const { name, description } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'Role name is required' });
            }

            const existingRole = await Role.findOne({ name });
            if (existingRole) {
                return res.status(409).json({ message: 'Role already exists' });
            }

            const newRole = new Role({
                name,
                description,
                modulePermissions: [] 
            });

            await newRole.save();

            res.status(201).json({ message: 'Role created successfully', role: newRole });
        } catch (error) {
            console.error('Error creating role:', error);
            res.status(500).json({ message: 'Error creating role' });
        }
    },

    async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await Role.find();
            res.status(200).json(roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
            res.status(500).json({ message: 'Error fetching roles' });
        }
    },
    async getRoleById(req: Request, res: Response) {
        const { roleId } = req.params;

        try {
            const role = await Role.findById(roleId);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            res.status(200).json(role);
        } catch (error) {
            console.error('Error fetching role by ID:', error);
            res.status(500).json({ message: 'Error fetching role by ID' });
        }
    },

    async assignModulePermissionsToRole(req: Request, res: Response) {
        const { roleId, modulePermissions } = req.body;
    
        try {
            const role = await Role.findById(roleId);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
    
            // Remplacez les permissions existantes par celles fournies dans la requête
            role.modulePermissions = modulePermissions;
    
            await role.save();
    
            res.status(200).json({ message: 'Module permissions assigned to role successfully', role });
        } catch (error) {
            console.error('Error assigning module permissions to role:', error);
            res.status(500).json({ message: 'Error assigning module permissions to role' });
        }
    },
    
    
    
    
    
    async updateRole(req: Request, res: Response) {
        const { roleId } = req.params;
        const { name, description, modulePermissions } = req.body;
    
        try {
            const role = await Role.findById(roleId);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
    
            if (name) role.name = name;
            if (description) role.description = description;
    
            if (modulePermissions) {
                // Met à jour les permissions de module
                role.modulePermissions = modulePermissions;
            }
    
            await role.save();
            res.status(200).json({ message: 'Role updated successfully', role });
        } catch (error) {
            console.error('Error updating role:', error);
            res.status(500).json({ message: 'Error updating role' });
        }
    },
    
    async deleteRole(req: Request, res: Response) {
        const { roleId } = req.params;

        try {
            const deletedRole = await Role.findByIdAndDelete(roleId);
            if (!deletedRole) {
                return res.status(404).json({ message: 'Role not found' });
            }

            res.status(200).json({ message: 'Role deleted successfully' });
        } catch (error) {
            console.error('Error deleting role:', error);
            res.status(500).json({ message: 'Error deleting role' });
        }
    }
};

export default roleController;
