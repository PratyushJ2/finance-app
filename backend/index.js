require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d';

// Initialize users
app.post('/users', async (req, res) => {
    const {email, password} = req.body;
    const existingUser = await prisma.user.findUnique({ where: {email} });

    if(existingUser) {
        return res.status(400).send('User already exists');
    }

    const hash = await argon2.hash(password);
    const account = await prisma.user.create({
        data: { email, password: hash }
    });
    res.json(account);
});

// Generate tokens
function generateTokens(user) {
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
}

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({ where: {email} });

    if(!user) {
        return res.status(401).json({ error: 'Invalid Credentials' });
    }

    const valid = await argon2.verify(user.password, password);
    if(!valid) {
        return res.status(401).json({ error: 'Invalid Credentials' });
    }

    const tokens = generateTokens(user);

    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken: tokens.accessToken });
});

// Auth middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Refresh token
app.post('/refresh-token', (req, res) => {
    const token = req.cookies.refreshToken;
    if(!token) {
        return res.status(401).json({ error: 'No refresh token' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        const accessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        res.json({ accessToken });
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out' });
});

// Create an account
app.post('/accounts', authenticateToken, async (req, res) => {
    const userId = req.user.userId
    const {name} = req.body;
    const account = await prisma.account.create({
        data: { name, userId }
    });
    res.json(account);
});

app.post('/transactions', authenticateToken, async(req, res) => {
    const userId = req.user.userId;
    const {description, entries} = req.body;

    try {
        // Validate all accountIds belong to the user
        const accountIds = [...new Set(entries.map(entry => entry.accountId))];
        const userAccounts = await prisma.account.findMany({
            where: {
                id: {in: accountIds},
                userId
            },
            select: {id: true}
        });

        if(userAccounts.length != accountIds.length) {
            return res.status(403).json({error: 'One or more accountIds are invalid or unauthorized'});
        }

        // Validate transaction is balanced
        const totalDebits = entries
        .filter(event => event.entryType == 'Debit')
        .reduce((sum, event) => sum + parseFloat(event.amount), 0);

        const totalCredits = entries
        .filter(event => event.entryType == 'Credit')
        .reduce((sum, event) => sum + parseFloat(event.amount), 0);

        if(totalDebits != totalCredits) {
            return res.status(400).json({error: 'Transaction is not balanced'});
        }

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                description,
                entries: {
                    create: entries.map(entry => ({
                        accountId: entry.accountId,
                        amount: entry.amount,
                        entryType: entry.entryType,
                        description: entry.description
                    }))
                }
            },
            include: {
                entries: true
            }
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal service error'});
    }

});

app.get('/accounts', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const entries = await prisma.account.findMany({ where: { userId }});
    res.json( entries );
});

app.get('/transactions', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const entries = await prisma.transaction.findMany({
        where: {userId},
        include: {
            entries: true
        }
    });
    res.json( entries );
});

app.get('/accounts/:id/balance', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const accountId = req.params.id;
    const account = await prisma.account.findUnique({ where: { id: accountId }});

    if(!account || account.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const entries = await prisma.ledgerEntry.findMany({ where: { accountId }});
    const balance = entries.reduce((acc, entry) => {
        const amount = parseFloat(entry.amount);
        return acc + (entry.entryType === 'Credit' ? amount : -amount);
    }, 0);
    res.send( balance );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));