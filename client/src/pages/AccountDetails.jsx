import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function AccountDetails() {
    const [balance, setBalance] = useState(0);
    const {id} = useParams();

    useEffect(() => {
        fetch(`/accounts/${id}/balance`)
          .then(res => res.json())
          .then(data => setBalance(data))
          .catch(console.error)
    }, []);

    return (
        <div>
            <h1>Balance</h1>
            <h2>{balance}</h2>
        </div>
    );

}

export default AccountDetails;