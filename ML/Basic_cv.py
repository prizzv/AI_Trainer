import cv2
import mediapipe as mp

mp_hands = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2)
cap = cv2.VideoCapture('biceps_curl_12.mp4')

while (cap.isOpened()):
    ret, image = cap.read()

    if not ret:
        break

    # print(1)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = mp_hands.process(image_rgb)
    # print(results)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            for landmark in hand_landmarks.landmark:
                height, width, _ = image.shape
                x, y = int(landmark.x * width), int(landmark.y * height)                

    cv2.imshow('MediaPipe Hands', image)

    if cv2.waitKey(15) & 0xFF == 27: 
        break

cap.release()
cv2.destroyAllWindows()
