import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useSocket } from '../context/SocketProvider';

const App = () => {
  const webcamRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [capturedFrame, setCapturedFrame] = useState();
  const [counter, setCounter] = useState(0);

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
  }, [])

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
    return () => socket.off('video_stream', handlevideoStream);
  }, []);

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
