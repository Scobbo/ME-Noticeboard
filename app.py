from flask import Flask, render_template, request, redirect # Flask libraries
from markupsafe import escape
import os.path # Library for manipulating local files and folders
import requests # Requests library for handling the API request
import configparser # Library for writing and reading configuration files

print('Content-Type: text/plain') # Headers for it to work

app = Flask(__name__)

config = configparser.ConfigParser()
meKey = "" # Manage Engine API Key
meUrl = "" # Manage Engine URL
primaryCampus = "" # Name of primary campus.
secondaryCampus = "" # Name of secondary campus.
collectionName = "" # Name of collection status in helpdesk.
approvalName = "" # Name of approval status in helpdesk.

# Create the config file with blank values
def writeConfig():
    config["INSTANCE"] = {
        "Key": meKey,
        "Url": meUrl,
        "PrimaryCampus": primaryCampus,
        "SecondaryCampus": secondaryCampus,
        "CollectionName": collectionName,
        "ApprovalName": approvalName
    }
    with open("config.ini", "w") as configfile:
        config.write(configfile)
    readConfig()
    return

# Update any keys that have had input from the settings form and use the existing value from the existing config.
def updateConfig(isKeySet, isUrlSet, isPrimarySet, isSecondarySet, isCollectionSet, isApprovalSet):
    if(isKeySet):
        config.set("INSTANCE", "Key", meKey)
    if(isUrlSet):
        config.set("INSTANCE", "Url", meUrl)
    if(isPrimarySet):
        config.set("INSTANCE", "PrimaryCampus", primaryCampus)
    if(isSecondarySet):
        config.set("INSTANCE", "SecondaryCampus", secondaryCampus)
    if(isCollectionSet):
        config.set("INSTANCE", "CollectionName", collectionName)
    if(isApprovalSet):
        config.set("INSTANCE", "ApprovalName", approvalName)
    with open("config.ini", "w") as configfile:
        config.write(configfile)
    readConfig()
    return

# Upgrade the config file with the required key-value pairs.
# Helps with upgrading app version or dealing with incomplete config file.
def upgradeConfig(isKeySet, isUrlSet, isPrimarySet, isSecondarySet, isCollectionSet, isApprovalSet):
    if(isKeySet):
        config.set("INSTANCE", "Key", meKey)
    if(isUrlSet):
        config.set("INSTANCE", "Url", meUrl)
    if(isPrimarySet):
        config.set("INSTANCE", "PrimaryCampus", primaryCampus)
    if(isSecondarySet):
        config.set("INSTANCE", "SecondaryCampus", secondaryCampus)
    if(isCollectionSet):
        config.set("INSTANCE", "CollectionName", collectionName)
    if(isApprovalSet):
        config.set("INSTANCE", "ApprovalName", approvalName)
    with open("config.ini", "w") as configfile:
        config.write(configfile)
    return

# Read the settings in from the config file and sets the variables in the app.
def readConfig():
    print("readConfig was called")
    global meKey, meUrl, primaryCampus, secondaryCampus, collectionName, approvalName
    config.read("config.ini")
    meKey = config.get("INSTANCE", "Key")
    meUrl = config.get("INSTANCE", "Url")
    primaryCampus = config.get("INSTANCE", "PrimaryCampus")
    secondaryCampus = config.get("INSTANCE", "SecondaryCampus")
    collectionName = config.get("INSTANCE", "CollectionName")
    approvalName = config.get("INSTANCE", "ApprovalName")
    return

# Checks the config file to see if it exists and has the appropriate keys.
def checkConfig():
    print("checkConfig was called")
    # If config file doens't exist, make it with blank variables so the app can run.
    if not os.path.exists('config.ini'):
        writeConfig()
        return
    else:
        # If it does exist, make sure all of the required keys are present.
        config.read("config.ini")
        keys = ("Key", "Url", "PrimaryCampus", "SecondaryCampus", "CollectionName", "ApprovalName")
        key = [False] * 6
        count = 0
        for i in keys: # For all of the keys (in this version)
            try: # try to get the key's value, if there is a value in the config, the the write flag to false then increment the array pointer.
                config.get("INSTANCE", i)
                key[count] = False
                count += 1
            except configparser.NoOptionError: # If the key doesn't exist in the config, set the write flag to true and increment the array pointer.
                key[count] = True
                count += 1
        upgradeConfig(key[0], key[1], key[2], key[3], key[4], key[5]) # Run the upgrade function with the flags set by the above loop. This should only write new keys.
        return
    
def startup():
    checkConfig()
    readConfig()

@app.route('/') # Entry point for default page
def index():
    return render_template('index.html') # Open the index.html and render it as the requested page

@app.route('/admin') # Entry point for the admin/settings page
def admin():
    return render_template('admin.html') # Open the admin.html and render it as the requested page

@app.route('/get-data') # Instructions for when the javascript calls this to start the API request process
def get_data():
    url = f"{meUrl}/api/v3/requests" # Helpdesk URL for API
    headers = {"authtoken":meKey, "Content-Type":"text/html"} # Auth Token as a key value pair
    # This requests the first 200 jobs orderd by most recent and returns any with status Collection or Leadership. 200 should be enough but can be increased if needed.
    input_data = '''{
        "list_info": {
            "start_index": 1,
            "row_count": 200,
            "fields_required": [ "id", "status", "requester", "site", "approval_status" ],
            "sort_field": "id",
            "sort_order": "asc",
            "search_criteria": [
                {
                    "field": "status.name",
                    "condition": "is",
                    "values": [
                        "Collection",
                        "Leadership"
                    ],
                    "logical_operator": "or"
                },
                {
                    "field": "approval_status.name",
                    "condition": "is",
                    "value": [
                        "Pending Approval",
                        "Approved",
                        "Rejected"
                    ],
                    "logical_operator": "or"
                }
            ]
        }
    }'''
    params = {'input_data': input_data} # Turn this into a key value pair
    response = requests.get(url, headers=headers, params=params) # Send the request and save the response to a variable
    return response.text # Return the response as a plain text to the calling function

# Entry point for secondary campus if information is to be displayed is different. If you don't need an alternative version this function can be removed
# The argument ('/m') can be changed to whatever path you like i.e: ('/alt') which would make the URL to get to this version "https://subdomain.schooldomain.tld/alt"
@app.route('/s') 
def secondary():
    return render_template('secondary.html') # Open the secondary.html file as a template (in this case it is just a fully formed site with no python changable data)

@app.route('/settings', methods=["GET", "POST"]) #enty point for the settings form submission target
def settings():
    global meKey, meUrl, primaryCampus, secondaryCampus, collectionName, approvalName
    if request.method == "POST":
        # Get details from form
        meKey = escape(request.form.get("api-key"))
        meUrl = escape(request.form.get("helpdesk-url"))
        primaryCampus = escape(request.form.get("primary-campus"))
        secondaryCampus = escape(request.form.get("secondary-campus"))
        collectionName = escape(request.form.get("collection-name"))
        approvalName = escape(request.form.get("approval-name"))
        updateConfig(meKey, meUrl, primaryCampus, secondaryCampus, collectionName, approvalName)
    return redirect("/")

if __name__ == '__main__':
    startup()
    app.run()