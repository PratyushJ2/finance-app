import React, {useState, useEffect} from 'react';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';

function AddAccount() {
    const [account, setAccount] = useState('');
    const fetchAuth = useAuthenticatedFetch();

    const handleAccount = async (event) => {
        event.preventDefault();
        try {
            const res = await fetchAuth('/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: account })
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
                <h1>Create New Account</h1>
                <form onSubmit={handleAccount}>
                    <input 
                        placeholder="Account Name" 
                        value={account}
                        onChange={event => setAccount(event.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Submit</button>
                </form>
                
            </div>
        </>
    );

}

export default AddAccount;