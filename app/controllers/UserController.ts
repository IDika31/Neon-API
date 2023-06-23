import { RequestHandler } from 'express';
import user, { UserDocument } from '../models/UserModel';
import apikey from '../models/ApikeyModel';
import passport from 'passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { generateApiKey } from '../../config';

export default class UserController {
    constructor() {
        this.initiatePassport();
        this.serializeUser();
        this.deserializeUser();
    }

    login(): RequestHandler {
        return (req, res, next) => {
            return passport.authenticate('local', {
                failureRedirect: '/api/v1/login',
                successRedirect: '/api/v1/docs',
            })(req, res, next);
        };
    }

    register(): RequestHandler {
        return (req, res, next) => {
            const dataUser = user.create(req.body);

            dataUser
                .then(async (dataUser) => {
                    try {
                        await apikey.create({
                            userId: dataUser._id,
                            key: generateApiKey(),
                        });
                        this.login()(req, res, next);
                    } catch (err) {
                        res.redirect('/api/v1/register');
                    }
                })
                .catch((err) => {
                    res.redirect('/api/v1/register');
                });
        };
    }

    findUser(username: string): Promise<UserDocument> {
        return new Promise(async (resolve, reject) => {
            try {
                const dataUser = await user.findOne({ username });
                resolve(dataUser);
            } catch (err) {
                reject(err);
            }
        });
    }

    private initiatePassport(): void {
        passport.use(
            new Strategy({ usernameField: 'username', passwordField: 'password' }, async (username, password, done) => {
                const userDoc = await user.findOne({ username });

                if (!userDoc) return done(null, false, { message: 'Incorrect username.' });
                const isMatch = await bcrypt.compare(password, userDoc.password);
                if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

                return done(null, userDoc);
            })
        );
    }

    private serializeUser(): void {
        passport.serializeUser(function (user: UserDocument, done) {
            done(null, user._id);
        });
    }

    private deserializeUser(): void {
        passport.deserializeUser(async function (id, done) {
            try {
                const dataUser = await user.findById(id);
                done(null, dataUser);
            } catch (err) {
                done(err);
            }
        });
    }
}
