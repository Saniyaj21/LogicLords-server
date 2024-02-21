import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from './database/connection.js';

const server = express();
connectDB();

// routes import

import userRoute from './routes/userRoute.js';


// Middlewares
// Increase the request size limit for JSON data
server.use(bodyParser.json({ limit: '50mb' }));

// Increase the request size limit for URL-encoded data
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// for accepting json data from request
server.use(express.json());
server.use(
    cors({
        origin: process.env.FRONTEND_URL,
        exposedHeaders: ['X-Total-Count'],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);
// for getting the file by using req.file
server.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB (adjust this as needed)
}));

// cloudinary for file upload
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// APIs

server.use("/api/user", userRoute);


server.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



