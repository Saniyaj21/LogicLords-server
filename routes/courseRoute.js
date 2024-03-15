import express from "express";
import { allCourses, courseDetails, createCourse } from "../controllers/courseCoontrollers.js";
import { authorizeRoles, isAuthenticate } from "../middlewares/authenticate.js";
import { deleteVideo } from "../controllers/videoControllers.js";

const router = express.Router();

router.get('/all', allCourses);
router.get('/:id', isAuthenticate, courseDetails);
router.post('/create', isAuthenticate, authorizeRoles('admin'), createCourse);
router.delete('/delete/:id', isAuthenticate, authorizeRoles('admin'), deleteVideo);


export default router;