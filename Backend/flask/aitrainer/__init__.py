from flask import Flask;
from aitrainer.events import socketio

from aitrainer.blueprints.mlModels import mlModels # Import the routes below the app 
from aitrainer.blueprints.video_feed import video_feed
# from aitrainer.config import config

def create_app():
    app = Flask(__name__)
    app.config.from_object("config")
    
    register_blueprints(app)
    socketio.init_app(app)

    return app

def register_blueprints(app):
        """Register blueprints with the flask application"""
        app.register_blueprint(mlModels, url_prefix = '/model')
        app.register_blueprint(video_feed, url_prefix = '/video_feed')
        
