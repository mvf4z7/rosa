import json
import os.path
import sqlite3

db = './data.db'

if os.path.isfile(db):
    print('Database already exists, exiting...')
    exit()

conn = sqlite3.connect(db)
cur = conn.cursor()
profileFile = open('../profile.json')
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

# Add a default user
cur.execute('''
INSERT INTO User(username, privilege) VALUES (?, ?)
''', ('tjrg88@mst.edu', 1))

# Add a default temperature profile
cur.execute('''
INSERT INTO Profile(pname, username, profile) VALUES (?, ?, ?)
''', ('default_profile', 'tjrg88@mst.edu', profile))


profileFile.close()
# Save database
conn.commit()
# Close database connection
conn.close()


