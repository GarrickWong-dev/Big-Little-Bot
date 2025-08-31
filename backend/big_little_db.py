import gspread
from google.oauth2.service_account import Credentials

GoogleSheetsCreds = "backend/google-credentials.json"
sheetName = "BigLittleDB"

SCOPES = ["https://www.googleapis.com/auth/spreadsheets","https://www.googleapis.com/auth/drive"]

creds = Credentials.from_service_account_file(GoogleSheetsCreds, scopes=SCOPES)
client = gspread.authorize(creds)

spreadsheet = client.open(sheetName)
submissions_sheet = spreadsheet.worksheet("submissions")
login_sheet = spreadsheet.worksheet("login")

def addSub(sub):
    submissions_sheet.append_row([
        sub.teamName,
        sub.challenge,
        sub.points,
        sub.date
    ])

def getTeams():
    teams = login_sheet.col_values(1)[1:]  # username is in column 1
    return teams

def checkLogIn(username, password):
    records = login_sheet.get_all_records()
    for row in records:
        if row['username'] == username and row['password'] == password:
            return True
    return False

def getScoreBoard():
    records = submissions_sheet.get_all_records()
    scores = {}

    for row in records:
        name = row['name']
        points = int(row['points']) if row['points'] else 0
        scores[name] = scores.get(name, 0) + points

    return sorted(scores.items(), key=lambda x: x[1], reverse=True)