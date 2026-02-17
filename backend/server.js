import express from 'express';
import dotenv from 'dotenv';
import {connectToDatabase} from './config/db.js'
import productRouter from './routes/Product.js';

dotenv.config();

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/product',productRouter)

console.log('monogo_URI:', process.env.mongo_URI);

app.listen(3000, () => {
  connectToDatabase()
  console.log('Server is running at http://localhost:3000');
});