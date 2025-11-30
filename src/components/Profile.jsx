import { useState,useEffect } from "react";
import axios from "axios";
import {useForm} from 'react-hook-form';

const Profile = ({user,token}) => {
    const { register, handleSubmit} = useForm({
        defaultValues :{name :user.name, password :'' },
    });
    const [message, setMessage] = useState('');
    const onSubmit=async(data)=>{
        try{
        await axios.put(
            'http://localhost:5000/api/users/profile',
            data,
            {headers :{Authorization : `Bearer ${token}`}}
        );
        setMessage('Profile updated successfully');
    }catch(err){
        setMessage(err.response.data.message|| 'Error updating profile');
    }
    };
  return (
    <div className="rounded shadow p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        {message && <p className="mb-2 text-green-600">{message}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gsp-2">
            <input type="text"
            placeholder="New Name"
            {...register('name')}
            className="rounded border p-2"
            />
            <input type="password"
            placeholder="New Password"
            {...register(password)}
            className="border rounded p-2"
            />
            <button className="bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
                Update Profile
            </button>
        </form>
    </div>
  )
}

export default Profile