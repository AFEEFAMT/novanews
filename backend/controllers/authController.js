const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[DEBUG] Attempting to register: ${email}`);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { email, password: hashedPassword }
        });
        
        console.log(`[DEBUG] Registration successful for: ${email}`);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("[DEBUG] REGISTER CRASH:", error.message);
        res.status(400).json({ error: 'Email already exists' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[DEBUG] 1. Login attempt started for: ${email}`);
        
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            console.log("[DEBUG] 2. FAILED: User not found in database.");
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log("[DEBUG] 2. User found in database.");
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("[DEBUG] 3. FAILED: Passwords do not match.");
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log("[DEBUG] 3. Password matched perfectly.");
        
        console.log("[DEBUG] 4. Attempting to generate JWT Token...");
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        console.log("[DEBUG] 5. SUCCESS! Token generated. Sending to frontend.");
        res.json({ token });
    } catch (error) {
        console.error("=====================================");
        console.error("🚨 CRITICAL LOGIN CRASH ERROR 🚨");
        console.error(error);
        console.error("=====================================");
        res.status(500).json({ error: 'Login failed' });
    }
};