import mediapipe as mp
import cv2
import numpy as np
import pickle
import pandas as pd
import voice01

def predictPose(frame, modelPath, leanPath=None, hipsPath=None):
    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose

    with open(modelPath,'rb') as f:
        model = pickle.load(f)

    if( leanPath != None):
        with open(leanPath,'rb') as f:
            leanModel = pickle.load(f)

    if( hipsPath != None):
        with open(hipsPath,'rb') as f:
            hipsModel = pickle.load(f)

    counter = 0
    current_stage = ''
    #Initiate holistic model
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:

        #Recolor Feed
        image = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        #Make detections
        results = pose.process(image)

        #Recolor back to BGR
        image.flags.writeable = True
        image = cv2.cvtColor(image,cv2.COLOR_RGB2BGR)

        #Extract landmarks
        mp_drawing.draw_landmarks(image,results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                mp_drawing.DrawingSpec(color=(245,117,66),thickness=2,circle_radius=2),
                                mp_drawing.DrawingSpec(color=(245,66,230),thickness=2,circle_radius=2)
                                )

        landmarks = ['class']
        for val in range(1,33+1):
            landmarks += ['x{}'.format(val),'y{}'.format(val), 'z{}'.format(val), 'v{}'.format(val)]

        try:
            row = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten().tolist()
            X = pd.DataFrame([row],columns=landmarks[1:])
            body_language_class = model.predict(X)[0]
            body_language_prob = model.predict_proba(X)[0]
            print('body model',body_language_class,body_language_prob)
            
            # lean_class = leanModel.predict(X)[0]
            # # lean_proba = leanModel.predict_proba(X)[0]
            # print('lean model', lean_class)

            # if(lean_class == 'right'):
                # voice01.voiceAssistant("voice_message_02.mp3")
                # return image
            # elif(lean_class == 'left'):
                # voice01.voiceAssistant("voice_message_01.mp3")
                # return image

            

            if body_language_class == 'down' and body_language_prob[body_language_prob.argmax()] >= 0.7:
                current_stage = 'down'
            elif current_stage == 'down' and body_language_class == 'up' and body_language_prob[body_language_prob.argmax()] >= 0.7:
                current_stage = 'up'
                counter += 1
                print(current_stage, counter)

            #Get status box
            cv2.rectangle(image,(0,0),(225,73),(245,117,16),-1)

            #Display Class
            cv2.putText(image,'CLASS',(15,12),cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,0,0),1,cv2.LINE_AA)
            cv2.putText(image,body_language_class.split(' ')[0],(90,40),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),2,cv2.LINE_AA)

            #Display Probability
            cv2.putText(image,'PROB',(15,12),cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,0,0),1,cv2.LINE_AA)
            cv2.putText(image,str(round(body_language_prob[np.argmax(body_language_prob)],2)),(10,40),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),2,cv2.LINE_AA)

            #Display Counter
            cv2.putText(image,'COUNTER',(15,12),cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,0,0),1,cv2.LINE_AA)
            cv2.putText(image,str(counter),(175,40),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),2,cv2.LINE_AA)
        
        except Exception as e:
            print(e)
            pass
    
        return image