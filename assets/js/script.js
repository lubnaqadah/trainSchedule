var name = "";
var destination = "";
var firstTrain = null;
var frequency = null;
var nextArrival = null;
var minAway = null;


//configuring and initializing firebase

var config = {
	apiKey: "AIzaSyBF10qVPpS2YPAgMGslXcMPhYq-Mel3MDs",
	authDomain: "train-schedule-bbe10.firebaseapp.com",
	databaseURL: "https://train-schedule-bbe10.firebaseio.com",
	projectId: "train-schedule-bbe10",
	storageBucket: "train-schedule-bbe10.appspot.com",
	messagingSenderId: "911308198293"
};
firebase.initializeApp(config);

var database = firebase.database();



$("#submit").on("click", function(event){
	event.preventDefault();
	name = $("#name").val().trim();
	destination = $("#destination").val().trim();
	firstTrain = $("#firstTrain").val().trim();
	frequency = $("#frequency").val().trim();

	timeConvertion();

	//writing the the information to the database
	setDB();

});

//a function to take care of the time convertion

var timeConvertion = function(){

	var today = new Date();
	var currentHours = today.getHours();
	var currentMinutes = today.getMinutes();


	var timeSplit = firstTrain.split(":");
	var hours = timeSplit[0];
	var minutes = timeSplit[1];

	if (currentHours < hours){
		nextArrival = firstTrain;
		minAway = (hours - currentHours) * 60 + (minutes - currentMinutes);
		console.log(minAway, minAway % 60, minAway / 60);
		nextArrival = moment(nextArrival, ("hh:mm")).format("hh:mm A");
	}else{

		minAway = frequency - (((currentHours - hours) * 60 + (currentMinutes - minutes)) % frequency);
		var awayHours = Math.ceil((currentHours * 60 + minAway) / 60);	
		var awayMinutes = (currentMinutes + minAway) % 60;	
		if (awayMinutes == 0){
			awayMinutes = "00"
		}
		nextArrival = awayHours  + ":" + awayMinutes;
		console.log(currentHours, currentMinutes, awayHours, awayMinutes);
		nextArrival = moment(nextArrival, ("hh:mm")).format("hh:mm A");
	}
};

var setDB = function(){
	database.ref().push({
		name: name,
		destination: destination,
		frequency: frequency,
		nextArrival: nextArrival,
		minAway: minAway,
		firstTrain: firstTrain,
	});

};



//retrieving the information from the database

var retrieve = function(){
	database.ref().on("child_added", function(snapshot) {
		name = snapshot.val().name;
		destination = snapshot.val().destination;
		frequency = snapshot.val().frequency;
		nextArrival =  snapshot.val().nextArrival;
		minAway =  snapshot.val().minAway;
		firstTrain =  snapshot.val().firstTrain;

		//adding the train details to the table

		var row = $("<tr>");
		row.append("<td>" + name + "</td>");
		row.append("<td>" + destination + "</td>");
		row.append("<td>" + frequency + "</td>");
		row.append("<td>" + nextArrival + "</td>");
		row.append("<td>" + minAway + "</td>");

		$("#tbody").append(row);

	}, function(errorObject){
		console.log(errorObject);
	});
};
retrieve();
//
//var IntervId = setInterval(function(){
//	retrieve();
//	timeConvertion();
//	setDB();

// database.ref().once('value').then(function() {
	
// })
//
//}, 60000);