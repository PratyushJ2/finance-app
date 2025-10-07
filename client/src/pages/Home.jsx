import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

function Home() {
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/accounts')
          .then(res => res.json())
          .then(data => setAccounts(data))
          .catch(console.error);
    }, []);

    const handleNavigate = (id) => {
        navigate(`account/${id}`)
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
            <button type="button" onClick={() => navigate('add-transaction')}>Add Transaction</button>
        </div>
    );

}

export default Home;