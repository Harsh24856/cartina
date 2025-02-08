from flask import request, jsonify
from flask import Flask
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import sqlite3

# Load environment variables
load_dotenv()

# Get API key from environment
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    raise ValueError("No Google API key found. Please set GOOGLE_API_KEY in .env file")

app = Flask(__name__)
CORS(app)

# Configure Google AI with your API key
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-pro')

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/get-profiles', methods=['GET'])
def get_profiles():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Fetch all saved roadmaps from the database
        cursor.execute('''
            SELECT id, technology, recommendations 
            FROM saved_roadmaps 
            ORDER BY id DESC
        ''')
        
        profiles = []
        for row in cursor.fetchall():
            profiles.append({
                'id': row['id'],
                'technology': row['technology'],
                'roadmap': row['recommendations']  # Map to 'roadmap' for frontend compatibility
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'profiles': profiles
        })
        
    except Exception as e:
        print(f"Error fetching profiles: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/modify-roadmap', methods=['POST'])
def modify_roadmap():
    try:
        data = request.json
        print("Received data:", data)  # Debug log
        
        # Validate required fields
        required_fields = ['id', 'updatedContent', 'technology', 'originalRoadmap']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400

        roadmap_id = data.get('id')
        modification_request = data['updatedContent']
        technology = data['technology']
        existing_roadmap = data['originalRoadmap']

        if not existing_roadmap:
            return jsonify({
                'success': False,
                'error': 'Original roadmap content is empty'
            }), 400

        # Create a prompt for the AI to modify the existing roadmap
        prompt = f"""
        Here is an existing learning roadmap for {technology}:

        {existing_roadmap}

        The user wants to modify this roadmap with the following request:
        "{modification_request}"

        Please update the existing roadmap based on this request. Keep the existing structure 
        and content, but modify it according to the user's request. Return the complete 
        modified roadmap while maintaining the same format.

        Important:
        - Keep all existing sections that aren't mentioned in the modification
        - Only modify the relevant parts based on the user's request
        - Maintain the same formatting and structure
        - If adding new content, make it blend naturally with existing content
        """

        print("Sending prompt to AI:", prompt)  # Debug log
        response = model.generate_content(prompt)
        modified_roadmap = response.text
        print("Received AI response:", modified_roadmap)  # Debug log

        return jsonify({
            'success': True,
            'modifiedRoadmap': modified_roadmap
        })

    except Exception as e:
        print(f"Error modifying roadmap: {str(e)}")
        import traceback
        traceback.print_exc()  # Print full error traceback
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Drop the existing table and create it with the correct schema
    conn = get_db_connection()
    conn.execute('DROP TABLE IF EXISTS saved_roadmaps')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS saved_roadmaps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            technology TEXT NOT NULL,
            recommendations TEXT NOT NULL
        )
    ''')
    conn.close()
    
    app.run(debug=True)
 