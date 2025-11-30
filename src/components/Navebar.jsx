import React from 'react'

const Navebar = ({user,logout}) => {
  return (
    <nav className='bg-blue-600 p-4 flex justify-between items-center text-white'>
        <h1 className='font-bold text-xl '>Role Dashboard</h1>
        <div>
            <span className='mr-4'>{user?.name} {user?.role} </span>
            <button
            onClick={logout}
            className='bg-red-500 px-3 py-1 rounded hover:bg-red-700'
            >Logout</button>
        </div>

    </nav>
  );
};

export default Navebar;