import * as express from 'express';
import { validationResult, checkSchema, Schema, query } from 'express-validator';
import { makeErrorMessage, makeSuccessMessage } from '../../../config';

import UserController from '../../../app/controllers/UserController';
import model from '../../../app/models/user';

const router = express.Router();
const user = new UserController();

const LoginSchema: Schema = {
    username: {
        custom: {
            errorMessage: (value: string) => {
                value = value.trim().replace(/\s/g, '');
                const error = [];

                if (value == '') error.push('Username must be provided.');
                if(typeof value != 'string') error.push('Username must be a string.');
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













/**
 *     //     context.subscriptions.push(
    //         vscode.commands.registerCommand('idika-utils.createController', async () => {
    //             // The code you place here will be executed every time your command is executed
    //             // Display a message box to the user
    //             const controllerName = await vscode.window.showInputBox({ prompt: 'Enter controller name' });
    //             if (!controllerName) {
    //                 return vscode.window.showErrorMessage('Controller name is required.');
    //             }

    //             const controllerNameCapitalized = capitalize(controllerName);

    //             const createRouter = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Create router?' });
    //             if (!createRouter) {
    //                 return;
    //             }

    //             const controllerCode = `// Controller: ${controllerName}
    // export default class ${controllerNameCapitalized}Controller {
    //     constructor() {}
    // }`;

    //             const routerCode = `import express from 'express';
    // import { validationResult, checkSchema, Schema, query } from 'express-validator';
    // import { makeErrorMessage, makeSuccessMessage } from '../../config';

    // import ${controllerNameCapitalized}Controller } from '../../app/controllers/${controllerNameCapitalized}Controller';
    // // import model from '../../app/models/${toLowerCase(controllerName)}';

    // const router = express.Router();
    // const ${toLowerCase(controllerName)} = new ${controllerNameCapitalized}Controller();

    // export default router;
    // `;

    //             const controllerPath = vscode.Uri.joinPath(context.extensionUri, 'app', 'controllers', `${controllerNameCapitalized}Controller.ts`);
    //             const routerPath = vscode.Uri.joinPath(context.extensionUri, 'src', 'router', `${toLowerCase(controllerName)}.ts`);

    //             fs.writeFileSync(controllerPath.fsPath, controllerCode);
    //             vscode.window.showInformationMessage(`Controller '${controllerNameCapitalized}' created successfully.`);

    //             if (createRouter === 'Yes') {
    //                 fs.writeFileSync(routerPath.fsPath, routerCode);
    //                 vscode.window.showInformationMessage(`Router '${controllerNameCapitalized}' created successfully.`);
    //             }
    //         })
    //     );
}

// function capitalize(text: string): string {
//     return text.charAt(0).toUpperCase() + text.slice(1);
// }

// function toLowerCase(text: string): string {
//     return text.toLowerCase();
// }

 */