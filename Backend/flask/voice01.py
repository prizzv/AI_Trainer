import subprocess

sound_file = "voice_message_01.mp3"
subprocess.Popen(['cvlc', '--play-and-exit', sound_file])