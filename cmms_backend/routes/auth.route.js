import express from 'express';
import { createAdmin, loginAdmin, logoutAdmin, updateAdminProfile, getUserById } from '../controllers/user.controller.js';

const authRouter = express.Router();

authRouter.post('/signup', createAdmin);
authRouter.post('/signin', loginAdmin);
authRouter.post('/logout', logoutAdmin);
authRouter.put('/profile/:id', updateAdminProfile);
authRouter.get('/profile/id/:id', getUserById);

export { authRouter };