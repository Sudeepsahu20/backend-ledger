//create an api route for account with the following endpoints: create account, get all accounts, get account by id, update account, delete account
import express from "express";
import { createAccountController } from "../controllers/account.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
 
const router=express.Router();

router.post("/create",authMiddleware,createAccountController);

export default router;