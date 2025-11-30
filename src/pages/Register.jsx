import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate ,Link } from 'react-router-dom'
import {toast} from 'react-hot-toast'

const Register = () => {
    const {register,handleSubmit} =useForm();
    const navigate=useNavigate();

    const onSubmit=async(data)=>{
        try{
            await axios.post('http://localhost:5000/api/auth/register',data);
            toast.success('Registration successful! Login now.');
            navigate('/login');
        }
        catch(err){
            toast.error(err.response.data.message);
        }
    };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
        <form onSubmit={handleSubmit(onSubmit)}
        className='bg-white rounded shadow-md p-8 w-full max-w-sm'
        >
            <h2 className='text-2xl font-bold text-center mb-4'>Register</h2>
            <input type="text"
            placeholder='Name'
            {...register('name')}
            className='w-full border p-2 mb-4 rounded'
            required />
              <input type="email"
            placeholder='Email'
            {...register('email')}
            className='w-full border p-2 mb-4 rounded'
            required />
              <input type="password"
            placeholder='Password'
            {...register('password')}
            className='w-full border p-2 mb-4 rounded'
            required />
            <select {...register('role')}
            className='w-full border rounded p-2 mb-4'
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button type='submit' className='w-full bg-blue-500 rounded text-white p-2 hover:bg-blue-700'>
                Register
            </button>
            <p className='text-center mt-4'>
                Already have an anaccount? <Link to='/login' className='text-blue-600'>Login</Link>
            </p>
        </form>
    </div>
  );
};

export default Register;