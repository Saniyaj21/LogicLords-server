import { Course } from '../models/courseModel.js';
import { Video } from '../models/videoModel.js';

//Post video
export const postVideo = async (req, res) => {
    try {
        const { title, description, videoLink, relatedLinks, playlist } = req.body;


        const video = await Video.create({
            title,
            description,
            videoLink,
            relatedLinks,
            playlist,
            publishedBy: req.user.name
        });
        const course =  await Course.findById(playlist);
        course.videos.push(video._id);
        course.save();

        res.status(200).json({
            success: true,
            video
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


//update video  add or remove from playlist playlist = null 
export const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, videoLink, relatedLinks, playlist } = req.body;

        const video = await Video.findByIdAndUpdate(id,
            {
                title,
                description,
                videoLink,
                relatedLinks,
                playlist,
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });

        res.status(200).json({
            success: true,
            video
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

//delete video
export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        await Video.findOneAndDelete({ id })

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};