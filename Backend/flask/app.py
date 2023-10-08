from flask import Flask, render_template, request, jsonify, Response

import cv2

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


camera = cv2.VideoCapture(0)

def gen_frames():
    while True:
        # Reads the camera frame
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            
            # yield is used to generate the corresponding frames
            yield(b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')



@app.route('/video_feed')
def video_feed():
    pass
    
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)