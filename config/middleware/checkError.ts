import * as express from 'express';
import { makeErrorMessage } from '../index';
import { validationResult } from 'express-validator';

export default function (): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(makeErrorMessage(400, 'body', errors.array()));
        } else next();
    };
}
