import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';

import './App.css';
import ExerciseDetail from './pages/ExerciseDetail';
import LiveExercisePage from './pages/LiveExercisePage'
import Home from './pages/Home';

import LoginPage from './pages/LoginForm/LoginForm';
import SignupPage from './pages/Signup/Signup';
import ErrorPage from './pages/ErrorPage';

const App = () => {
  return (
    <Box width="400px" sx={{ width: { xl: '1488px' } }} m="auto">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/exercise/live" element={<LiveExercisePage />} />

        { /*Auth Routes*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        { /*Error Route*/}
        <Route path="*" element={<ErrorPage />} />
      </Routes>

    </Box>
  );
}

export default App;
