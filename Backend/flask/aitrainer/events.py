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
def handle_video_stream(data):
    dataURL = data.get('dataURL')
    modelName = data.get('modelName')

    frame = convertDataURlToFrame(dataURL)

    convertedFrame = None
    if(modelName == "deadlift"):
        convertedFrame, newCounter = predictPose(frame, "aitrainer/models/deadlift/deadlift.pkl", "aitrainer/models/deadlift/lean.pkl", "aitrainer/models/deadlift/hips.pkl")        
    else:
        convertedFrame = predictPose(frame, "aitrainer/models/push-up/push-up.pkl", None, None)

    if convertedFrame is None:
        raise("Error in converting frame")
        
    convertedDataUrl = convertFrameToDataUrl(convertedFrame)

    newData = {
        'dataURL': convertedDataUrl,
        'counter': newCounter
    }

    emit('video_stream', newData, broadcast=True)


def convertDataURlToFrame(dataURL):
    # Extract the base64-encoded image data from the data URL
    image_data = base64.b64decode(dataURL.split(',')[1])

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