from flask import Flask, request, jsonify
import numpy as np
import spacy
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
nlp = spacy.load('en_core_web_lg')

@app.route('/',methods=['POST'])
@cross_origin()
# ‘/’ URL is bound with hello_world() function.
def hello_world():
    content = request.json
    value = calculateSimilarity(content['input1'], content['input2'])
    result = checkMatch(value)
    data = {'input1': str(value), 'input2': result}
    return jsonify(data)

def calculateSimilarity(text1, text2):
    result = cosine_similarity([nlp(text1).vector],[nlp(text2).vector])
    value = result[0,0]
    print(type(value))
    return value

def checkMatch(value):
    if(value > 0.9):
        return "match"
    elif(value > 0.5):
        return "partial match"
    else:
        return "no match"
# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(port=8000, debug=True)