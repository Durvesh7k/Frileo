import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from "../utils/prisma.js";

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Basic input validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Username, email, password, and role are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (map username to name)
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role, // e.g., 'BUYER' or 'SELLER'
            },
        });

        // Generate JWT
        const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(201).json({ user: newUser, token });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Something went wrong during registration.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({ user, token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Something went wrong during login.' });
    }
};
