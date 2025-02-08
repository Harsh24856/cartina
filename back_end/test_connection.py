from pymongo import MongoClient
from config import MONGO_URI, MONGO_OPTIONS

def test_connection():
    try:
        print("Testing MongoDB connection...")
        print(f"Attempting to connect to: {MONGO_URI}")
        
        # Create client
        client = MongoClient(MONGO_URI, **MONGO_OPTIONS)
        
        # Test connection by accessing server info
        server_info = client.server_info()
        print("\nConnection successful!")
        print(f"MongoDB version: {server_info.get('version')}")
        
        # Get database
        db = client['cartina']
        
        # List collections
        collections = db.list_collection_names()
        print("\nExisting collections:", collections)
        
        return True
        
    except Exception as e:
        print(f"\nConnection failed: {str(e)}")
        return False
    finally:
        client.close()
        print("\nConnection closed.")

if __name__ == "__main__":
    test_connection() 