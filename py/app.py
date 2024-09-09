from flask import Flask, jsonify

app = Flask(__name__)

# Define a route for the API
@app.route('/api', methods=['GET'])
def api():
    # Example JSON response
    return jsonify({
        'message': 'Hello from the Python Flask server!'
    })

# Start the Flask server on localhost:5000
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
