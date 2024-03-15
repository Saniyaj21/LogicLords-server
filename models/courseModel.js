// desc, pic, title, link, playlist

import mongoose from 'mongoose';


const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    description: {
        type: String,
    },
    tag: {
        type: String,

    },
    thumbnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },

    videos: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Video",
        }
    ],
    enrolled: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }
    ],
    publishedBy: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

});


export const Course = mongoose.model("Course", courseSchema)