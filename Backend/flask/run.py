from aitrainer import create_app
from aitrainer.extensions import socketio

app = create_app()
# NOTE: there seems to be no difference between running the app with socketio.run() and app.run() in this case

# app.run(debug=app.config.get("FLASK_DEBUG"))
socketio.run(app=app,debug=app.config.get("FLASK_DEBUG"))
