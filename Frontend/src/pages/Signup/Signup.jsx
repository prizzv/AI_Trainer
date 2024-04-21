import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { FaUser, FaLock, FaRegCalendar } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { PiIdentificationBadgeDuotone } from 'react-icons/pi';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        age: '',
        height: '',
        gender: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //backend
        try {
            console.log('Form data:', formData);
            // const response = //TODO: make a POST request to the server using axios

            if (response.ok) {
                // check
                navigate('/login');
            } else {
                console.error('Signup failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='background-image'>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Signup</h1>
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

                    <div className='input-box'>
                        <input
                            type='text'
                            name='name'
                            placeholder='Name'
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <MdOutlineDriveFileRenameOutline className='icon' />
                    </div>

                    <div className='input-box'>
                        <input
                            type='number'
                            name='age'
                            placeholder='Age'
                            required
                            value={formData.age}
                            onChange={handleChange}
                        />
                        <FaRegCalendar className='icon' />
                    </div>

                    <div className='input-box'>
                        <input
                            type='text'
                            name='height'
                            placeholder='Height'
                            required
                            value={formData.height}
                            onChange={handleChange}
                        />
                        <GiBodyHeight className='icon' />
                    </div>

                    <div className='input-box'>
                        <select
                            name='gender'
                            className='custom-select'
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value='' disabled hidden>
                                Gender
                            </option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Other'>Other</option>
                        </select>
                        <PiIdentificationBadgeDuotone className='icon' />
                    </div>

                    <div className='remember-forgot'>
                        <label>
                            <input type='checkbox' /> Remember me
                        </label>
                    </div>

                    <button type='submit'>Signup</button>

                    <div className='register-link'>
                        <p>
                            Already Signed up? <Link to='/login'>Login</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
