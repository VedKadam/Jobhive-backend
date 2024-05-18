import express from 'express';
import { login, register, logout, getUser, } from '../controllers/userController.js';
import {isAuthorized} from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthorized, logout);
router.get("/getuser", isAuthorized, getUser);
//router.get("/landing/home1", home1);
//router.get("/landing/about", about);

export default router;