import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useAuth} from '../Context/AuthContext';

function AccountDetails() {
    const [balance, setBalance] = useState(0);
    const {id} = useParams();
    const {accessToken} = useAuth();

    useEffect(() => {
        fetch(`/accounts/${id}/balance`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
          .then(res => res.json())
          .then(data => setBalance(data))
          .catch(console.error)
    }, [accessToken]);

    return (
        <>
            <div>
                <h1>Balance</h1>
                <h2>{balance}</h2>
            </div>
        </>
    );

}

export default AccountDetails;