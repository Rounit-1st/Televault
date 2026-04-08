import { Router } from 'express';
import {setTelegramApi, updateTelegramApi, removeTelegramApi, getTelegramApi} from '../controller/telegramApiManage.controller.js'

const telegramApiManageRouter = Router();

telegramApiManageRouter.post('/add',setTelegramApi);
telegramApiManageRouter.put('/update',updateTelegramApi);
telegramApiManageRouter.delete('/delete',removeTelegramApi);
telegramApiManageRouter.get('/view',getTelegramApi); //for debugging purpose

export default telegramApiManageRouter;