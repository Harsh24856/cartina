from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/profile', methods=['GET'])
def get_profile():
    # Mock profile data
    profile = {
        'name': 'John Doe',
        'email': 'john@example.com',
        'bio': 'Software developer passionate about creating amazing applications.',
        'joinDate': '2024-01-01',
        'avatar': None
    }
    return jsonify(profile)

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    data = request.json
    # In a real app, you would update the profile in a database
    return jsonify(data)

@app.route('/api/save-exam-result', methods=['POST'])
def save_exam_result():
    data = request.json
    # In a real app, you would save this to a database
    return jsonify({"success": True, "message": "Exam result saved successfully"})

if __name__ == '__main__':
    app.run(debug=True) 