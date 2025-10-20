import React, {useState, useEffect} from 'react';
import {useAuth} from '../Context/AuthContext';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';

const defaultEntry = {
    accountId: '',
    entryType: 'Debit',
    amount: '',
    description: ''
}

function AddTransaction() {
    const [description, setDescription] = useState('');
    const [entries, setEntries] = useState([{...defaultEntry}, {...defaultEntry}])
    const [accounts, setAccounts] = useState([]);
    const {accessToken} = useAuth();
    const fetchAuth = useAuthenticatedFetch();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetchAuth('/accounts');
                if (!res.ok) throw new Error('Failed to load accounts');
                const data = await res.json();
                setAccounts(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAccounts();
    }, [fetchAuth]);

    const handleEntryChange = (index, field, value) => {
        const update = [...entries];
        update[index][field] = value;
        setEntries(update);
    }

    const addEntry = () => setEntries([...entries, {...defaultEntry}]);

    const removeEntry = (index) => {
        setEntries(entries.filter((__, i) => i !== index));
    }

    const handleTransaction = async (event) => {
        event.preventDefault();
        try {
            const res = await fetchAuth('/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description,
                    entries
                })
            });

            const data = await res.json();
            console.log('Server response:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div>
                <h1>Add Transaction</h1>
            </div>

            <div>
                <form onSubmit={handleTransaction}>
                    <label>
                        Transaction Description:
                        <input 
                            value={description} 
                            onChange={event => setDescription(event.target.value)} 
                            required 
                        />
                    </label>
                    <h3>Entries</h3>
                    {entries.map((entry, index) => (
                        <div key={index}>
                            <select 
                                value={entry.accountId}
                                onChange={event => handleEntryChange(index, 'accountId', event.target.value)}
                                required
                            >
                                <option value="">Select account</option>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>{account.name}</option>
                                ))}
                            </select>

                            <select 
                                value={entry.entryType}
                                onChange={event => handleEntryChange(index, 'entryType', event.target.value)}
                                required
                            >
                                <option value="Debit">Debit</option>
                                <option value="Credit">Credit</option>
                            </select>

                            <input 
                                type="Number" 
                                placeholder="Amount" 
                                value={entry.amount}
                                onChange={event => handleEntryChange(index, 'amount', event.target.value)}
                                required
                            />

                            <input 
                                placeholder="Description" 
                                value={entry.description}
                                onChange={event => handleEntryChange(index, 'description', event.target.value)}
                                required
                            />
                            <button type="button" onClick={() => removeEntry(index)}>❌</button>
                        </div>
                    ))}
                    <button type="button" onClick={addEntry}>Add Entry</button>
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );

}

export default AddTransaction;