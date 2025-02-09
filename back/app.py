from flask import request, jsonify
from flask import Flask
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import sqlite3

# Load environment variables
load_dotenv()

# Configure Google AI with your API key
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    raise ValueError("No Google API key found. Please set GOOGLE_API_KEY in .env file")

genai.configure(api_key=api_key)

app = Flask(__name__)
# Configure CORS properly
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

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
        print("Received data:", data)
        
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

        prompt = f"""
        I have a study roadmap for {technology}. The current roadmap is:

        {existing_roadmap}

        The user wants to modify it with this request:
        {modification_request}

        Please provide an updated version of the roadmap that incorporates these changes.
        Maintain the same format and structure as the original roadmap.
        """

        response = model.generate_content(prompt)
        modified_roadmap = response.text

        # Save the modified roadmap to the database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Update the recommendations column for the specific roadmap
        cursor.execute('''
            UPDATE saved_roadmaps 
            SET recommendations = ? 
            WHERE id = ?
        ''', (modified_roadmap, roadmap_id))
        
        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'modifiedRoadmap': modified_roadmap
        })

    except Exception as e:
        print(f"Error in modify_roadmap: {str(e)}")  # Debug log
        import traceback
        traceback.print_exc()  # Print full stack trace
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
    
    # Update the host and port configuration
    app.run(debug=True, port=5001)  # Changed from 5000 to 5001
 