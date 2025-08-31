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
            "INSERT INTO submissions VALUES (?,?,?,?)",
            (sub.teamName, sub.challenge, sub.points, sub.picturePath)
        )
        conn.commit()

def getTeams(): #for submit page
    with sqlite3.connect(dbPath) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT username FROM login"
        )
        results = cursor.fetchall()
        teamNames = []

        for row in results:
            teamNames.append(row[0])
        return teamNames
        

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