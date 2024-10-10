import passport from 'passport';

const currentUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default currentUser;
