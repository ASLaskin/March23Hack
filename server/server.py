from flask import Flask, request, jsonify
from updated_AI import AI

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Get data sent from frontend
    user_input = data.get('userInput')  # Extract user input from data
    # Process data using your AI function
    response = AI(user_input)
    return jsonify({'result': response})  # Send response back to frontend

if __name__ == '__main__':
    app.run(debug=True)