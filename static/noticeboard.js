"use strict";

let primaryCampus = ""; // Name of primary campus.
let secondaryCampus = ""; // Name of secondary campus.
let collectionName = ""; // Name of collection status in helpdesk.
let approvalName = ""; // Name of approval status in helpdesk.

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
	getNames();
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
			makeItem(item.site.name, item.status.name, item.requester.name, item.id, item.approval_status.name); // Send the data to be written into the correct grid
		}
		else {
			makeItem(item.site.name, item.status.name, item.requester.name, item.id, null); // Send the data to be written into the correct grid
		}
	}
	updateData(); // After the jobs are written (as html) to the variables, write them into the grid
}

function makeItem(campus, type, name, id, approval) { // Add the job's information to the correct list
	let icon = "";
	switch (approval) { // Set the Material icon based on the approval status.
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
	if (campus == primaryCampus && type == collectionName) {
		midCollectionData += `<div class='grid-item'>${name} (${id})</div>`;
		return;
	}
	if (campus == secondaryCampus && type == collectionName) {
		senCollectionData += `<div class='grid-item'>${name} (${id})</div>`;
		return;
	}
	if (campus == primaryCampus && type == approvalName) {
		midApprovalData += `<div class='grid-item'>${name} (${id}) ${icon}</div>`;
		return;
	}
	if (campus == secondaryCampus && type == approvalName) {
		senApprovalData += `<div class='grid-item'>${name} (${id}) ${icon}</div>`;
		return;
	}
	console.log(`${name}, ${id}, ${campus}, ${type}, ${approval}, ${icon} slipped through the cracks`); // Log any items to console that don't get sorted and display all infomation so we can investigate
	return;
}

function clearData() { // Clear the data variables to stop double-ups of data
	midCollectionData = "";
	senCollectionData = "";
	midApprovalData = "";
	senApprovalData = "";
}

// Find the correct grid using the div's id and write the html data to it
function updateData() {
	$("div.grid-item").remove(); // Clear the grids to stop double-ups of data
	$("#Middle-Collection").html(midCollectionData);
	$("#Senior-Collection").html(senCollectionData);
	$("#Middle-Approval").html(midApprovalData);
	$("#Senior-Approval").html(senApprovalData);
}