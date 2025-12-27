const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // 1. Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 2. Fetch User from Supabase (Ensure table name is 'users')
            const { data: user, error } = await supabase
                .from('users') // <--- MUST BE LOWERCASE 'users'
                .select('id, name, email, role')
                .eq('id', decoded.id)
                .single();

            if (error || !user) {
                console.log("❌ Auth Middleware: User not found in DB");
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("❌ JWT Verification Failed:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };