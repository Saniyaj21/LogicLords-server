import { Course } from "../models/courseModel.js";
import { v2 as cloudinary } from 'cloudinary';

// create Course
export const createCourse = async (req, res) => {
    try {
        console.log(4);
        const { title, description , tag} = req.body;
        const myCloud = await cloudinary.uploader.upload(req.body.thumbnail, {
            folder: 'logicLords',


        });
        const course = await Course.create({
            title,
            description,
            tag,
            thumbnail:{
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            },
            publishedBy: req.user.name
        });

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
//  Course details
export const courseDetails = async (req, res) => {
    try {
        const { id } = req.params;


        const course =  await Course.findById(id).populate("videos");

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



// get all Course
export const allCourses = async (req, res) => {
    try {

        const courses = await Course.find();

        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



//update video
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description , tag} = req.body;


        const course = await Course.findByIdAndUpdate(id, {
            title,
            description,
            tag
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};