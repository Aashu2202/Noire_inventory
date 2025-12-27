const supabase = require('../config/supabaseClient');
const UserHelper = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user || error) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await UserHelper.matchPassword(password, user.password);
        
        if (isMatch) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password, role, Designation, Department } = req.body;

    try {
        // Check if exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await UserHelper.hashPassword(password);

        // Create user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{ 
                name, 
                email, 
                password: hashedPassword, 
                role: role || 'USER',
                Designation: Designation || 'STAFF',
                Department: Department || 'GENERAL',
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            Designation: newUser.Designation,
            Department: newUser.Department,
            token: generateToken(newUser.id, newUser.role),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, registerUser };