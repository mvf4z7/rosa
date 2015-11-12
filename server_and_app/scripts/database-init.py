import json
import os.path
import sqlite3

db = './data.db'

if os.path.isfile(db):
    print('Database already exists, exiting...')
    exit()

conn = sqlite3.connect(db)
cur = conn.cursor()
profileFile = open('./profile.json')
profile = profileFile.read()

print('Preparing database for first time use...')

# Create User table
cur.execute('''
CREATE TABLE User (
username VARCHAR(50) PRIMARY KEY,
privilege TINYINT NOT NULL
)
''')

# Create Profile table
cur.execute('''
CREATE TABLE Profile (
pname VARCHAR(20) PRIMARY KEY,
username VARCHAR(50) NOT NULL,
profile TEXT NOT NULL,
FOREIGN KEY(username) REFERENCES User(username)
)
''')

# Create History table
cur.execute('''
CREATE TABLE History (
username VARCHAR(50),
pname VARCHAR(20),
date DATETIME,
profile TEXT NOT NULL,
PRIMARY KEY(username, pname, date),
FOREIGN KEY(username) REFERENCES User(username),
FOREIGN KEY(pname) REFERENCES Profile(pname)
)
''')

# Add a default user
cur.execute('''
INSERT INTO User(username, privilege) VALUES (?, ?)
''', ('tjrg88@mst.edu', 1))

cur.execute('''
INSERT INTO User(username, privilege) VALUES (?, ?)
''', ('jtbzqd@mst.edu', 1))

cur.execute('''
INSERT INTO User(username, privilege) VALUES (?, ?)
''', ('jhezq7@mst.edu', 1))

cur.execute('''
INSERT INTO User(username, privilege) VALUES (?, ?)
''', ('mvf4z7@mst.edu', 1))

# Add a default temperature profile
cur.execute('''
INSERT INTO Profile(pname, username, profile) VALUES (?, ?, ?)
''', ('default_profile', 'tjrg88@mst.edu', profile))


profileFile.close()
# Save database
conn.commit()
# Close database connection
conn.close()


