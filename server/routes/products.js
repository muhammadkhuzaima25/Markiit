import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, toggleFavorite, getMyProducts, getMyFavorites } from '../controllers/products.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/my', protect, getMyProducts);
router.get('/favorites', protect, getMyFavorites);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, upload.array('images', 5), createProduct);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/:id/favorite', protect, toggleFavorite);

export default router;
