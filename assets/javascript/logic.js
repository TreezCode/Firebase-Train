
// Initialize Firebase
// ===========================================================
var config = {
    apiKey: "AIzaSyDvIwsnOcFH0_tMunKqbmIZhFU9GLL-DE4",
    authDomain: "fir-train-a7367.firebaseapp.com",
    databaseURL: "https://fir-train-a7367.firebaseio.com",
    projectId: "fir-train-a7367",
    storageBucket: "fir-train-a7367.appspot.com",
    messagingSenderId: "292612024500"
};
firebase.initializeApp(config);

// Global Variables
// ===========================================================
var database = firebase.database();
var dataRef = database.ref();
var currentTime = moment();

// Functions
// ===========================================================
// Display the time to HTML and update every second using setInterval
var updateTime = () => {
    setInterval(function() {
        $("#time").text(moment().format("hh:mm A"));
    }, 1000);
}
updateTime();

// Main Logic
// ===========================================================
$(document).ready(function () {
    // Create a button to add trains to schedule
    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();
        // Grab user input
        var trainName = $("#train-name-input").val().trim();
        var trainDestination = $("#train-destination-input").val().trim();
        var firstTrainTime = $("#first-train-input").val().trim();
        var trainFrequency = $("#train-frequency-input").val().trim();

        // Only push new train if the form is properly filled out
        if (trainName === "" || trainDestination === "" || firstTrainTime === "" || trainFrequency === "") {
            $("#missing-form").html("All fields are required to add a train to the schedule.")
            return false;
        } else if (trainName === null || trainDestination === null || firstTrainTime === null || trainFrequency === null) {
            $("#missing-form").html("All fields are required to add a train to the schedule.")
            return false;
        } else {
            // Create a "temporary" object for holding train data
            var newTrain = {
                trainName: trainName,
                trainDestination: trainDestination,
                firstTrainTime: firstTrainTime,
                trainFrequency: trainFrequency
            };

            // Upload train data to firebase
            dataRef.push(newTrain);

            // Test / Debug
            console.log(newTrain.trainName);
            console.log(newTrain.trainDestination);
            console.log(newTrain.firstTrainTime);
            console.log(newTrain.trainFrequency);

            // Clear all of the input text-boxes after submit
            $("#train-name-input").val("");
            $("#train-destination-input").val("");
            $("#first-train-input").val("");
            $("#train-frequency-input").val("");
        }
    })

    // Create Firebase event for adding the train data to the database and row to the HTML
    dataRef.on("child_added", function (childSnapshot) {

        // Store all data into variables
        var trainName = childSnapshot.val().trainName;
        var trainDest = childSnapshot.val().trainDestination;
        var firstTime = childSnapshot.val().firstTrainTime;
        var trainFreq = childSnapshot.val().trainFrequency;

        // Test / Debug train info
        console.log(trainName);
        console.log(trainDest);
        console.log(firstTime);
        console.log(trainFreq);

        // Convert the trains first time and subtract 1 year to be sure its before todays date
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log("First Time: " + firstTimeConverted);

        // Log the current time
        console.log("Current Time: " + moment(currentTime).format("hh:mm"));

        // Calculate difference between times
        var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("Difference in time: " + timeDiff);

        // Time apart
        var tRemainder = timeDiff % trainFreq;
        console.log(tRemainder);

        // Minutes until train
        var minsAway = trainFreq - tRemainder;
        console.log("Minutes till train: " + minsAway);

        // Next arrival
        var nextArrival = moment().add(minsAway, "minutes");
        console.log("Arrival time: " + moment(nextArrival).format("hh:mm A"));

        // Create a new row of data
        var newRow = $("<tr>").append(
            $("<td>").html(trainName),
            $("<td>").html(trainDest),
            $("<td>").html(trainFreq).addClass("text-center"),
            $("<td>").html(minsAway).addClass("text-center"),
            $("<td>").text(moment(nextArrival).format("hh:mm A")).addClass("text-center"),
            $("<td>").html("<i class='far fa-trash-alt' id='removeBtn'></i>").addClass("text-center")
        );

        // Display the new row to the HTML by appending to the table body
        $("#train-table > tbody").append(newRow)
    });

    // Click event added to allow user to remove a train from schedule
    $(document).on("click", "#removeBtn", function() {
        event.preventDefault();
        
        // Get user confirmation before deleting the table row
        var confirmRemove = confirm("Removing a train is permanent and will delete the train from the system. Are you sure you want to remove this train?")
        if(confirmRemove) {
            $(this).closest('tr').remove();
        }
    });
});
