from flask import Flask, render_template # Flask libraries
import requests # Requests library for handling the API request

print('Content-Type: text/plain') # Headers for it to work

app = Flask(__name__)

@app.route('/') # Entry point for default page
def index():
    return render_template('index.html') # Open the index.html file as a template (in this case it is just a fully formed site with no python changable data)

@app.route('/get-data') # Instructions for when the javascript calls this to start the API request process
def get_data():
    url = 'https://YOUR_HELPDESK_URL_HERE/api/v3/requests' # Helpdesk URL for API
    headers = {"authtoken":"YOUR_API_TOKEN_HERE", "Content-Type":"text/html"} # Auth Token as a key value pair
    # This requests the first 200 jobs orderd by most recent and returns any with status Collection or Leadership. 200 should be enough but can be increased if needed.
    input_data = '''{
        "list_info": {
            "start_index": 1,
            "row_count": 200,
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
                }
            ]
        }
    }'''
    params = {'input_data': input_data} # Turn this into a key value pair
    response = requests.get(url, headers=headers, params=params) # Send the request and save the response to a variable
    return response.text # Return the response as a plain text to the calling function

# Instructions for when the javascript calls this to get approval status
# If approvals are not being used, this function can be removed for reduced network traffic, however if there aren't many jobs the impact will not be noticeable
@app.route('/get-approval/<jobid>')
def get_approval(jobid):
    url = 'https://YOUR_HELPDESK_URL_HERE/api/v3/requests/' + str(jobid) # Convert the job id from the js fetch request to a string and make it part of the URL
    headers = {"authtoken":"YOUR_API_TOKEN_HERE", "Content-Type":"text/html"} # Auth Token as a key value pair
    response = requests.get(url,headers=headers,verify=False)
    return response.text

# Entry point for secondary campus if information is to be displayed is different. If you don't need an alternative version this function can be removed
# The argument ('/m') can be changed to whatever path you like i.e: ('/alt') which would make the URL to get to this version "https://subdomain.schooldomain.tld/alt"
@app.route('/m') 
def mainst():
    return render_template('secondary.html') # Open the secondary.html file as a template (in this case it is just a fully formed site with no python changable data)

if __name__ == '__main__':
    app.run()