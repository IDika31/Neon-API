import express from 'express';
import fs from 'fs';

const router = express.Router();

fs.readdir('./config/router', (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        if (file.endsWith('.ts')) {
            const app = require(`./router/${file}`).default;
            router.use(app);
            console.log(`Loaded Router: ${file.replace('.ts', '')}`);
        }
    });
});

export default router;