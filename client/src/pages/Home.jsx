import React, {createContext, useContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const AuthContext = createContext();

function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accessToken, setAccessToken] = useAuth();

    const handleNavigate = (id) => {
        navigate(`account/${id}`)
    }

    const handleUser = async(event) => {
        event.preventDefault();
        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password
                })
            });

            const data = await res.json();
            console.log('Server response', data);
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <div>
            <H1>Login</H1>
            <form onSubmit={handleUser}>
                <label>
                    Email
                    <input
                        placeholder='Enter your email'
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
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