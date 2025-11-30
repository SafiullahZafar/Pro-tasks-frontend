import React from 'react'

const Sidebar = ({user,logout}) => {
  return (
    <div className='bg-gray-800 h-screen w-64 p-4 text-white hidden md:block'>
        <h2 className='mb-4 text-xl font-bold'>Dashboard</h2>
        <p className='mb-2'>Hello, {user.name}</p>
        <p>Role: {user.role}</p>
        <button
        onClick={logout}
        className='bg-red-500 px-3 py-1 rounded hover:bg-red-700'
        >
            Logout
        </button>
    </div>
  );
};

export default Sidebar;