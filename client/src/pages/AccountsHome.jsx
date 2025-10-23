import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../Context/AuthContext';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';

function AccountsHome() {
    const [accounts, setAccounts] = useState([]);
    const {logout} = useAuth();
    const navigate = useNavigate();
    const fetchAuth = useAuthenticatedFetch();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetchAuth('/accounts');

                if (!res.ok) {
                    throw new Error('Failed to fetch accounts');
                }

                const data = await res.json();
                setAccounts(data);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
   }, []);

    const handleNavigate = (id) => {
        navigate(`/account/${id}`)
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    return (
        <div>
            <h1>Accounts</h1>
            { accounts.map(account => (
                <button key={account.id} onClick={() => handleNavigate(account.id)}> 
                {account.name} 
                </button>
            ))}
            <br />
            <button type="button" onClick={() => navigate('/add-transaction')}>Add Transaction</button>
            <br />
            <button type="button" onClick={() => navigate('/add-account')}>Add New Account</button>
            <br />
            <button type="button" onClick={handleLogout}>Logout</button>
        </div>
    );

}

export default AccountsHome;