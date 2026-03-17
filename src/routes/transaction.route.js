import express from express;
import { createTransactionController } from "../controllers/transaction.controller.js"; 
import authMiddleware from "../middlewares/auth.middleware";

const router=express.Router();

router.post("/",authMiddleware,createTransactionController);