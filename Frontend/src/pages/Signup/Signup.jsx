import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { FaUser, FaLock, FaRegCalendar } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { PiIdentificationBadgeDuotone } from 'react-icons/pi';
import axios from 'axios';
import { baseURL } from '../../constants';
import Cookies from 'js-cookie';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        userName: '',
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

        //backend api calling
        try {

            // const response = //TODO: make a POST request to the server using axios
            const options = {
                method: 'POST',
                url: `${baseURL}/auth/register`,
                headers: { 'content-type': 'application/json' },
                data: formData
            }

            const response = await axios.request(options);

            console.log('Response:', response.data)


            if (response.status === 200 || response.status === 201) {
                const accessToken = response.data.data.token.accessToken;
                const refreshToken = response.data.data.token.refreshToken;
                Cookies.set('accessToken', accessToken, { expires: 7 })
                Cookies.set('refreshToken', refreshToken, { expires: 30 })

                // check
                navigate('/');
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
                            type='email'
                            name='email'
                            placeholder='Email'
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <FaUser className='icon' />
                    </div>

                    <div className='input-box'>
                        <input
                            type='text'
                            name='userName'
                            placeholder='Username'
                            required
                            value={formData.userName}
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
