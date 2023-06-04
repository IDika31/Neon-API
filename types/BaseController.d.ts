import * as express from 'express';
declare class BaseController {
    router: import("express-serve-static-core").Router;
    getData(req: express.Request, res: express.Response, next: express.NextFunction): void;
}
export default BaseController;
