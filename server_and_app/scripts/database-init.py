import os.path
import sqlite3
from datetime import datetime

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
profile TEXT NOT NULL
)
''')

# Create History table
cur.execute('''
CREATE TABLE History (
pname VARCHAR(20),
date DATETIME,
profile TEXT NOT NULL,
PRIMARY KEY(pname, date),
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
INSERT INTO Profile(pname, profile) VALUES (?, ?)
''', ('Pb-free', profile))

# Add a default temperature profile run
cur.execute('''
INSERT INTO History(pname, date, profile) VALUES (?, ?, ?)
''', ('Pb-free', datetime.strptime(datetime.now().strftime("%Y-%m-%d %H:%M:%S"),"%Y-%m-%d %H:%M:%S"), profile))


profileFile.close()
# Save database
conn.commit()
# Close database connection
conn.close()


