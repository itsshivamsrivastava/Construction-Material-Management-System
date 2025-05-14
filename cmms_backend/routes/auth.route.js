import express from 'express';
import { createAdmin, loginAdmin, logoutAdmin } from '../controllers/user.controller.js';

const authRouter = express.Router();

authRouter.post('/signup', createAdmin);
authRouter.post('/signin', loginAdmin);
authRouter.post('/logout', logoutAdmin);

export { authRouter };