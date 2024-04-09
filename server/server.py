from flask import Flask, request, jsonify
from flask_cors import CORS
from AI_WORK import generate_answer

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:5001"]}})

# Enable CORS for all routes
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/predict', methods=['POST'])
def predict():
    # Extract user question from request data
    user_question = request.data.decode('utf-8')

    # Generate answer based on the user question
    response = generate_answer(user_question)

    # Assuming response is a dictionary
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
    print("Flask Server is running...")
