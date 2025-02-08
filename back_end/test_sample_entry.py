from pymongo import MongoClient
from config import MONGO_URI, MONGO_OPTIONS
from datetime import datetime
from flask_bcrypt import Bcrypt

def push_sample_entries():
    try:
        print("Connecting to MongoDB...")
        client = MongoClient(MONGO_URI, **MONGO_OPTIONS)
        db = client['cartina']
        bcrypt = Bcrypt()
        
        # Sample user entry with all required fields
        sample_user = {
            "full_name": "Uday Salhan",
            "email": "uday@example.com",
            "password": bcrypt.generate_password_hash("test123").decode('utf-8'),
            "bio": "Student preparing for competitive exams",
            "joinDate": datetime.utcnow(),
            "avatar": None,
            "preferences": {
                "notifications": True,
                "theme": "light"
            }
        }
        
        print("\nAttempting to insert sample user...")
        user_result = db.users.insert_one(sample_user)
        
        if user_result.inserted_id:
            user_id = str(user_result.inserted_id)
            print(f"Successfully inserted user with ID: {user_id}")
            
            # Sample roadmap entry
            sample_roadmap = {
                "user_id": user_id,
                "exam_name": "JEE Advanced",
                "exam_date": "2024-05-15",
                "study_hours": 8,
                "class_level": "12th",
                "subject_preferences": ["Physics", "Mathematics", "Chemistry"],
                "recommendations": [
                    {
                        "subject": "Physics",
                        "topics": ["Mechanics", "Electromagnetism", "Optics"],
                        "priority": "High"
                    },
                    {
                        "subject": "Mathematics",
                        "topics": ["Calculus", "Algebra", "Coordinate Geometry"],
                        "priority": "High"
                    },
                    {
                        "subject": "Chemistry",
                        "topics": ["Physical Chemistry", "Organic Chemistry"],
                        "priority": "Medium"
                    }
                ],
                "progress": {
                    "completed_topics": [],
                    "current_topic": "Mechanics",
                    "completion_percentage": 0
                },
                "created_at": datetime.utcnow(),
                "last_updated": datetime.utcnow()
            }
            
            print("\nAttempting to insert roadmap...")
            roadmap_result = db.roadmaps.insert_one(sample_roadmap)
            
            if roadmap_result.inserted_id:
                print(f"Successfully inserted roadmap with ID: {roadmap_result.inserted_id}")
            
            # Verify the insertions
            print("\nVerifying inserted data...")
            
            # Retrieve and display user data
            inserted_user = db.users.find_one({"_id": user_result.inserted_id})
            print("\nUser Data:")
            print(f"Name: {inserted_user['full_name']}")
            print(f"Email: {inserted_user['email']}")
            print(f"Join Date: {inserted_user['joinDate']}")
            
            # Retrieve and display roadmap data
            inserted_roadmap = db.roadmaps.find_one({"user_id": user_id})
            print("\nRoadmap Data:")
            print(f"Exam: {inserted_roadmap['exam_name']}")
            print(f"Date: {inserted_roadmap['exam_date']}")
            print(f"Study Hours: {inserted_roadmap['study_hours']}")
            print(f"Subjects: {', '.join(inserted_roadmap['subject_preferences'])}")
            
            # Display collection statistics
            total_users = db.users.count_documents({})
            total_roadmaps = db.roadmaps.count_documents({})
            print(f"\nDatabase Statistics:")
            print(f"Total users: {total_users}")
            print(f"Total roadmaps: {total_roadmaps}")
            
        return True
        
    except Exception as e:
        print(f"\nError: {str(e)}")
        return False
    finally:
        print("\nClosing connection...")
        client.close()
        print("Connection closed.")

if __name__ == "__main__":
    push_sample_entries() 