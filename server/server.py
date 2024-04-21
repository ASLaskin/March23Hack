from flask import Flask, request, jsonify
from AI_WORK import generate_answer

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Assuming JSON data is sent from the frontend
    # Process data using your AI function
    response = generate_answer(data)
    # Store data in MongoDB
    # mongo.db.collection.insert_one(response)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
    print("Flask Server is running...")
