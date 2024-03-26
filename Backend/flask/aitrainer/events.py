from aitrainer.pose_detector import predictPose
from .extensions import socketio

from flask_socketio import emit, send

@socketio.on('connect')
def handle_connect(request):
    
    print('Client connected to socket.io')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('video_stream')
def handle_video_stream(data):
    # print(data)
    # frame = predictPose(data, "aitrainer/models/deadlift/deadlift.pkl", None, None)
    emit('video_stream', data, broadcast=True)