import express from 'express';
import * as homeController from '../controllers/homeController';

const router = express();

router.get('/', homeController.homeJson);

export default router;
