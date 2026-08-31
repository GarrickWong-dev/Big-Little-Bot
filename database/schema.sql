CREATE TABLE Contests (
    contestID INTEGER PRIMARY KEY AUTOINCREMENT,
    contestName TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    maxSubs INTEGER
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
    picturePath TEXT NOT NULL,

    FOREIGN KEY (teamID)
        REFERENCES Teams(teamID),

    FOREIGN KEY (contestID)
        REFERENCES Contests(contestID)
);

CREATE TABLE Users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'user', 'garrick')),
    teamID INTEGER,

    FOREIGN KEY (teamID)
        REFERENCES Teams(teamID)
);