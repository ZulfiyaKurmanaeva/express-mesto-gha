const userRoutes = require('express').Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.post('/', createUser);
userRoutes.get('/:id', getUserById);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateAvatar);

module.exports = userRoutes;