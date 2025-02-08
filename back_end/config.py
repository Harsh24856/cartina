from dotenv import load_dotenv
import os

load_dotenv()

# Get MongoDB URI from environment variable
MONGO_URI = os.getenv('MONGO_URI')
if not MONGO_URI:
    raise ValueError("No MONGO_URI found in .env file")

DATABASE_NAME = 'cartina'

# MongoDB connection options for better security and reliability
MONGO_OPTIONS = {
    'retryWrites': True,
    'w': 'majority',
    'ssl': True,
    'connectTimeoutMS': 30000,
    'socketTimeoutMS': 30000
} 