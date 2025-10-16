import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../Context/AuthContext';

function AccountsHome() {
    const [accounts, setAccounts] = useState([]);
    const {accessToken} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/accounts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
          .then(res => res.json())
          .then(data => setAccounts(data))
          .catch(console.error);
    }, [accessToken]);

    const handleNavigate = (id) => {
        navigate(`/account/${id}`)
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
        </div>
    );

}

export default AccountsHome;