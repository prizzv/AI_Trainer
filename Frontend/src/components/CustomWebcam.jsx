import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useSocket } from '../context/SocketProvider';
import bringLegsCloser from '../assets/audio/bring_legs_closer.mp3';
import spreadYourLegs from '../assets/audio/spread_your_legs.mp3';
import leanLeft from '../assets/audio/lean_to_left.mp3';
import leanRight from '../assets/audio/lean_to_right.mp3';

const App = () => {
  const webcamRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [capturedFrame, setCapturedFrame] = useState();
  const [counter, setCounter] = useState(0);
  const [leanClass, setLeanClass] = useState('');  // [left, right, neutral]
  const [hipsClass, setHipsClass] = useState('');  // [narrow, wide, neutral]
  const [leanTick, setLeanTick] = useState(0);
  const [hipsTick, setHipsTick] = useState(0);

  const socket = useSocket();

  const contraints = {
    video: {
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 720, max: 1080 },
      facingMode: "user",
    }
  }

  const handlevideoStream = useCallback(async (data) => {
    const { dataURL, counter } = data;

    setCounter(counter);
    setCapturedFrame(dataURL);
  })

  const handleExtraClassData = useCallback(async (data) => {
    const { leanClass, hipsClass } = data;

    setLeanClass(leanClass); // set the leanClassData state
    setHipsClass(hipsClass); // set the hipsClassData state
  })

  useEffect(() => {
    if (isRecording) {
      const id = setInterval(captureFrame, 110); // Ideal interval 
      // const id = setInterval(captureFrame, 4000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => clearInterval(intervalId);
  }, [isRecording]);

  useEffect(() => {
    socket.on('video_stream', handlevideoStream);
    socket.on('extraClasses', handleExtraClassData);

    const leanTimerId = setInterval(() => {
      setLeanTick(prevTick => prevTick + 1); // increment 'tick' every 5 seconds
    }, 7000);

    const hipsTimerId = setInterval(() => {
      setHipsTick(prevTick => prevTick + 1); // increment 'tick' every 30 seconds
    }, 10000);


    return () => {
      socket.off('video_stream', handlevideoStream);
      socket.off('extraClasses', handleExtraClassData);
      clearInterval(leanTimerId);
      clearInterval(hipsTimerId);
    }
  }, []);

  useEffect(() => {
    console.log("LeanClass " + leanClass + " HipsClass " + hipsClass);

    const toLeftAudio = new Audio(leanLeft);
    const toRightAudio = new Audio(leanRight);

    if (leanClass === 'left') {
      toRightAudio.play();
    } else if (leanClass === 'right') {
      toLeftAudio.play();
    }
    setLeanClass("");

  }, [leanTick]); // re-run the effect when 'playSound' changes

  useEffect(() => {

    const spreadLegsAudio = new Audio(spreadYourLegs);
    const bringLegsCloserAudio = new Audio(bringLegsCloser);

    if (hipsClass === 'wide') {
      bringLegsCloserAudio.play();
    } else if (hipsClass === 'narrow') {
      spreadLegsAudio.play();
    }
    setHipsClass("");

  }, [hipsTick]); // re-run the effect when 'playSound' changes

  const captureFrame = () => {
    if (webcamRef.current) {
      const canvas = webcamRef.current.getCanvas();
      if (canvas) {
        const dataURL = canvas.toDataURL('image/png');
        const data = {
          modelName: 'deadlift',
          counter,
          dataURL
        };

        // Do the socket call here to send the dataURL to the server
        socket.emit('video_stream', data);
      } else {
        console.log("Canvas is null")
      }
    }
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={contraints}
        onUserMedia={() => setIsRecording(true)}
      />
      <button onClick={() => setIsRecording(!isRecording)}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {(capturedFrame != null) ? <img src={capturedFrame} alt="captured frame" /> : null}
      <div>
        counter: {counter}

      </div>

    </div>
  );
};

export default App;
