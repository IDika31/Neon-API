import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
// import * as yaml from 'yaml';
import * as fs from 'fs';
// import * as path from 'path';

const router = express.Router();

// const swaggerDocument = yaml.parse(fs.readFileSync('./src/router/swagger/openapi.yaml', 'utf8'));

const swaggerDefinition: swaggerJSDoc.Options = {
    // swaggerDefinition: swaggerDocument,
    apis: ['./src/router/typescript/*.ts'],
    definition: JSON.parse(fs.readFileSync('./src/router/swagger/openapi.json', 'utf8')),
};

const specs = swaggerJSDoc(swaggerDefinition);

router.use(
    '/api/v1/docs',
    // (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //     if (req.isAuthenticated()) {
    //         console.log(JSON.stringify(specs, null, 4), 'Pertama');
    //         specs = Object.assign(specs, {
    //             securityDefinitions: {
    //                 apiKey: {
    //                     type: 'apiKey',
    //                     name: 'apiKey',
    //                     in: 'query',
    //                     description: 'This is a private API. Please provide your API key to access this API',
    //                 },
    //             },
    //         });
    //         console.log(JSON.stringify(specs, null, 4), 'Kedua');
    //     }
    //     next();
    // },
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

export default router;
