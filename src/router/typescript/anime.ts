import * as express from 'express';
import { validationResult, checkSchema, Schema, query } from 'express-validator';

import AnimeController from '../../../app/controllers/AnimeController';
import { makeErrorMessage, makeSuccessMessage } from '../../../config';

const router = express.Router();
const anime = new AnimeController();

const SearchSchema: Schema = {
    title: {
        notEmpty: {
            errorMessage: ["The 'title' query is missing. Please provide a valid query to initiate the search process."],
        },
        isString: {
            errorMessage: ["The 'title' query must be a valid string."],
        },
    },
};

const DetailSchema: Schema = {
    id: {
        notEmpty: {
            errorMessage: ["The 'id' parameter is missing. Please provide a valid parameter to initiate the detail search process."],
        },
        isString: {
            errorMessage: ["The 'id' parameter must be a valid string."],
        },
    },
};

const TopSchema: Schema = {
    type: {
        custom: {
            errorMessage: (value: string) => {
                value = value ? value : '';
                value = value.trim().replace(/\s/g, '');

                const error = [];
                const listValidValue = ['all', 'airing', 'upcoming', 'tv', 'movie', 'ova', 'ona', 'special', 'popularity', 'favorite'];

                if (value == '') error.push("The 'type' query is missing. Please provide a valid query to initiate the top search process.");
                if (typeof value != 'string') error.push("The 'type' query must be a string.");
                if (!listValidValue.includes(value)) error.push(`The value of query "type" must be a valid value. The valid value are ${listValidValue.map((val) => `'${val}'`).join(', ')}.`);

                return error;
            },
            options: (value: string) => {
                value = value ? value : '';
                value = value.trim().replace(/\s/g, '');

                const listValidValue = ['all', 'airing', 'upcoming', 'tv', 'movie', 'ova', 'ona', 'special', 'popularity', 'favorite'];
                return typeof value == 'string' && value != '' && listValidValue.includes(value);
            },
        },
    },
    page: {
        optional: {
            options: {
                values: 'falsy',
            },
        },
        custom: {
            errorMessage: (value: string | number) => {
                value = value ? (value as string) : '';
                value = value.trim().replace(/\s/g, '');
                value = parseInt(value);

                const error = [];

                if (value <= 0) error.push('The value of query "page" must be a valid number. The vaalid number is greater or equal than 1');

                return error;
            },
            options: (value: string | number) => {
                value = value ? (value as string) : '';
                value = value.trim().replace(/\s/g, '');
                value = parseInt(value);

                return !Number.isNaN(value) && typeof value == 'number' && value > 0;
            },
        },
    },
    top: {
        optional: {
            options: {
                values: 'falsy',
            },
        },
        custom: {
            errorMessage: (value: string | number, { req }) => {
                value = value ? (value as string) : '';
                value = value.trim().replace(/\s/g, '');
                value = parseInt(value);

                const page = req.query?.page as string;
                const topValue = parseInt(page) * 50;
                const topPrevValue = (parseInt(page) - 1) * 50;

                const error = [];

                if (value > topValue) error.push(`The value of query "top" must be a valid number. The valid value is smaller or equal than ${topValue}`);
                if (value <= topPrevValue) error.push(`The value of query "top" must be a valid number. The valid value is greater than ${topPrevValue}`);
                if (value <= 0) error.push('The value of query "top" must be a valid number. The vaalid number is greater or equal than 1');

                return error;
            },
            options: (value: string | number, { req }) => {
                value = value ? (value as string) : '';
                value = value.trim().replace(/\s/g, '');
                value = parseInt(value);

                const page = req.query?.page as string;
                const topValue = parseInt(page) * 50;
                const topPrevValue = (parseInt(page) - 1) * 50;

                return !Number.isNaN(value) && typeof value == 'number' && value > 0 && value <= topValue && value > topPrevValue;
            },
        },
    },
};

router.get('/api/v1/anime/search', checkSchema(SearchSchema, ['query']), async (req: express.Request, res: express.Response) => {
    const error = validationResult(req);

    if (!error.isEmpty()) return res.status(400).json(makeErrorMessage(400, 'query', error.array()));

    const query = req.query;
    const title = query.title as string;

    const data = await anime.search(title, `${req.protocol}://${req.get('host')}`);
    res.status(200).json(makeSuccessMessage(200, data));
});

router.get('/api/v1/anime/detail/:id', checkSchema(DetailSchema, ['params']), async (req: express.Request, res: express.Response) => {
    const error = validationResult(req);

    if (!error.isEmpty()) return res.status(400).json(makeErrorMessage(400, 'params', error.array()));

    const params = req.params;
    const id = params.id as string;

    try {
        const data = await anime.getDetail(id);
        res.status(200).json(makeSuccessMessage(200, data));
    } catch (err) {
        console.log(err);
        res.status(400).json(makeErrorMessage(400, 'params', [{ msg: 'Not Found', type: 'field', path: 'id', value: id, location: 'params' }]));
    }
});

router.get('/api/v1/anime/top', checkSchema(TopSchema, ['query']), async (req: express.Request, res: express.Response) => {
    const error = validationResult(req);

    if (!error.isEmpty()) return res.status(400).json(makeErrorMessage(400, 'query', error.array()));

    const query = req.query;
    const type = query.type as string;
    const page = query.page as string;
    const top = query.top as string;

    const data = await anime.getTop(type, page, top);
    res.status(200).json(makeSuccessMessage(200, data));
});

export default router;
