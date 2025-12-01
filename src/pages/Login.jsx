import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link, data } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';
const Login = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', data);
            login(res.data.user, res.data.token);  // Update context & trigger rerender
            toast.success('Login successful!');
            navigate('/'); // Redirect to dashboard
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className='flex justify-center items-center bg-gray-100 h-screen'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='shadow-md rounded bg-white w-full max-w-sm p-8'
            >
                <h2 className='text-2xl font-bold text-center mb-4'>Login</h2>

                <input type="email"
                    placeholder='Email'
                    {...register('email')}
                    className='w-full border p-2 mb-4 rounded'
                    required
                />
                <input type="password"
                    placeholder='Password'
                    {...register('password')}
                    className='w-full border p-2 mb-4 rounded'
                    required
                />
                <button
                    type='submit'
                    className='w-full p-2 bg-blue-500 rounded text-white hover:bg-blue-700'
                >
                    Login
                </button>
                <p>
                    Don't have an account?<Link to='/register' className='text-blue-600'>Register</Link>
                </p>
            </form>
        </div>
    )
}

export default Login;