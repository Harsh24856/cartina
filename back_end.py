from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store submissions in memory (you might want to use a database in production)
exam_submissions = []

@app.route('/api/submit-exam', methods=['POST'])
def submit_exam():
    try:
        data = request.json
        print("Received data:", data)  # Debug print
        
        # Check if data is None
        if not data:
            return jsonify({'error': 'No JSON data received'}), 400
        
        # Validate required fields with detailed error messages
        required_fields = ['input', 'date', 'hours']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        # Validate hours range
        try:
            hours = int(data['hours'])
            if not (2 <= hours <= 18):
                return jsonify({'error': f'Hours must be between 2 and 18, got {hours}'}), 400
        except ValueError:
            return jsonify({'error': f'Invalid hours value: {data["hours"]}'}), 400
        
        # Validate date format and value
        try:
            exam_date = datetime.strptime(data['date'], '%Y-%m-%d')
            if exam_date < datetime.now():
                return jsonify({'error': 'Exam date must be in the future'}), 400
        except ValueError:
            return jsonify({'error': f'Invalid date format. Expected YYYY-MM-DD, got: {data["date"]}'}), 400
        
        # Store the submission
        submission = {
            'exam_name': data['input'],
            'exam_date': data['date'],
            'study_hours': hours,
            'submitted_at': datetime.now().isoformat()
        }
        exam_submissions.append(submission)
        
        return jsonify({
            'message': 'Exam details submitted successfully',
            'submission': submission
        }), 201
        
    except Exception as e:
        print("Error processing request:", str(e))  # Debug print
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
