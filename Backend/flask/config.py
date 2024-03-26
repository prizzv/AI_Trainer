import os 

from dotenv import load_dotenv

load_dotenv()

FLASK_DEBUG = os.environ.get("FLASK_DEBUG", False)

#NOTE: The above can also be done but the below allows for more configuration options
# currently still using the above method

# class Config(object):
#     FLASK_DEBUG = False
#     TESTING = False

#     SECRET_KEY= 'randomsecret'

# class ProductionConfig(Config):
#     FLASK_DEBUG = False

# class DevelopemntConfig(Config):
#     FLASK_DEBUG = True
#     TESTING = True

# class TestingConfig(Config):
#     FLASK_DEBUG = True
#     TESTING = True
