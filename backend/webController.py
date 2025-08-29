from . import big_little_db
from .sub import Submission
from . import apiKeys
import os

def createTables():
        big_little_db.init_db()

def newTeam(username, password, key):
        if key == apiKeys.hiddenKey:
                if big_little_db.addUser(username, password):
                        baseDir = os.path.dirname(os.path.abspath(__file__))
                        picsPath = os.path.join(baseDir, "pics", username)
                        os.makedirs(picsPath, exist_ok=True)
                        return "team added"
                else:
                        return "name taken"
        else:
                return "invalid key"

def newSubmit(teamName, challenge, points, date, photoName):
        newSub = Submission (teamName, challenge, points, date, photoName)
        big_little_db.addSub(newSub)

def logIn(userName, password):
        return big_little_db.checkLogIn(userName, password)

def listOfTeams():
        return big_little_db.getTeams()
