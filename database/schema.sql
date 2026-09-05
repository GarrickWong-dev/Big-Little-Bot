CREATE TABLE Contests (
    contestID INTEGER PRIMARY KEY AUTOINCREMENT,
    contestName TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    maxSubs INTEGER
);

CREATE TABLE Users (
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'user', 'garrick')),
    userID INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE usersAndTheirAdmin(
    userID INTEGER NOT NULL,
    adminID INTEGER NOT NULL,

    PRIMARY KEY (userID, adminID),

    FOREIGN KEY (userID)
        REFERENCES Users(userID),

    FOREIGN KEY (adminID)
        REFERENCES Users(userID)
)

CREATE TABLE ContestTeams (
    userID INTEGER NOT NULL,
    contestID INTEGER NOT NULL,
    pointsTotal INTEGER DEFAULT 0,

    PRIMARY KEY (userID, contestID),

    FOREIGN KEY (userID)
        REFERENCES Users(userID),

    FOREIGN KEY (contestID)
        REFERENCES Contests(contestID)
);

CREATE TABLE ContestOwners (
    userID INTEGER NOT NULL,
    contestID INTEGER NOT NULL,

    PRIMARY KEY (userID, contestID),

    FOREIGN KEY (userID)
        REFERENCES Users(userID),

    FOREIGN KEY (contestID)
        REFERENCES Contests(contestID)
);

CREATE TABLE Submissions (
    submissionID INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    userID INTEGER NOT NULL,
    contestID INTEGER NOT NULL,
    submissionDate TEXT NOT NULL,
    points INTEGER NOT NULL,
    picturePath TEXT NOT NULL,

    FOREIGN KEY (userID)
        REFERENCES Users(userID),

    FOREIGN KEY (contestID)
        REFERENCES Contests(contestID)
);

