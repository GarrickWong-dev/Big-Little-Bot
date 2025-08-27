import sqlite3;

bl_db = sqlite3.connect("backend/big_little.db")
cursor = bl_db.cursor()

cursor.execute('''
    CREATE TABLE submissions (
                TEAMNAME VARCHAR(100),
                TEAMCHALLENGE VARCHAR(100),
                POINTS INT,
                PHOTONAME VARCHAR(255)
               );
               ''')

