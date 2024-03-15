// desc, pic, title, link, playlist

import mongoose from 'mongoose';


const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    description: {
        type: String,
        required: [true, "Please Enter Your a description of video"],
    },
    videoLink: {
        type: String,
        required: [true, "Please Enter link of video"],
    },

    relatedLinks: [
        {
            linkTitle: {
                type: String,
            },
            link: {
                type: String,
            },
        }
    ],
    playlist: {
        type: mongoose.Schema.ObjectId,
        ref: "Playlist",
    },
    publishedBy: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

});


export const Video = mongoose.model("Video", videoSchema)