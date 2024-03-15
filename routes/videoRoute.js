import express from "express";
import { authorizeRoles, isAuthenticate } from "../middlewares/authenticate.js";
import { deleteVideo, postVideo, updateVideo } from "../controllers/videoControllers.js";

const router = express.Router();

router.post('/create', isAuthenticate, authorizeRoles('admin'), postVideo);
router.put('/update/:id', isAuthenticate, authorizeRoles('admin'), updateVideo);
router.delete('/delete/:id', isAuthenticate, authorizeRoles('admin'), deleteVideo);


export default router;