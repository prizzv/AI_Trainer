from flask import Flask;
from flask_socketio import SocketIO, emit

app = Flask(__name__)

from aitrainer import routes # Import the routes below the app 