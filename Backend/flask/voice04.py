import subprocess

sound_file = 'C:/Final_Year/AI_Trainer/Backend/flask/voice_message_01.mp3'
subprocess.Popen(['cvlc', '--play-and-exit', sound_file])