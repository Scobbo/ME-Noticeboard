from flask import Flask, render_template, request, redirect # Flask libraries
import os.path # Library for manipulating local files and folders
import requests # Requests library for handling the API request
import configparser # Library for writing and reading configuration files

print('Content-Type: text/plain') # Headers for it to work

app = Flask(__name__)

config = configparser.ConfigParser()
meKey = ''
meUrl = ''

def writeConfig():
    config["INSTANCE"] = {
        "Key": meKey,
        "Url": meUrl
    }
    with open("config.ini", "w") as configfile:
        config.write(configfile)

def updateConfig(isKeySet, isUrlSet):
    if(isKeySet):
        config.set("INSTANCE", "Key", meKey)
    if(isUrlSet):
        config.set("INSTANCE", "Url", meUrl)
    with open("config.ini", "w") as configfile:
        config.write(configfile)

def readConfig():
    global meKey, meUrl
    config.read("config.ini")
    meKey = config.get("INSTANCE", "Key")
    meUrl = config.get("INSTANCE", "Url")

if not os.path.exists('config.ini'):
    writeConfig()
else:
    readConfig()

@app.route('/') # Entry point for default page
def index():
    return render_template('index.html') # Open the index.html and render it as the requested page

@app.route('/admin') # Entry point for the admin/settings page
def admin():
    return render_template('admin.html') # Open the admin.html and render it as the requested page

@app.route('/get-data') # Instructions for when the javascript calls this to start the API request process
def get_data():
    url = f"https://{meUrl}/api/v3/requests" # Helpdesk URL for API
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
    global meKey, meUrl
    if request.method == "POST":
        # Get details from form
        meKey = request.form.get("api-key")
        meUrl = request.form.get("helpdesk-url")
        updateConfig(meKey, meUrl)
    return redirect("/")

if __name__ == '__main__':
    app.run()