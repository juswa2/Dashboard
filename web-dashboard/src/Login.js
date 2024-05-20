import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import bgImage from './bg_law.png';
import logoImage from './QLOGO.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Notification({ message, onClose }) {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded-md shadow-md w-full max-w-sm mx-4 relative">
                <p className="text-center text-red-500 mt-2">{message}</p>
                <button onClick={onClose} className="absolute top-0 right-0 m-2 px-2 text-red-500 hover:bg-red-200" style={{ fontSize: '1.5rem' }}>×</button>
            </div>
        </div>
    );
}

function Login() {
    const [values, setValues] = useState({
        username: '',
        password: '',
        showPassword: false 
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    };

    const togglePasswordVisibility = () => {
        setValues(prev => ({...prev, showPassword: !prev.showPassword}));
    };

    const handleCloseNotification = () => {
        setErrorMessage('');
    };

    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if (errors.username === "" && errors.password === "") {
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    if (res.data.Login) {
                        if (res.data.account_type === 1) {
                            navigate('/dashboard');
                        } else if (res.data.account_type === 3) {
                            navigate('/clientpage');
                        } else if (res.data.account_type === 4) {
                            navigate('/retainerpage');
                        }
                    } else {
                        setErrorMessage("No account was found");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className='flex justify-center items-center bg-primary min-h-screen bg-cover' style={{ backgroundImage: `url(${bgImage})` }}>
            <div className='bg-gray-500 bg-opacity-20 p-5 px-8 py-10 md:py-20 rounded-lg w-full max-w-md mx-4 border-amber-500 border'>
                <img src={logoImage} alt="Logo" className="w-50 mx-auto -mt-5" />
                <br/>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 relative">
                        <label htmlFor="username" className='hidden'>Username</label>
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 ${errors.username ? 'pb-4' : ''}`}>
                            <FontAwesomeIcon className="text-black" icon={faUser} />
                        </div>
                        <input type="text" onChange={handleInput} name='username' placeholder='Enter Username' className='pl-10 px-3 py-2 mt-1 form-input border rounded-md w-full'/>
                        {errors.username && <span className='text-danger'> {errors.username} </span>}
                    </div>
                    <div className='mb-4 relative'>
                        <label htmlFor="password" className='hidden'>Password</label>
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 ${errors.password ? 'pb-4' : ''}`}>
                            <FontAwesomeIcon className="text-black" icon={faLock} />
                        </div>
                        <input type={values.showPassword ? "text" : "password"} onChange={handleInput} name='password' placeholder='Enter Password' className='pl-10 px-3 py-2 mt-1 form-input border rounded-md w-full'/>
                        <div className={`absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer ${errors.password ? 'pb-5' : ''}`} onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon className="text-black mt-1" icon={values.showPassword ? faEye : faEyeSlash} />
                        </div>
                        {errors.password && <span className='text-danger'> {errors.password} </span>}
                    </div>
                    <button type='submit' onSubmit={handleSubmit} className='bg-amber-400 hover:bg-amber-500 text-white w-full py-2 rounded-md mt-3'><strong>Log in</strong></button>
                </form>
                {errorMessage && <Notification message={errorMessage} onClose={handleCloseNotification} />}
            </div>
        </div>
    );
}

export default Login;
