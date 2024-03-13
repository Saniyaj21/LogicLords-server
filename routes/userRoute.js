import express from "express";
import { LoginUser, forgotPassword, logOutUser, registerUser, setNewPassword, userInfo, veryfyOTP } from "../controllers/userController.js";
import { isAuthenticate } from "../middlewares/authenticate.js";
import { googleSignup } from "../controllers/googleAuthControllers.js";

const router = express.Router();

router.get('/profile',isAuthenticate, userInfo);
router.post('/register', registerUser);
// router.post('/emailverify', veryfyEmailOTP);
router.post('/login', LoginUser)
router.post('/signup/google', googleSignup)
router.get('/logout',isAuthenticate, logOutUser)


// forget password
router.post('/password/forgot',forgotPassword)
router.post('/verify/otp',veryfyOTP)
router.post('/password/reset',setNewPassword)

export default router;