import { RequestHandler } from 'express';
import user, { User } from '../models/UserModel';
import apikey from '../models/ApikeyModel';
import passport from 'passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';

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
        passport.serializeUser(function (user: User, done) {
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
