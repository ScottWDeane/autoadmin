import React, {useState} from 'react';

const Login = ({setAuth}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = btoa(`${username}:${password}`);
        const response = await fetch(`${apiBaseUrl}/parts/getall`, {
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });

        if (response.ok) {
            setAuth(credentials);
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div class="login-container">
            <form class="login-form" onSubmit={handleSubmit}>
                <label>Username: </label>
                <input
                    class="username-field"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <label>Password: </label>
                <input
                    class="password-field"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
