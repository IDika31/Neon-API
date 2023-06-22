import 'tslib';

import * as express from 'express';
import { checkSchema, Schema, query } from 'express-validator';
import { checkError } from '../../../config';

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

router.get('/api/v1/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        // csrfToken: req.csrfToken(),
    });
});

router.post('/api/v1/login', checkSchema(LoginSchema, ['body']), checkError(), user.login());

export default router;
