import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate,Link, data } from 'react-router-dom';
import {toast} from 'react-hot-toast';

const Login = () => {
    const {register, handleSubmit} =useForm();
    const navigate=useNavigate();

    const onSubmit=async(data)=>{
        try{
            const res= await axios.post('http://localhost:5000/api/auth/login',data);
            //save token and user in localStorage
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success('Login successful!');
            navigate('/'); // Redirect to dash board 
        }catch(err){
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
            className='w-full bg-blue-500 rounded text-white hover:bg-blue-700'
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

export default Login