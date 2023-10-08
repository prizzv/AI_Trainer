from pydub import AudioSegment
from playsound import playsound

# Convert MP3 to WAV
audio = AudioSegment.from_mp3("voice_message.mp3")
audio.export("voice_message.wav", format="wav")

# Play the WAV file
playsound("voice_message.wav")
