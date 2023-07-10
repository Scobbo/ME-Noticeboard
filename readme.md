NOTICE BOARD FOR MANAGE ENGINE SERVICEDESK v1.0
Developed by Robert Coleman

1. Prerequisites
2. Folder structure
3. Reconfigure for deployment
4. Misc
5. Final remarks
-----

1. This flask web app should be able to run on any web server that has had the latest version of python3 and the flask and requests python libraries installed and configured. An API key will need to be generated against a user from within the helpdesk web app, the documentation has instructions on this.

2. The folder structure is the standard for flask web applications. The static folder contains any of the javascript files for running client side, css files and images such as logos. The template folder contains the html files served to the client. The app.py file is the flask app that is to be run by the server. the web.config and wfastcgi.py files are required for the server to correctly serve the flask web app.

3. For the web app to work several the files need to be modified.
    
    A. In app.py replace the value for url (lines 14 and 44 if you use approvals). This needs to be URL of the helpdesk api, this can be found in the API documentation from within the helpdesk. Line 44 (if you are using approvals) needs to end with a "/" as the function adds a job number at the end.

    B. In app.py replace the value for headers authtoken (lines 15 and 45). This is required to be in quotation marks (") otherwise it will fail.
    
    C. In noticeboard.js lines 3-6 need to be altered to match the lables in the helpdesk exactly, this is case sensitive. The fields "primaryCampus" and "secondaryCampus" are the names of the sites in helpdesk. The fields "collectionName" and "approvalName" are the names for the statuses for when the device can be collected and the job has been sent for approval respectively.
    
    D. The school logo should be saved as logo.png into the static folder.
    
    E. Style.css may need to be altered to change the way things look. Changing the font/typeface or colours should not cause any display issues, however modifying sizes of any element can cause items to be misaligned or pushed off screen. Please make a backup of anything before you alter it.

4. In the static folder there are templates for 2 use cases:
    
    A. 2 campus school: index.html and noticeboard.js displays information for both campuses, and secondary.html and noticeboard_secondary.js only show infomation for the secondary campus.

    B. 1 campus school: one_campus.html noticeboard_one_campus.js will display all information without checking against the site. These should be renamed index.html and noticeboard.js respectively if this is the version to be used.

5. I am planning to modify this so there are several version that can be dropped into place with less editing. As this was originally designed to be used in a specific school it isn't as modular as it could be. This was packaged up very quickly at the request of Adam Tuffery (blame him). Time permitting, a more modular version will be available in the near future. Any questions, comments, bug reports or book recomendations can be addressed to robert.coleman@minivoid.net