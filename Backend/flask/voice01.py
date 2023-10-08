import pygame

pygame.mixer.init()

test_01 = pygame.mixer.Sound("voice_message.mp3")

test_01.play()

pygame.time.wait(10000) 

pygame.quit()
