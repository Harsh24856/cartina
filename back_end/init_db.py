from pymongo import MongoClient
from config import MONGO_URI, DATABASE_NAME, MONGO_OPTIONS
import sys

def init_db():
    try:
        # Connect with options
        client = MongoClient(MONGO_URI, **MONGO_OPTIONS)
        
        # Test connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas!")
        
        db = client[DATABASE_NAME]
        
        # Create collections if they don't exist
        if 'users' not in db.list_collection_names():
            db.create_collection('users')
            # Create indexes
            db.users.create_index('email', unique=True)
            print("Created users collection with indexes")
        
        if 'exam_results' not in db.list_collection_names():
            db.create_collection('exam_results')
            # Create indexes
            db.exam_results.create_index('user_id')
            db.exam_results.create_index('exam_date')
            print("Created exam_results collection with indexes")

        if 'roadmaps' not in db.list_collection_names():
            db.create_collection('roadmaps')
            # Create indexes
            db.roadmaps.create_index('user_id')
            db.roadmaps.create_index('created_at')
            print("Created roadmaps collection with indexes")

        print("Database initialization completed successfully!")
        
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        sys.exit(1)
    finally:
        client.close()

if __name__ == "__main__":
    init_db() 