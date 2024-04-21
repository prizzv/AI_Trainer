import React, { useState, useEffect } from "react";
import CustomWebcam from "../components/CustomWebcam";
import { Box } from "@mui/material";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const LiveExercisePage = () => {
    return (
        <Box>
            <Navbar />
            <CustomWebcam />
            <Footer />
        </Box>
    )
};

export default LiveExercisePage;
