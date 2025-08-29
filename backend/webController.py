from . import big_little_db
from .sub import Submission
from . import apiKeys

def newTeam(username, password, key):
        if key == apiKeys.hiddenKey:
                if big_little_db.addUser(username, password):
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