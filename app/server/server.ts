// Author: IDika

// Import Lib
import 'tslib';

// Env Import
import dotenv from 'dotenv';
dotenv.config();

// Module Import
import express from 'express';

// Router Import
import router from '../../src/router';

// Middleware Import
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import csurf from 'csurf';

// Database Import
import { connectRedis } from '../database/redis.db';
import connectDatabase from '../database/mongo.db'

// View Engine Import
import { setupReactViews, PrettifyRenderMiddleware } from 'express-tsx-views';
import path from 'path';

// Init
const app = express();

// Set View Engine
setupReactViews(app, {
    viewsDirectory: path.join(__dirname, '../../pages'),
    middlewares: [new PrettifyRenderMiddleware()],
});

// Set Static Folder
app.use(express.static('public'));

// Use Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
// app.use(csrf({ cookie: true }));

// Use Router
app.use(router);

// 404 Error Handler
app.use((req, res) => {
    res.status(404).send('Hello, World!');

});

// Listen
app.listen(process.env.PORT || 3000, async () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);

    await connectDatabase()
    await connectRedis();
});

export default app;