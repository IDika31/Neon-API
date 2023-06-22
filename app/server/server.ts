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
import cookie from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import session from 'express-session';
import passport from 'passport';

// Database Import
import { connectRedis, sendCommand } from '../database/redis.db';
import connectDatabase from '../database/mongo.db';

// View Engine Import
import { setupReactViews, PrettifyRenderMiddleware } from 'express-tsx-views';
import path from 'path';

const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: async (...args: string[]) => await sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000, // jendela waktu dalam milidetik
    max: 100, // jumlah maksimum permintaan selama jendela waktu
    message: 'Batas permintaan tercapai. Silakan coba lagi nanti.',
    standardHeaders: true,
    legacyHeaders: false,
});

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
app.use(cookie(['IDika', 'Secret']));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
// app.use(csurf({ cookie: true }));
app.use(mongoSanitize());
app.use(limiter);
app.use(
    session({
        secret: ['IDika', 'Secret'],
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Use Router
app.use(router);

// 404 Error Handler
app.use((req, res) => {
    res.status(404).send('Hello, World!');
});

// Listen
app.listen(process.env.PORT || 3000, async () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);

    // Connect to Database
    await connectDatabase();
});

export default app;
