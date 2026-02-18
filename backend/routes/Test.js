// import { addProduct, deleteProduct, getAllProduct, upDateProduct } from '../controller/Product.controller.js';
import { Router } from 'express';

const testRouter = Router()

// productRouter.post('/',addProduct)
// productRouter.get('/',getAllProduct)
// productRouter.put('/:id',upDateProduct)
// productRouter.delete('/:id',deleteProduct)

testRouter.post('/',async(req,res) =>{
    console.log('New Request comes')
    
})

export default testRouter;