from flask import Blueprint

mlModels = Blueprint('mlModels', __name__, template_folder='templates', static_folder='static') 

from . import views
