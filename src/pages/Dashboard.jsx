import React, { useEffect, useState } from 'react'
import Navebar from '../components/Navebar'
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-hot-toast';
import DroppableColum from '../components/DroppableColum';
import io from 'socket.io-client';
import TaskComments from '../components/TaskComments';

const socket = io('http://localhost:5000');
const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');  // all/pending/complete

    const token = localStorage.getItem('token');

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user'));
        setUser(u);
    }, []);

    const fetchTasks = async () => {
        const res = await axios.get('http://localhost:5000/api/tasks', {
            headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
    };

    useEffect(() => {
        if (!token) return;
        fetchTasks();

        // Listen for new tasks
        socket.on('newTask', (task) => {
            setTasks((prev) => [...prev, task]);
        });
        socket.on('taskUpdated', (updatedTask) => {
            setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        });
        return () => {
            socket.off('newTask');
            socket.off('taskUpdated');
        };
    }, []);

    const addTask = async () => {
        try {
            await axios.post(`http://localhost:5000/api/tasks`,
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Task added successfully')
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch {
            toast.error('Fail to add task')
        }
    }

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Task deleted successfully')
            fetchTasks();
        } catch {
            toast.error('Fail to delete task')
        }
    }

    const updateTask = async (id, updatedFields) => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/${id}`,
                updatedFields,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
            toast.success('Task updated successfully')
        } catch {
            toast.error('Fail to update task')
        }
    };
    const toggleStatus = async (task) => {
        const newStatus = task.status === 'pending' ? 'completed' : 'pending';
        updateTask(task._id, { status: newStatus });
    };

    const handleDrop = async (taskId, newStatus) => {
        await axios.put(`http://localhost:5000/api/tasks/${taskId}`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchTasks(); //Refresh tasks
    }

    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
            toast.success('You are logout successfully')
        } catch {
            toast.error('Not able to logout error!!!')
        }
    };

    if (!user) return <div className="text-center p-10">Loading dashboard...</div>;

    return (
        <div className='min-h-screen bg-gray-100'>
            <Navebar user={user} logout={logout} />
            <Sidebar logout={logout} user={user} />
            <div className='md:hidden flex justify-between items-center p-4 bg-gray-800 text-white'>
                <h1 className='font-bold'>Dashboard</h1>
                <button onClick={() => setOpen(!open)}>☰</button>
            </div>
            {open && (
                <div
                    className='bg-gray-800 text-white md:hidden p-4'>
                    <Sidebar user={user} logout={logout} />
                </div>
            )}
            <div className='flex flex-col md:flex-row gap-4'>
                {['pending', 'in process', 'completed'].map((status) => (
                    <DroppableColum
                        key={status}
                        status={status}
                        tasks={tasks.filter((t) => t.status === status)}
                        onDrop={handleDrop}
                    />
                ))}
            </div>
            <div className='p-8'>
                <h2 className='font-bold text-2xl mb-4'>Welcome, {user.name}!</h2>

                <div className='mb-6'>
                    <input type="text"
                        placeholder='Task Title'
                        className='border rounded p-2 mr-2'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input type="text"
                        placeholder='Description'
                        className='border rounded p-2 mr-2'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                        onClick={addTask}
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
                    >
                        Add Task
                    </button>
                </div>
                <div className='flex flex-col md:flex-row gap-2 mb-4'>
                    <input
                        type="text"
                        placeholder='Search tasks...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='border rounded flex-1 p-2'
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className='border rounded p-2'
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {tasks
                        .filter((task) =>
                            task.title.toLowerCase().includes(search.toLowerCase()) ||
                            task.description.toLowerCase().includes(search.toLowerCase())
                        )
                        .filter((task) =>
                            filterStatus === 'all' ? true : task.status === filterStatus
                        )
                        .map((task) => (
                            <div key={task._id} className={`bg-white rounded p-4 shadow
                    ${task.status === 'completed' ? 'bg-green-100' : 'bg-white'}`}
                            >
                                <input
                                    type='text'
                                    value={task.title}
                                    onChange={(e) => {
                                        // Update title locally in tasks state
                                        setTasks(prev =>
                                            prev.map(t =>
                                                t._id === task._id ? { ...t, title: e.target.value } : t
                                            )
                                        );
                                    }}
                                    onBlur={(e) =>
                                        updateTask(task._id, { title: e.target.value })
                                    }

                                    className='font-bold border-b w-full mb-1'
                                />
                                <textarea
                                    value={task.description}
                                    onChange={(e) => {
                                        setTasks(prev =>
                                            prev.map(t =>
                                                t._id === task._id ? { ...t, description: e.target.value } : t
                                            )
                                        );
                                    }}
                                    onBlur={(e) =>
                                        updateTask(task._id, { description: e.target.value })
                                    }
                                    className='w-full rounded p-1 mb-2 border'
                                />
                                <p className='text-sm text-gray-500'>
                                    {task.user?.name} ({task.user?.role})
                                </p>
                                <div
                                    className='flex gap-2 mt-2'
                                >
                                    <button
                                        onClick={() => toggleStatus(task)}
                                        className={`px-3 py-1 rounded ${task.status === 'completed' ?
                                            'bg-yellow-300 text-white'
                                            : 'bg-gray-500 text-white'
                                            }`}
                                    >
                                        {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className='mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700'
                                    >
                                        Delete
                                    </button>
                                </div>
                                {/* Add comments  */}
                                <TaskComments socket={socket} taskId={task._id} currentUser={user?.name} />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;