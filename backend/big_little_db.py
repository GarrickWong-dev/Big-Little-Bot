import os
import json
import gspread
from google.oauth2.service_account import Credentials

SCOPES = ["https://www.googleapis.com/auth/spreadsheets","https://www.googleapis.com/auth/drive"]

googleCredsJson = os.getenv("GOOGLE_CREDS_JSON")
credsDict = json.loads(googleCredsJson)
creds = Credentials.from_service_account_info(credsDict, scopes=SCOPES)
client = gspread.authorize(creds)

sheetName = "BigLittleDB"
spreadsheet = client.open(sheetName)
submissionsSheet = spreadsheet.worksheet("submissions")
loginSheet = spreadsheet.worksheet("login")

def addSub(sub):
    submissionsSheet.append_row([
        sub.teamName,
        sub.challenge,
        sub.points,
        sub.date
    ])

def getTeams():
    teams = loginSheet.col_values(1)[1:]
    return teams

def checkLogIn(username, password):
    records = loginSheet.get_all_records()
    for row in records:
        if row['username'] == username and row['password'] == password:
            return True
    return False

def getScoreBoard():
    records = submissionsSheet.get_all_records()
    scores = {}

    for row in records:
        name = row['name']
        points = int(row['points']) if row['points'] else 0
        scores[name] = scores.get(name, 0) + points

    return sorted(scores.items(), key=lambda x: x[1], reverse=True)