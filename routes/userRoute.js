import express from "express";
import { LoginUser, googleSignup, registerUser, userInfo, veryfyEmailOTP } from "../controllers/userController.js";
import { isAuthenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.get('/profile',isAuthenticate, userInfo);
router.post('/register', registerUser);
router.post('/emailverify', veryfyEmailOTP);
router.post('/login', LoginUser)
router.post('/signup/google', googleSignup)

export default router;