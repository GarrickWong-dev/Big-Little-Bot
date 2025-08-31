from . import big_little_db
from .sub import Submission
from . import apiKeys
import os
from . import discordNoti

def newTeam(username, password, key):
        if key == apiKeys.hiddenKey:
                if big_little_db.addUser(username, password): #make sure we add user
                        return "team added"
                else:
                        return "name taken"
        else:
                return "invalid key"

def newSubmit(teamName, challenge, points, date, picBytes, picName):
        newSub = Submission (teamName, challenge, points, date, picBytes, picName)
        big_little_db.addSub(newSub)
        discordNoti.noti(newSub)


def logIn(userName, password):
        return big_little_db.checkLogIn(userName, password)

def listOfTeams():
        return big_little_db.getTeams()

def getScoreBoard():
        return big_little_db.getScoreBoard()