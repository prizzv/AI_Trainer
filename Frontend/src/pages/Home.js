import React, { useState } from 'react';
import { Box } from '@mui/material';

import Exercises from '../components/Exercises';
import SearchExercises from '../components/SearchExercises';
import HeroBanner from '../components/HeroBanner';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { isUserAuthenticated } from '../utils/authUtils';

const Home = () => {
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState('all');

  const userAuthenticatedbool = isUserAuthenticated();

  if (!userAuthenticatedbool) {
    return <Navigate to="/login" />;
  }

  return (

    <Box>
      <Navbar />
      <HeroBanner />
      <SearchExercises setExercises={setExercises} bodyPart={bodyPart} setBodyPart={setBodyPart} />
      <Exercises setExercises={setExercises} exercises={exercises} bodyPart={bodyPart} />
      <Footer />
    </Box>
  );
};

export default Home;
