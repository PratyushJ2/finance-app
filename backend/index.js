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

app.post('/transactions', async(req, res) => {
    const {userID, description, entries} = req.body;

    try {
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
                userID,
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

app.get('/accounts', async (req, res) => {
    const accountId = req.params.id;
    const entries = await prisma.account.findMany();
    res.json( entries );
});

app.get('/transactions', async (req, res) => {
    const entries = await prisma.transaction.findMany({
        include: {
            entries: true
        }
    });
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