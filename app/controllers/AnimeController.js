"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Path: src\typescript\AnimeController.ts
// Compare this snippet from src\typescript\AnimeController.ts:
const BaseController_1 = __importDefault(require("./BaseController"));
class AnimeController extends BaseController_1.default {
    constructor() {
        super();
        this.router.get('/', this.getData);
    }
}
