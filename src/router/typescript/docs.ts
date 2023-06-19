import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'yaml';
import * as fs from 'fs';

const router = express.Router();

const swaggerDocument = yaml.parse(fs.readFileSync('./src/router/yaml/swagger.yaml', 'utf8'));

const swaggerDefinition: swaggerJSDoc.Options = {
    swaggerDefinition: swaggerDocument,
    apis: ['./src/router/typescript/*.ts'],
    swaggerOptions: {
        tags: [
            {
                name: 'Anime'
            }
        ]
    }
};

const specs = swaggerJSDoc(swaggerDefinition);

router.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs));

export default router;
