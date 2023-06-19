import express from 'express';
import fs from 'fs';

const router = express.Router();

fs.readdir('./src/router/typescript', (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        if (file.endsWith('.ts') && file != 'index.ts') {
            const app = require(`./typescript/${file}`).default;
            router.use(app);
            console.log(`Loaded Router: ${file.replace('.ts', '')}`);
        }
    });
});

export default router;
