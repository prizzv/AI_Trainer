from flask import Blueprint

video_feed = Blueprint('video_feed', __name__,) 

from . import views
