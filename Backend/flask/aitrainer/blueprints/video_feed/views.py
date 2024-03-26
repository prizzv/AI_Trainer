from flask import  request,  Response

import cv2
import time
from ... import pose_detector
from . import video_feed

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
            if modelPath == 'aitrainer/models/deadlift/deadlift.pkl':
                frame = pose_detector.predictPose(frame, modelPath, 'aitrainer/models/deadlift/lean.pkl', 'aitrainer/models/deadlift/hips.pkl')
            else :
                frame = pose_detector.predictPose(frame, modelPath, None, None)

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            # yield is used to generate the corresponding frames
            yield(b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
        if elapsed_time >= seconds_to_run:
            break
    
    camera.release()
    cv2.destroyAllWindows()



@video_feed.route('/')
def video_feed():
    
    time = int(request.args.get('time'))
    modelName = request.args.get('modelname')

    if(modelName == 'deadlift'):
        modelPath = 'aitrainer/models/deadlift/deadlift.pkl'
    elif(modelName == 'push-up'):
        modelPath = 'aitrainer/models/push-up/push-up.pkl'
    
    camera = cv2.VideoCapture(0)
    
    return Response(gen_frames(camera, time, modelPath),mimetype='multipart/x-mixed-replace; boundary=frame')
