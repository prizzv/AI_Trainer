from flask import Flask, render_template, Response
import mediapipe as mp
import cv2
import numpy as np
import pickle
import pandas as pd
from multiprocessing import Process

app = Flask(__name__)
model = pickle.load(open('deadlift.pkl', 'rb'))

@app.route('/')
def index():
    return render_template("index.html")

def detect_pose(cap, model):
    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose

    counter = 0
    current_stage = ''

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = pose.process(image)

            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                    mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                                    mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
                                    )

            try:
                row = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten().tolist()
                X = pd.DataFrame([row], columns=landmarks[1:])
                body_language_class = model.predict(X)[0]
                body_language_prob = model.predict_proba(X)[0]

                if body_language_class == 'down' and body_language_prob[body_language_prob.argmax()] >= 0.7:
                    current_stage = 'down'
                elif current_stage == 'down' and body_language_class == 'up' and body_language_prob[body_language_prob.argmax()] >= 0.7:
                    current_stage = 'up'
                    counter += 1

                # Get status box
                cv2.rectangle(image, (0, 0), (225, 73), (245, 117, 16), -1)

                # Display Class
                cv2.putText(image, 'CLASS', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                cv2.putText(image, body_language_class.split(' ')[0], (90, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

                # Display Probability
                cv2.putText(image, 'PROB', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                cv2.putText(image, str(round(body_language_prob[np.argmax(body_language_prob)], 2)), (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

                # Display Counter
                cv2.putText(image, 'COUNTER', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                cv2.putText(image, str(counter), (175, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

            except Exception as e:
                print(e)
                pass

            cv2.imshow('Raw Webcam Feed', image)

            if cv2.waitKey(10) & 0xFF == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()

@app.route('/pose_detect')
def predict_pose_route():
    cap = cv2.VideoCapture(0)
    
    # Start detect_pose in a separate process
    p = Process(target=detect_pose, args=(cap, model))
    p.start()

    return render_template("pose_detect.html")

@app.route('/video_feed')
def video_feed():
    cap = cv2.VideoCapture(0)
    return Response(generate_frames(cap), mimetype='multipart/x-mixed-replace; boundary=frame')

def generate_frames(cap):
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

if __name__ == '__main__':
    app.run(debug=True)
