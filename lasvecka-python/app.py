from flask import Flask, jsonify
from flask_cors import CORS
from waitress import serve
import json

# configuration
DEBUG = False

# init app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

# return contents of data.txt as a json object
@app.route('/getData')
def read_json():
    with open('data.txt', 'r') as data_file:
        return jsonify(eval(data_file.read()))

# http://localhost:5000
if __name__ == '__main__':
    # Dev purposes only
    # app.run(host="0.0.0.0")

    # For prod
    serve(app, listen='0.0.0.0:5000')
