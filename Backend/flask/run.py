from aitrainer import create_app
from aitrainer.extensions import socketio

app = create_app()
app.run(debug=app.config.get("FLASK_DEBUG"))

# socketio.run(app=app,debug=app.config.get("FLASK_DEBUG"), host="0.0.0.0", port=5555)
