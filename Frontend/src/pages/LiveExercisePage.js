import React, { useState, useEffect } from "react";
import CustomWebcam from "../components/CustomWebcam";
import { Box } from "@mui/material";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { isUserAuthenticated } from "../utils/authUtils";


const LiveExercisePage = () => {
    const userAuthenticatedbool = isUserAuthenticated();

    if (!userAuthenticatedbool) {
        return <Navigate to="/login" />;
    }

    return (
        <Box>
            <Navbar />
            <CustomWebcam />
            <Footer />
        </Box>
    )
};

export default LiveExercisePage;
