import { addProduct, deleteProduct, getAllProduct, upDateProduct } from '../controller/Product.controller.js';
import { Router } from 'express';

const productRouter = Router()

productRouter.post('/',addProduct)
productRouter.get('/',getAllProduct)
productRouter.put('/:id',upDateProduct)
productRouter.delete('/:id',deleteProduct)

export default productRouter;