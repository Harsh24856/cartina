from pymongo import MongoClient
from config import MONGO_URI, MONGO_OPTIONS
from flask_bcrypt import Bcrypt
from datetime import datetime
import sys

def seed_database():
    try:
        print("Starting database seeding process...")
        print(f"Connecting to MongoDB at: {MONGO_URI}")
        
        # Initialize Flask-Bcrypt for password hashing
        bcrypt = Bcrypt()
        
        # Connect to MongoDB with explicit database name
        client = MongoClient(MONGO_URI, **MONGO_OPTIONS)
        db = client['cartina']  # Explicitly specify database name
        
        print("Connected to MongoDB successfully!")
        
        # Sample users data
        users = [
            {
                "full_name": "Test User",
                "email": "test@example.com",
                "password": bcrypt.generate_password_hash("test123").decode('utf-8'),
                "bio": "Test account",
                "joinDate": datetime.utcnow(),
                "avatar": None
            },
            {
                "full_name": "Demo User",
                "email": "demo@example.com",
                "password": bcrypt.generate_password_hash("demo123").decode('utf-8'),
                "bio": "Demo account",
                "joinDate": datetime.utcnow(),
                "avatar": None
            }
        ]
        
        print("\nAttempting to insert users...")
        
        # Insert users and store their IDs
        user_ids = {}
        for user in users:
            try:
                # Check if user already exists
                existing_user = db.users.find_one({"email": user["email"]})
                if not existing_user:
                    result = db.users.insert_one(user)
                    user_ids[user["email"]] = result.inserted_id
                    print(f"Successfully created user: {user['full_name']} with ID: {result.inserted_id}")
                else:
                    user_ids[user["email"]] = existing_user["_id"]
                    print(f"User already exists: {user['full_name']} with ID: {existing_user['_id']}")
            except Exception as e:
                print(f"Error inserting user {user['email']}: {str(e)}")
                raise

        print("\nAttempting to insert roadmaps...")
        
        # Sample roadmaps data
        roadmaps = [
            {
                "user_id": str(user_ids["test@example.com"]),
                "exam_name": "JEE Advanced",
                "exam_date": "2024-05-15",
                "study_hours": 8,
                "class_level": "12th",
                "recommendations": "1. Focus on Physics\n2. Practice Math daily\n3. Review Chemistry weekly",
                "created_at": datetime.utcnow()
            },
            {
                "user_id": str(user_ids["demo@example.com"]),
                "exam_name": "NEET",
                "exam_date": "2024-06-20",
                "study_hours": 10,
                "class_level": "12th",
                "recommendations": "1. Biology focus\n2. Daily MCQ practice\n3. Regular revisions",
                "created_at": datetime.utcnow()
            }
        ]
        
        # Insert roadmaps
        for roadmap in roadmaps:
            try:
                existing_roadmap = db.roadmaps.find_one({
                    "user_id": roadmap["user_id"],
                    "exam_name": roadmap["exam_name"]
                })
                if not existing_roadmap:
                    result = db.roadmaps.insert_one(roadmap)
                    print(f"Successfully created roadmap for exam: {roadmap['exam_name']} with ID: {result.inserted_id}")
                else:
                    print(f"Roadmap already exists for: {roadmap['exam_name']}")
            except Exception as e:
                print(f"Error inserting roadmap for {roadmap['exam_name']}: {str(e)}")
                raise

        # Verify data was inserted
        user_count = db.users.count_documents({})
        roadmap_count = db.roadmaps.count_documents({})
        
        print("\nDatabase Verification:")
        print(f"Total users in database: {user_count}")
        print(f"Total roadmaps in database: {roadmap_count}")
        
        print("\nDatabase seeded successfully!")
        print("\nSample Login Credentials:")
        print("1. Email: test@example.com, Password: test123")
        print("2. Email: demo@example.com, Password: demo123")
        
    except Exception as e:
        print(f"\nError seeding database: {str(e)}")
        sys.exit(1)
    finally:
        print("\nClosing database connection...")
        client.close()
        print("Database connection closed.")

if __name__ == "__main__":
    seed_database() 