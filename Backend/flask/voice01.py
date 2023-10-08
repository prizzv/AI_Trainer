import pygame

def voiceAssistant(messagePath):
    pygame.mixer.init()

    test_01 = pygame.mixer.Sound(messagePath)

    test_01.play()

    pygame.time.wait(10000)

    pygame.quit()
