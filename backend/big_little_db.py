#The Model
import sqlite3
from sub import Submission

bl_db = sqlite3.connect("backend/big_little.db")
cursor = bl_db.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS submissions (
                name text,
                challenge text,
                points INT,
                photoPath text
                picturePath text
               );
               ''')

cursor.execute('''
               CREATE TABLE IF NOT EXISTS login(
               username text,
               password text
               );
               ''')

def addSub(sub):
    cursor.execute("INSERT INTO submissions VALUES (?,?,?,?)", (sub.name, sub.challenge, sub.points, sub.picturePath))
    bl_db.commit()

def addUser(username, password):
    cursor.execute("INSERT INTO login VALUES (?,?)",(username, password))
    bl_db.commit()

def getScoreBoard():
    cursor.execute("SELECT username FROM login")
    users = cursor.fetchall()

    scoreBoard = []
    for (username,) in users:
        cursor.execute("SELECT SUM(points) FROM submissions WHERE NAME = ?", (username,))
        totalPoints = cursor.fetchone()[0] or 0
        scoreBoard.append((username, totalPoints))
    return scoreBoard

def getChallengeInfo(name):
    cursor.execute("SELECT challenge, points, photoname FROM submissions where NAME=?",(name))
    info = cursor.fetchall()
    return info