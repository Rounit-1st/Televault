// import { AuthLogin, AuthRegister, AuthSignOut, AuthUpdateInfo, AuthDelete } from '../controller/Auth.controller.js';
import { Router } from 'express';
import {isTelegramApiExistForAccount} from '../middleware/tele.api.available.js'

const fileManageRouter = Router()

// fileManageRouter.post('/teleManage',isTelegramApiExistForAccount);
// fileManageRouter.get('/view',isTelegramApiExistForAccount,viewFile);
// fileManageRouter.get('/download',AuthLogin);
// fileManageRouter.put('/rename',AuthSignOut);
fileManageRouter.post('/upload',isTelegramApiExistForAccount,uploadImage)
// fileManageRouter.delete('/delete',AuthDelete)

export default fileManageRouter;