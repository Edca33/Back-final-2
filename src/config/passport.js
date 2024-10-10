// config/passport.js
import JwtStrategy from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import passport from 'passport';


const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            let token = null;
            if (req && req.cookies) token = req.cookies['token'];
            return token;
        },
    ]),
    secretOrKey: 'RTX 3060' 
};


passport.use(
    new JwtStrategy.Strategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);


export default passport;
