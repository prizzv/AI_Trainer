from aitrainer.pose_detector import predictPose
from .extensions import socketio

from flask_socketio import emit
import base64
import cv2 
import numpy as np 

@socketio.on('connect')
def handle_connect(request):
    
    print('Client connected to socket.io')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('video_stream')
def handle_video_stream(dataUrl):
    frame = convertDataURlToFrame(dataUrl)
    
    convertedFrame = predictPose(frame, "aitrainer/models/deadlift/deadlift.pkl", None, None)
    convertedDataUrl = convertFrameToDataUrl(convertedFrame)

    emit('video_stream', convertedDataUrl, broadcast=True)


def convertDataURlToFrame(dataUrl):
    # Extract the base64-encoded image data from the data URL
    image_data = base64.b64decode(dataUrl.split(',')[1])

    # Convert the image data to a NumPy array
    image_array = np.frombuffer(image_data, np.uint8)

    # Decode the NumPy array into an OpenCV image
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    
    return image 
    
def convertFrameToDataUrl(frame):
    
    # Convert the image to bytes
    image_bytes = cv2.imencode('.png', frame)[1].tobytes()

    # Encode the bytes as base64
    base64_encoded = base64.b64encode(image_bytes).decode('utf-8')

    # Create the data URL with the appropriate header
    dataURL = 'data:image/png;base64,' + base64_encoded
    
    return dataURL