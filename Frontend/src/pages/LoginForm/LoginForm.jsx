import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // backend send
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {

                navigate('/dashboard'); //website
            } else {


                const data = await response.json();
                console.error('Login failed:', data.error);

            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='background-image'>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className='input-box'>
                        <input
                            type='text'
                            name='username'
                            placeholder='Username'
                            required
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <FaUser className='icon' />
                    </div>

                    <div className='input-box'>
                        <input
                            type='password'
                            name='password'
                            placeholder='Password'
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <FaLock className='icon' />
                    </div>

                    <div className='remember-forgot'>
                        <label>
                            <input type='checkbox' /> Remember me
                        </label>
                        <a href='#'>Forgot password?</a>
                    </div>

                    <button type='submit'>Login</button>

                    <div className='register-link'>
                        <p>
                            Don't have an account? <Link to='/'>Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
