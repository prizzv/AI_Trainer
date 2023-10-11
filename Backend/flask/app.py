from flask import Flask, render_template, request, jsonify, Response
import time

import cv2
import pose_detector

app = Flask(__name__)
camera = cv2.VideoCapture(0)

def gen_frames():
    while True:
        # Reads the camera frame
        success, frame = camera.read()
        if not success:
            break
        else:
            frame = pose_detector.predictPose(frame,'models/deadlift/deadlift.pkl', 'models/deadlift/lean.pkl', 'models/deadlift/hips.pkl')

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            # yield is used to generate the corresponding frames
            yield(b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
        if elapsed_time >= seconds_to_run:
            break
    
    camera.release()
    cv2.destroyAllWindows()


@app.route('/video_feed')
def video_feed():
    time = int(request.args.get('time'))
    print("video_feed", time)
    camera = cv2.VideoCapture(0)
    
    return Response(gen_frames(camera, time),mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)