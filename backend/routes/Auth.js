import { AuthLogin, AuthRegister, AuthSignOut, AuthUpdateInfo, AuthDelete } from '../controller/Auth.controller.js';
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';

const authRouter = Router()

authRouter.post('/register',AuthRegister);
authRouter.post('/login',AuthLogin);
authRouter.get('/signout',AuthSignOut);
authRouter.put('/updateDetails/',protect,AuthUpdateInfo)
authRouter.delete('/delete/',protect,AuthDelete)

export default authRouter;