from flask import Flask, render_template, request, jsonify, Response

import cv2
import pose_detector

app = Flask(__name__)

def gen_frames(camera):
    while camera.isOpened():
        # Reads the camera frame
        success, frame = camera.read()
        if not success:
            break
        else:
            frame = pose_detector.predictPose(frame,'models/deadlift/deadlift.pkl')

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            # yield is used to generate the corresponding frames
            yield(b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    
    camera.release()
    cv2.destroyAllWindows()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    camera = cv2.VideoCapture(0)
    
    return Response(gen_frames(camera),mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)