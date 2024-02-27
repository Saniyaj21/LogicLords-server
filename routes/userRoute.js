import express from "express";
import { LoginUser, logOutUser, registerUser, userInfo } from "../controllers/userController.js";
import { isAuthenticate } from "../middlewares/authenticate.js";
import { googleSignup } from "../controllers/googleAuthControllers.js";

const router = express.Router();

router.get('/profile',isAuthenticate, userInfo);
router.post('/register', registerUser);
// router.post('/emailverify', veryfyEmailOTP);
router.post('/login', LoginUser)
router.post('/signup/google', googleSignup)
router.get('/logout', logOutUser)

export default router;