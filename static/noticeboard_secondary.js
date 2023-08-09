"use strict";

let primaryCampus = "Primary" // Name of primary campus.
let secondaryCampus = "Secondary" // Name of secondary campus.
let collectionName = "Collection" // Name of collection status in helpdesk.
let approvalName = "Leadership" // Name of approval status in helpdesk.

// Set up some empty variables for the list of jobs (as HTML divs) are put in. This needs to be global for all the relevant functons to access.
let senCollectionData = "";
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
	getData();
	getData();
}

function getNames() {
	fetch('/get-names')
	.then(response => response.json())
	.then(data => setNames(data))
	.catch(error => console.error(error));
	return
}

function setNames(data) {
	primaryCampus = data.primary;
	secondaryCampus = data.secondary;
	collectionName = data.collection;
	approvalName = data.approval;
	return
}

// The clock at the top right
function updateClock() {
	var d = new Date(); // Get the date (from the system clock).
	var s = ""; // Var to write a time into in a human readable format.
	s += ((d.getHours() + 11) % 12 + 1) + ":"; // Get just the hours, add 11 and devide all that by 12. Take what is left over and add one. This converts 24hr time to 12hr time. Don't worry I did the math, it checks out.
	s += (10 > d.getMinutes() ? "0" : "") + d.getMinutes(); // Get the minutes and make it always display a leading zero.
	$("#clock").text(s); //bMake the clock element display the time we just formatted.
	$("#date").text(d.toDateString()); // Make the date element display the date we just formatted.
	setTimeout(updateClock, 1000); // do it all again in 1000 milliseconds.
}

// Get the data from helpdesk using fetch()
function getData() {
	fetch('/get-data') // Call the "get-data" function on the serverside python script
		.then(response => response.json()) // Take the full response and store it in an object in a json structure
		.then(data => populate(data))
		.catch(error => console.error(error)); // Log any errors to the console
	setTimeout(getData,10000) // Do it all again in 10 seconds (this number is in milliseconds)
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
	if (campus == primaryCampus) {
		return;
	}
	if (campus == secondaryCampus && type == collectionName) {
		senCollectionData += `<div class='grid-item'>${name} (${id})</div>`;
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
	senCollectionData = "";
	senApprovalData = "";
}

// Find the correct grid using the div's id and write the html data to it
function updateData() {
	$("div.grid-item").remove(); // Clear the grids to stop double-ups of data
	$("#Senior-Collection").html(senCollectionData);
	$("#Senior-Approval").html(senApprovalData);
}