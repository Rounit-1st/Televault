import express from 'express';
import dotenv from 'dotenv';
import {connectToDatabase} from './config/db.js'
import authRouter from './routes/Auth.js';
import testRouter from './routes/Test.js'
import cookieParser from "cookie-parser";
import telegramApiManageRouter from "./routes/telegramApiManage.js"
import { protect } from './middleware/auth.middleware.js';
import fileManageRouter from './routes/fileManage.js';

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());


app.use('/auth',authRouter)
app.use('/fileManage',protect,fileManageRouter);
app.use('/telegramApiManage',protect,telegramApiManageRouter)

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/test',testRouter)

// console.log('monogo_URI:', process.env.mongo_URI);

app.listen(3000, () => {
  connectToDatabase()
  console.log('Server is running at http://localhost:3000');
});