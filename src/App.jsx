import React from 'react';
import { BrowserRouter as Router,Routes,Route , Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import {Toaster} from 'react-hot-toast';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import './App.css';

function App() {
  const token =localStorage.getItem('token');

  return (
    <>
      <Toaster position='top-right'/>
      <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route path='/' element={token ? <Dashboard/> :<Navigate to='/login'/> } />
          <Route path='/login' element={token?<Navigate to='/'/> :<Login/> } />
          <Route path='/register' element={<Register/>} />
        </Routes>
      </Router>
      </DndProvider>
    </>
  );
}

export default App;
