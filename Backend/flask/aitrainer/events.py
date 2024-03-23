from .extensions import socketio

# TODO: Implement this socket event

@socketio.on('connect')
def handle_connect(request):
    print('Client connected with client id:',request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
