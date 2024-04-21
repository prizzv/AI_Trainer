import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import './App.css';
import ExerciseDetail from './pages/ExerciseDetail';
import LiveExercisePage from './pages/LiveExercisePage'
import Home from './pages/Home';

import LoginPage from './pages/LoginForm/LoginForm';
import SignupPage from './pages/Signup/Signup';

const App = () => {
  const location = useLocation();
  const showBackground = location.pathname === '/login' || location.pathname === '/signup';

  return (

    <Box width="400px" sx={{ width: { xl: '1488px' } }} m="auto" className={`app ${showBackground ? 'with-Background' : ''}`}>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/exercise/live" element={<LiveExercisePage />} />

        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>

      </Routes>

    </Box>
  );
}

export default App;
