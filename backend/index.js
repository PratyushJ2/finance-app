const express = require('express');
const app = express();

const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Create an account
app.post('/accounts', async (req, res) => {
    const {name, userID} = req.body;
    const account = await prisma.account.create({
        data: { name, userID }
    });
    res.json(account);
});

// Add a transaction
app.post('/ledger', async (req, res) => {
    const {accountId, amount, entryType, description} = req.body;
    const ledger = await prisma.ledgerEntry.create({
        data: { accountId, amount, entryType, description}
    });
    res.json(ledger);
});

app.get('/accounts', async (req, res) => {
    const accountId = req.params.id;
    const entries = await prisma.account.findMany();
    res.json( entries );
});

app.get('/accounts/:id/balance', async (req, res) => {
    const accountId = req.params.id;
    const entries = await prisma.ledgerEntry.findMany({ where: { accountId }});
    const balance = entries.reduce((acc, entry) => {
        return acc + parseFloat(entry.amount);
    }, 0);
    res.send( balance );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));