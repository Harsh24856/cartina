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
            SELECT id, technology, roadmap 
            FROM saved_roadmaps 
            ORDER BY id DESC
        ''')
        
        profiles = []
        for row in cursor.fetchall():
            profiles.append({
                'id': row['id'],
                'technology': row['technology'],
                'roadmap': row['roadmap']
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
        original_roadmap = data['originalRoadmap']
        new_topics = data['newTopics']
        technology = data['technology']
        roadmap_id = data.get('id')

        prompt = f"""
        I have a learning roadmap for {technology}:
        {original_roadmap}
        
        I need to modify this roadmap to include or focus more on these topics:
        {new_topics}
        
        Please provide an updated roadmap that incorporates these topics while maintaining the overall structure and flow.
        The response should be well-formatted and easy to read.
        """

        response = model.generate_content(prompt)
        modified_roadmap = response.text
        
        # Update the roadmap in the database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE saved_roadmaps 
            SET roadmap = ? 
            WHERE id = ?
        ''', (modified_roadmap, roadmap_id))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'modifiedRoadmap': modified_roadmap
        })

    except Exception as e:
        print(f"Error modifying roadmap: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Create tables if they don't exist
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS saved_roadmaps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            technology TEXT NOT NULL,
            roadmap TEXT NOT NULL
        )
    ''')
    conn.close()
    
    app.run(debug=True)
 