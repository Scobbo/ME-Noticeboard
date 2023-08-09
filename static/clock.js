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