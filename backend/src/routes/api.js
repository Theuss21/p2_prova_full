const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/VehicleController');
const authenticate = require('../middleware/auth');
const UserController = require('../controllers/UserController');
const { validateUser } = require('../middleware/validator');

// Rotas protegidas pelo middleware authenticate
router.post('/vehicles', authenticate, vehicleController.createVehicle);
router.get('/vehicles/:type', authenticate, vehicleController.listVehicles);
router.put('/vehicles/:id', authenticate, vehicleController.updateVehicle);
router.delete('/vehicles/:id', authenticate, vehicleController.deleteVehicle);

router.post('/brands', authenticate, vehicleController.createBrand);
router.get('/brands', authenticate, vehicleController.listBrands);
router.put('/brands/:id', authenticate, vehicleController.updateBrand);
router.delete('/brands/:id', authenticate, vehicleController.deleteBrand);

router.post('/register', validateUser, UserController.register);
router.post('/login', UserController.login);
router.get('/users', authenticate, UserController.listUsers);
router.put('/users/:id', authenticate, UserController.updateUser);
router.delete('/users/:id',authenticate, UserController.deleteUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Auth
 *   - name: Users
 *   - name: Vehicles
 *   - name: Brands
 *
 * /register:
 *   post:
 *     summary: Registrar usuário
 *     tags: [Auth]
 *
 * /login:
 *   post:
 *     summary: Realizar login
 *     tags: [Auth]
 *
 * /users:
 *   get:
 *     summary: Listar usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *
 *   delete:
 *     summary: Remover usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *
 * /vehicles:
 *   post:
 *     summary: Criar veículo
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *
 * /vehicles/{type}:
 *   get:
 *     summary: Listar veículos por tipo
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *
 * /vehicles/{id}:
 *   put:
 *     summary: Atualizar veículo
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *   delete:
 *     summary: Remover veículo
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 * /brands:
 *   post:
 *     summary: Criar marca
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *
 *   get:
 *     summary: Listar marcas
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *
 * /brands/{id}:
 *   put:
 *     summary: Atualizar marca
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *   delete:
 *     summary: Remover marca
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */