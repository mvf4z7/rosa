import json
import os.path

credentialsFile = 'secret.json'
content = {'github': {}, 'google': {}}

if os.path.isfile(credentialsFile):
    overwrite = ""
    while overwrite != "y" and overwrite != "Y":
        overwrite = raw_input("{} exists. Overwrite? [y/n]: ".format(credentialsFile))
        if overwrite == "n" or overwrite == "N":
            exit(0)

for entry in content:
    credentials = {'id': '', 'secret': ''}
    credentials['id'] = raw_input("Enter {} client ID: ".format(entry))
    credentials['secret'] = raw_input("Enter {} client secret: ".format(entry))
    content[entry] = credentials

content['hostname'] = raw_input("Enter hostname (excluding port): http://")

with open(credentialsFile, 'w') as cFile:
    cFile.write(json.dumps(content))