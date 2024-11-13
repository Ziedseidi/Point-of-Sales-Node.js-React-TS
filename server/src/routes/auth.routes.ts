import express from 'express';
import userController from '../controllers/user.controller';
import roleController from '../controllers/role.controller';
import checkPermission from '../midllewares/RBAC'; 
import authenticateToken from '../midllewares/AuthMiddleware'; 
import uploadImage from '../midllewares/multer';

const router = express.Router();

// Routes that do not require authorization
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/logout', userController.logoutUser);
router.post('/verify-confirmation', userController.verifyConfirmationCode);
router.post('/resend-confirmation-code', userController.resendConfirmationCode);

// Routes for users
router.post('/adduser', authenticateToken, uploadImage.single('profileImage'), checkPermission('users', 'create'), userController.addUser); // Ajoutez les permissions nécessaires ici
router.patch('/users/:userId', authenticateToken, checkPermission('users', 'update'),userController.updateUser);
router.post('/assign-role', authenticateToken, checkPermission('users', 'update'), userController.assignRoleToUser); // Vérifiez les permissions nécessaires

// Routes for roles 
router.post('/addrole', authenticateToken, checkPermission('roles', 'create'), roleController.addRole); // Ajoutez les permissions nécessaires ici
router.get('/roles', authenticateToken, checkPermission('roles', 'read'), roleController.getAllRoles);
router.get('/roles/:roleId',authenticateToken, checkPermission('roles', 'read'), roleController.getRoleById);
router.patch('/roles/:roleId', authenticateToken, checkPermission('roles', 'update'), roleController.updateRole); // Update role route
router.delete('/roles/:roleId', authenticateToken, checkPermission('roles', 'delete'), roleController.deleteRole); // Delete role route
// Route for assigning module permissions to role
router.post('/assign-module-permissions', authenticateToken, checkPermission('roles', 'update'), roleController.assignModulePermissionsToRole);










// Other routes
router.get('/users', authenticateToken, checkPermission('users', 'read'), userController.getUsers);
router.get('/current-user', authenticateToken, checkPermission('users', 'read'), userController.getCurrentUser);
router.delete('/users/:userId', authenticateToken, checkPermission('users', 'delete'), userController.deleteUser);
router.patch('/disable/:userId', authenticateToken, checkPermission('users', 'update'), userController.disableUser);

export default router;
