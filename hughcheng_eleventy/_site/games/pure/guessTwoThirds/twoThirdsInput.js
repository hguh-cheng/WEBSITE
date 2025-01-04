let globalDatabase = []; // Simulating the global database

// Function to initialize user state and check submission status
function initialize() {
  if (localStorage.getItem("submitted")) {
    document.getElementById("numberForm").style.display = "none";
    document.getElementById("result").innerText =
      "You have already submitted a number.";
  }
}

// Function to handle form submission
function submitNumber(event) {
  event.preventDefault();

  const number = parseInt(document.getElementById("numberInput").value, 10);

  if (isNaN(number) || number < 1 || number > 100) {
    alert("Please enter a valid integer between 1 and 100.");
    return;
  }

  // Simulate adding to global database
  globalDatabase.push(number);

  // Mark as submitted
  localStorage.setItem("submitted", "true");
  document.getElementById("numberForm").style.display = "none";

  //   // Calculate and display 2/3rds of the average
  //   const average =
  //     globalDatabase.reduce((sum, num) => sum + num, 0) / globalDatabase.length;
  const average = 20;
  const result = (2 / 3) * average;

  document.getElementById(
    "result"
  ).innerText = `2/3rds of the average is around ${result.toFixed(0)}`;

  document.getElementById("hiddenContent").style.display = "block";
}
