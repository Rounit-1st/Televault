// import { AuthLogin, AuthRegister, AuthSignOut, AuthUpdateInfo, AuthDelete } from '../controller/Auth.controller.js';
import { Router } from 'express';
import {isTelegramApiExistForAccount} from '../middleware/tele.api.available.js'
import multer from 'multer';
import { uploadFile, viewFile, deleteFileOrFolder, renameFileOrFolder, moveFileOrFolder } from '../controller/fileManage.controller.js';   

const fileManageRouter = Router()

const memoryStorage = multer.memoryStorage();
const upload = multer({storage: memoryStorage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 5MB
    }
})

// fileManageRouter.post('/teleManage',isTelegramApiExistForAccount);
// fileManageRouter.get('/view',isTelegramApiExistForAccount,viewFile);
// fileManageRouter.get('/download',AuthLogin);
fileManageRouter.put('/move',isTelegramApiExistForAccount,moveFileOrFolder);
fileManageRouter.post('/upload',isTelegramApiExistForAccount,upload.single('file'),uploadFile);
fileManageRouter.get('/view',isTelegramApiExistForAccount,viewFile);
fileManageRouter.delete('/delete',isTelegramApiExistForAccount,deleteFileOrFolder)
fileManageRouter.put('/rename',isTelegramApiExistForAccount,renameFileOrFolder);

export default fileManageRouter;