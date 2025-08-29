#The Model
import sqlite3

dbPath = "backend/big_little.db"

def init_db():
    with sqlite3.connect(dbPath) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS submissions (
                name TEXT,
                challenge TEXT,
                points INT,
                photoPath TEXT,
                picturePath TEXT
            );
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS login(
                username TEXT,
                password TEXT
            );
        ''')
        conn.commit()


def addSub(sub):
    with sqlite3.connect(dbPath) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO submissions VALUES (?,?,?,?,?)",
            (sub.name, sub.challenge, sub.points, sub.photoPath, sub.picturePath)
        )
        conn.commit()

def addUser(username, password):
    with sqlite3.connect(dbPath) as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT 1 FROM login WHERE username = ?", (username,))
        if cursor.fetchone():
            return False
        else:
            cursor.execute("INSERT INTO login VALUES (?,?)", (username, password))
            conn.commit()
            return True


#deal with later
#def getChallengeInfo(name): #Get all the challenges info from a specif team, Used for website potentially???
 #   cursor.execute("SELECT challenge, points, photoname FROM submissions where NAME=?",(name,))
  #  info = cursor.fetchall()
   # return info

def checkLogIn(userName, passWord): 
    with sqlite3.connect(dbPath) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password FROM login WHERE username = ?", (userName,))
        result = cursor.fetchone()
        if result is None:
            return False
        return result[0] == passWord

#For Discord!

def getScoreBoard():
    with sqlite3.connect(dbPath) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT username FROM login")
        users = cursor.fetchall()

        scoreBoard = []
        for (username,) in users:
            cursor.execute("SELECT SUM(points) FROM submissions WHERE name = ?", (username,))
            totalPoints = cursor.fetchone()[0] or 0
            scoreBoard.append((username, totalPoints))
        return scoreBoard