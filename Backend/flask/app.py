from flask import Flask, render_template, request, jsonify, Response
import time

import cv2
import pose_detector

app = Flask(__name__)

@app.route('/model/deadlift')
def deadliftModelPage():
    time = request.args.get('time')
    userName = request.args.get('userName')

    return render_template('index.html',time=time, userName=userName, model='deadlift')

@app.route('/model/push-up')
def pushUpModelPage():
    time = request.args.get('time')
    userName = request.args.get('userName')

    return render_template('index.html',time=time, userName=userName, model='push-up')

def gen_frames(camera, seconds_to_run, modelPath):
    start_time = time.time()

    while camera.isOpened():
        current_time = time.time()
        elapsed_time = current_time - start_time

        # Reads the camera frame
        success, frame = camera.read()
        if not success:
            break
        else:
            if modelPath == 'models/deadlift/deadlift.pkl':
                frame = pose_detector.predictPose(frame, modelPath, 'models/deadlift/lean.pkl', 'models/deadlift/hips.pkl')
            else :
                frame = pose_detector.predictPose(frame, modelPath)

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
    modelName = request.args.get('modelname')

    if(modelName == 'deadlift'):
        modelPath = 'models/deadlift/deadlift.pkl'
    elif(modelName == 'push-up'):
        modelPath = 'models/push-up/push-up.pkl'
    
    camera = cv2.VideoCapture(0)
    
    return Response(gen_frames(camera, time, modelPath),mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)