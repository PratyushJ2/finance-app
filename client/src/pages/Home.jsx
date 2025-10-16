import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../Context/AuthContext';

function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {accessToken, setAccessToken} = useAuth();
    const navigate = useNavigate();

    const handleUser = async(event) => {
        event.preventDefault();
        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if(!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await res.json();
            setAccessToken(data.accessToken);
            navigate('/accounts');
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleUser}>
                <label>
                    Email
                    <br/>
                    <input
                        placeholder='Enter your email'
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        required
                    />
                </label>
                <br />

                <label>
                    Password
                    <br/>
                    <input
                        type='password'
                        placeholder='Enter your password'
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        required
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );

}

export default Home;