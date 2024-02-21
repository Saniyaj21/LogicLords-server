import express from "express";
import { registerUser, veryfyEmailOTP } from "../controllers/userController.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/emailverify', veryfyEmailOTP);

export default router;