import dotenv from 'dotenv';
dotenv.config();
// Library Imports
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swagger from 'swagger-ui-express';

// File Imports
import apiDocs from './swagger.json' assert{type: 'json'};
import errorHandler from './src/middlewares/errorHandler.js';
import authRouter from './src/routes/auth_routes.js';
import auth from './src/middlewares/auth.js';
import loggerMiddleware from './src/middlewares/logger.js';
import postRouter from './src/routes/post_routes.js';
import userRouter from './src/routes/user_routes.js';
import commentRouter from './src/routes/comment_routes.js';
import likeRouter from './src/routes/like_routes.js';
import friendshipRouter from './src/routes/friendship_routes.js';
import otpRouter from './src/routes/otp_routes.js';

const app = express();

// plugIn cookieParser
app.use(cookieParser());

// Configure CORS policy
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: ['application/json', 'multipart/form-data'],
    credentials: true,
}));

// Serving static files to application
app.use(express.static('public'));

// Middleware to parse json data from request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// for accessing document.use
app.use('/api-docs', swagger.serve, swagger.setup(apiDocs));


// Application logger
app.use(loggerMiddleware);

// Application Routes Entrypoints
app.use('/api/users', authRouter);
app.use('/api/users', auth, userRouter);
app.use('/api/posts', auth, postRouter);

app.use('/api/comments', auth, commentRouter);
app.use('/api/likes', auth, likeRouter);
app.use('/api/friends', auth, friendshipRouter);
app.use('/api/otp', otpRouter);

// Application error handler
app.use(errorHandler);

export default app;