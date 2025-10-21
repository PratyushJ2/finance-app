import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';

function AccountDetails() {
    const [balance, setBalance] = useState(0);
    const {id} = useParams();
    const fetchAuth = useAuthenticatedFetch();
    
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await fetchAuth(`/accounts/${id}/balance`);
                if (!res.ok) {
                    throw new Error('Failed to fetch balance');
                }
                const data = await res.json();
                setBalance(data);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchBalance();
  }, [fetchAuth, id]);

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