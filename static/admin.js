"use strict";

let primaryCampus = "Primary" // Name of primary campus.
let secondaryCampus = "Secondary" // Name of secondary campus.
let collectionName = "Collection" // Name of collection status in helpdesk.
let approvalName = "Leadership" // Name of approval status in helpdesk.

// Set up some empty variables for the list of jobs (as HTML divs) are put in. This needs to be global for all the relevant functons to access.
let midCollectionData = "";
let senCollectionData = "";
let midApprovalData = "";
let senApprovalData = "";

// After the page is fully loaded, start all the functions.
$(document).ready(function() {
	startApp();
});

// Start all the functions required to run the page.
function startApp() {
	$.getScript("static/clock.js", function() {
		updateClock();
	});
}