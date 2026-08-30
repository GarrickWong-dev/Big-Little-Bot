CREATE TABLE Contests (
    contestID INTEGER PRIMARY KEY AUTOINCREMENT,
    contestName TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE Teams (
    teamID INTEGER PRIMARY KEY AUTOINCREMENT,
    teamName TEXT NOT NULL,
    contestID INTEGER NOT NULL,
    pointsTotal INTEGER DEFAULT 0,

    FOREIGN KEY (contestID)
        REFERENCES Contests(contestID)
);

CREATE TABLE Submissions (
    submissionID INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    teamID INTEGER NOT NULL,
    contestID INTEGER NOT NULL,
    submissionDate TEXT NOT NULL,
    points INTEGER NOT NULL,
    picture_path TEXT NOT NULL,

    FOREIGN KEY (teamID)
        REFERENCES Teams(teamID),

    FOREIGN KEY (contestID)
        REFERENCES Contests(contestID)
);