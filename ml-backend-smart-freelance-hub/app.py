from flask import Flask, request, jsonify
from pymongo import MongoClient
import numpy as np
import spacy
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS, cross_origin
from datetime import datetime, timedelta

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
nlp = spacy.load('en_core_web_lg')

# Database
client = MongoClient("mongodb://localhost:27017/")
db = client["SmartFreelanceHub"]  # Replace with your database name
users_collection = db["Users"]

@app.route('/', methods=['POST'])
@cross_origin()
def recommendation():
    content = request.json
    requirement = content["requirements"]
    users = getUsers()

    newUsers = []
    oldUsers = []

    for user in users:
        user_skills = user['skills']
        value = calculateSimilarity(requirement.lower(), user_skills.lower())

        if value > 0:
            user_info = {
                'user': user,
                'similarity_value': float(value) + float(user['fRating']/30)
            }

            # Check the number of jobs completed and classify accordingly
            if 'jobsCompleted' in user and user['jobsCompleted'] == 0:
                del user_info['user']['jobsCompleted']
                newUsers.append(user_info)
            else:
                del user_info['user']['jobsCompleted']
                oldUsers.append(user_info)

    # Sort both lists based on similarity_value in descending order
    newUsers.sort(key=lambda x: x['similarity_value'], reverse=True)
    oldUsers.sort(key=lambda x: x['similarity_value'], reverse=True)

    # Return both groups in the response
    return jsonify({
        "newUsers": newUsers,
        "oldUsers": oldUsers
    })


# Retrieve users who were last active more than 1 week ago and are looking for jobs
def getUsers():
    # Calculate the date 1 week ago
    one_week_ago = datetime.now() - timedelta(weeks=1)

    # Convert string dates in the format 'DD-MM-YYYY' to datetime objects
    users = list(users_collection.find(
        {
            "accountType": {"$in": ["Freelancer", "Both"]},
            "lookingForJob": True,
        },
        {"_id": 0, "accountType": 1, "email": 1, "skills": 1, "jobsCompleted": 1, "lastActive": 1, "fRating" : 1}
    ))
    # Filter users based on their 'lastActive' date
    filtered_users = []
    for user in users:
        last_active_str = user.get('lastActive')
        if last_active_str:
            try:
                # Convert 'lastActive' string to a datetime object
                last_active_date = datetime.strptime(last_active_str, "%d-%m-%Y")
                #print(last_active_date)
                #print(one_week_ago)
                # Check if the user was active in less than a week
                if last_active_date > one_week_ago:
                    filtered_users.append(user)
            except ValueError:
                # Handle the case where date format is invalid
                print(f"Invalid date format for user {user['email']}: {last_active_str}")

    return filtered_users

def calculateSimilarity(text1, text2):
    result = cosine_similarity([nlp(text1).vector], [nlp(text2).vector])
    value = result[0, 0]
    return value

def checkMatch(value):
    if value > 0.9:
        return "match"
    elif value > 0.5:
        return "partial match"
    else:
        return "no match"

# Main driver function
if __name__ == '__main__':
    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(port=8000, debug=True)
