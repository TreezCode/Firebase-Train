// Callback function to track the Auth state
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var photoURL = user.photoURL;
            var phoneNumber = user.phoneNumber;
            console.log(email);
            console.log(displayName);
            console.log(photoURL);
            console.log(phoneNumber);
            
            // Diplay username to navbar
            $("#display-name").html("Username: " + displayName);

            // Build a div filled with account information
            var div = $("<div>").append(
            $("<p>").html("Username: " + displayName),
            $("<p>").html("Email: " + email),
            $("<p>").html("Phone Number: " + phoneNumber)
            );
            // Display the account info in modal by appending div
            $("#account-info").append(div);

        } else {
            // User is signed out.
            window.location = "login.html"
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp()
});