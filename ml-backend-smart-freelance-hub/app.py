from flask import Flask, request, jsonify
from pymongo import MongoClient
import numpy as np
import spacy
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
nlp = spacy.load('en_core_web_lg')

#Database
client = MongoClient("mongodb://localhost:27017/")
db = client["SmartFreelanceHub"]  # Replace with your database name
users_collection = db["Users"]

@app.route('/',methods=['POST'])
@cross_origin()
# ‘/’ URL is bound with hello_world() function.
def recommendation():
    content = request.json
    requirement = content["requirements"]
    users = get_all_userskills()
    result = []
    for user in users:
        user_skills = user['skills']        
        value = calculateSimilarity(requirement.lower(), user_skills.lower())
        if(value > 0) : result.append({
                'user': user,
                'similarity_value': float(value)
            })
    result.sort(key=lambda x: x['similarity_value'], reverse=True)
    return jsonify(result)

@app.route('/match',methods=['POST'])
@cross_origin()
def match():
    content = request.json
    value = calculateSimilarity(content['input1'], content['input2'])
    result = checkMatch(value)
    data = {'Match Value': str(value), 'Result': result}
    db.Flask.insert_one({'Match Value': str(value), 'Result': result})
    return jsonify(data)

@app.route('/users', methods=['GET'])
def get_all_users():
    users = list(users_collection.find())
    
    # Convert the ObjectId to string to make it JSON serializable
    for user in users:
        user['_id'] = str(user['_id'])
    #app.logger.info(users)
    return jsonify(users)

@app.route('/usersSkill', methods=['GET'])
def get_all_userskills():
    users = list(users_collection.find({"accountType": {"$in": ["Freelancer", "Both"]}}, {"_id" : 0, "accountType": 1, "email" : 1,"skills" : 1}))
    
    #app.logger.info(users)
    return users

def calculateSimilarity(text1, text2):
    result = cosine_similarity([nlp(text1).vector],[nlp(text2).vector])
    value = result[0,0]
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