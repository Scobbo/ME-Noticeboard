NOTICE BOARD FOR MANAGE ENGINE SERVICEDESK v1.1.0
Developed by Robert Coleman

1. Prerequisites
2. Folder structure
3. Reconfigure for deployment
4. Initial Setup
5. Misc
6. Final remarks
-----

1. This flask web app should be able to run on any web server that has had the latest version of python3 and the flask, requests, markupsafe, and os python libraries installed and configured. An API key will need to be generated against a user from within the helpdesk web app, the documentation has instructions on this.

2. The folder structure is the standard for flask web applications. The static folder contains any of the javascript files for running client side, css files and images such as logos. The template folder contains the html files served to the client. The app.py file is the flask app that is to be run by the server. the web.config and wfastcgi.py files are required for the server to correctly serve the flask web app.

3. As of version 1.1.X the API key, Service Desk URL, status names, and campus names no longer need to be altered from within the code. More options (such as style) will be available in later releases.

    A. The school logo should be saved as logo.png into the static folder.
    
    B. Style.css may need to be altered to change the way things look. Changing the font/typeface or colours should not cause any display issues, however modifying sizes of any element can cause items to be misaligned or pushed off screen. Please make a backup of anything before you alter it.

4. On initial deployment of the app, go to {helpesk-ULR.tdl}/admin to set the software up. At this time this URL is not secured, this will be a priority for development. The following options will appear
    
    A. Helpdesk URL: Enter the helpdesk url without any paths and with "https://" at the begining. (eg. https://helpdesk.myschool.com)

    B. Manage Engine API Key: Enter the key generated from the helpdesk admin panel.

    C. Primary Campus Name: Enter the name of the primary campus as it is known to Service Desk.

    D. Secondary Campus Name: Enter the name of the secondary campus as it is known to Service Desk.

    E. Collection Status Name: Enter the status name for devices ready for collection as it is known to Service Desk.

    F. Approval Status Name: Enter the status name for devices waiting on approval as it is known to Service Desk.

5. In the static folder there are templates for 2 use cases:
    
    A. 2 campus school: index.html and noticeboard.js displays information for both campuses, and secondary.html and noticeboard_secondary.js only show infomation for the secondary campus.

    B. 1 campus school: one_campus.html noticeboard_one_campus.js will display all information without checking against the site. These should be renamed index.html and noticeboard.js respectively if this is the version to be used.

6. I am planning to modify this so there are several version that can be dropped into place with less editing. As this was originally designed to be used in a specific school it isn't as modular as it could be. This was packaged up very quickly at the request of Adam Tuffery (blame him). Time permitting, a more modular version will be available in the near future. Any questions, comments, bug reports or book recomendations can be addressed to robert.coleman@minivoid.net