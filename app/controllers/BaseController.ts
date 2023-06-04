import * as express from 'express';

export default class BaseController {
    constructor() {}

    sendData<T>(res: express.Response, data: T): void {
        res.status(200).json(data);
    }
}