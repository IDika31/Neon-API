import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

const app = express();

import router from '../../config/router';
app.use(router)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
