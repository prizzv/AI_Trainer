import mediapipe as mp
import cv2
import numpy as np  

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

import csv
import os
import numpy as np
from matplotlib import pyplot as plt

def createCSV(fileName):
    landmarks = ['class']
    for val in range(1,33+1):
        landmarks += ['x{}'.format(val),'y{}'.format(val), 'z{}'.format(val), 'v{}'.format(val)]

    with open(fileName, mode='w', newline='')as f:
        csv_writer = csv.writer(f,delimiter = ',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        csv_writer.writerow(landmarks)

# createCSV('deadlift.csv')

def export_landmark(results,action, csvPath):
    try:
        keypoints = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten().tolist() #Converted to a list
        print(keypoints)
        keypoints.insert(0,action)
        
        with open(csvPath, mode='a', newline='') as f:
            csv_writer = csv.writer(f,delimiter = ',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            csv_writer.writerow(keypoints)
    except Exception as e:
        print(e)
        pass

def annotateCSV(videoPath, csvPath):
    cap = cv2.VideoCapture(videoPath) #name of the video
    #Initiate holistic model
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret,frame = cap.read()
            if not ret:
                print("Can't receive frame (stream end?). Exiting ...")
                break
            #Recolor Feed
            image = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
            image.flags.writeable = False

            #Make detection
            results = pose.process(image)

            #Recolor back to BGR for rendering
            image.flags.writeable = True
            image = cv2.cvtColor(image,cv2.COLOR_RGB2BGR)

            #Render detections
            mp_drawing.draw_landmarks(image,results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                    mp_drawing.DrawingSpec(color=(245,117,66),thickness=2,circle_radius=2),
                                    mp_drawing.DrawingSpec(color=(245,66,230),thickness=2,circle_radius=2)
                                    )

            k = cv2.waitKey(1)
            if k== 117:
                export_landmark(results,'up', csvPath)
            elif k== 100:
                export_landmark(results,'down', csvPath)

            cv2.imshow('Mediapipe Feed',image)

            if cv2.waitKey(10) & 0xFF == ord('q'):
                break

    cap.release() 
    cv2.destroyAllWindows()

def runAnnotation(datasetDir, csvPath):
    # looping through all the training video files for annotation
    for file in os.listdir('dataset/deadlift'):
        
        if file.endswith('.mp4'):
            print(file)
            annotateCSV(f"{datasetDir}/{file}", csvPath)

runAnnotation('dataset/deadlift', 'deadlift.csv')
