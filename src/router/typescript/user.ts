import * as express from 'express';
import { validationResult, checkSchema, Schema, query } from 'express-validator';
import { makeErrorMessage, makeSuccessMessage } from '../../../config';

import UserController from '../../../app/controllers/UserController';

const router = express.Router();
const user = new UserController();

const LoginSchema: Schema = {
    username: {
        custom: {
            errorMessage: (value: string) => {
                value = value.trim().replace(/\s/g, '');
                const error = [];

                if (value == '') error.push('Username must be provided.');
                if (typeof value != 'string') error.push('Username must be a string.');
                if (value.length < 4) error.push('Username must be at least 4 characters.');
                if (value.length > 20) error.push('Username must be at most 20 characters.');

                return error;
            },
            options: (value: string) => {
                value = value ? value : '';
                value = value.trim().replace(/\s/g, '');

                return typeof value == 'string' && value != '' && value.length >= 4 && value.length <= 20;
            },
        },
    },
    password: {
        custom: {
            errorMessage: (value: string) => {
                value = value ? value : '';
                value = value.trim().replace(/\s/g, '');
                const error = [];

                if (value == '') error.push('Password must be provided.');
                if (typeof value != 'string') error.push('Password must be a string.');
                if (value.length < 8) error.push('Password must be at least 8 characters.');
                if (!/[A-Z]+/g.test(value)) error.push('Password must contain at least 1 uppercase letter.');
                if (!/[a-z]+/g.test(value)) error.push('Password must contain at least 1 lowercase letter.');
                if (!/[@#$*&^%]+/g.test(value)) error.push('Password must contain at least 1 symbol.');
                if (!/[\d]+/g.test(value)) error.push('Password must contain at least 1 number.');

                return error;
            },
            options: (value: string) => {
                value = value ? value : '';
                value = value.trim().replace(/\s/g, '');

                return typeof value == 'string' && value != '' && value.length >= 8 && /[A-Z]+/g.test(value) && /[a-z]+/g.test(value) && /[@#$*&^%]+/g.test(value) && /[\d]+/g.test(value);
            },
        },
    },
};

router.get('/api/login', (req, res) => {
    res.render('login', {
        title: 'Login',
    });
});

router.post('/api/login', checkSchema(LoginSchema, ['body']), async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(makeErrorMessage(400, 'body', errors.array()));
    } else return res.status(200).json(makeSuccessMessage(200, req.body));
});

export default router;