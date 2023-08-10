"use strict";

let collectionName = "Collection"; // Name of collection status in helpdesk.
let approvalName = "Leadership"; // Name of approval status in helpdesk.

// Set up some empty variables for the list of jobs (as HTML divs) are put in. This needs to be global for all the relevant functons to access.
let CollectionData = "";
let ApprovalData = "";

// After the page is fully loaded, start all the functions.
$(document).ready(function () {
	startApp();
});

// Start all the functions required to run the page.
function startApp() {
	$.getScript("static/clock.js", function() {
		updateClock();
	});
	getData();
	getData();
	return;
}

function getNames() {
	fetch('/get-names')
	.then(response => response.json())
	.then(data => setNames(data))
	.catch(error => console.error(error));
	return;
}

function setNames(data) {
	primaryCampus = data.primary;
	secondaryCampus = data.secondary;
	collectionName = data.collection;
	approvalName = data.approval;
	return;
}

// Get the data from helpdesk using fetch()
function getData() {
	fetch('/get-data') // Call the "get-data" function on the serverside python script
		.then(response => response.json()) // Take the full response and store it in an object in a json structure
		.then(data => populate(data))
		.catch(error => console.error(error)); // Log any errors to the console
	setTimeout(getData, 10000); // Do it all again in 10 seconds
}

// Populate the tables with the data from getData()
async function populate(data) {
	clearData(); // Clear the data so that each item isn't added several times
	for (const item of data.requests) { // Loop through all of the jobs
		if (item.approval_status != null) {
			makeItem(item.status.name, item.requester.name, item.id, item.approval_status.name); // Send the data to be written into the correct grid
		}
		else {
			makeItem(item.status.name, item.requester.name, item.id, null); // Send the data to be written into the correct grid
		}
	}
	updateData(); // After the jobs are written (as html) to the variables, write them into the grid
}

function makeItem(type, name, id, approval) { // Add the job's information to the correct list. If you aren't using approvals remove the approval argument
	let icon = ""; // Set the Material icon based on the approval status. If you aren't using approvals, remove this variable declaration and switch statement
	switch (approval) {
		case "Approved":
			icon = "<span class='material-symbols-outlined'>done</span>";
			break;
		case "Pending Approval":
			icon = "<span class='material-symbols-outlined'>schedule</span>";
			break;
		case "Rejected":
			icon = "<span class='material-symbols-outlined'>close</span>";
			break;
		default:
			icon = "";
			break;
	}

	// Check the site and status and then add to the data to that list as a div in html format
	if (type == collectionName) {
		CollectionData += `<div class='grid-item'>${name} (${id})</div>`;
		return;
	}

	if (type == approvalName) {
		ApprovalData += `<div class='grid-item'>${name} (${id}) ${icon}</div>`;
		return;
	}
	console.log(`${name}, ${id}, ${campus}, ${type}, ${approval}, ${icon} slipped through the cracks`); // Log any items to console that don't get sorted and display all infomation so we can investigate
	// If you aren't using approvals fremove ${approval} and {$icon}
	return;
}

function clearData() { // Clear the data variables to stop double-ups of data
	CollectionData = "";
	ApprovalData = ""; // Remove this if you are't using approvals
}

// Find the correct grid using the div's id and write the html data to it
function updateData() {
	$("div.grid-item").remove(); // Clear the grids to stop double-ups of data
	$("#Collection").html(CollectionData);
	$("#Approval").html(ApprovalData);
}