import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import { AuthProvider, AuthContext } from './pages/AuthContext';

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path='/' element={user ? <Dashboard /> : <Navigate to='/login' />} />
      <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster position='top-right' />
      <DndProvider backend={HTML5Backend}>
        <Router>
          <AppRoutes />
        </Router>
      </DndProvider>
    </AuthProvider>
  );
}

export default App;