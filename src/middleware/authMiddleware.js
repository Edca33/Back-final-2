const authMiddleware = (req, res, next) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.originalUrl.includes('admin') && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    next();
};

export default authMiddleware;
