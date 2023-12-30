// document.queryselector is used to refer to HTML elements that have been IDd and interact with them
const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");


// Adding Hours, Minutes, Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  
  dropDownMenu(1, 12, setHours);
 
  dropDownMenu(0, 59, setMinutes);

  dropDownMenu(0, 59, setSeconds);

  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput);


function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
   dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
  //function dropDownMenu(start, end, element) {:

//This line defines a function called dropDownMenu that takes three parameters: start, end, and element.

}
function getCurrentTime() {
  const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", second: "numeric", hour12: true });
  currentTime.innerHTML = time;
  return time;

  //this function basically creates an object called  time = newdate, then the current time is extraxted using 
  //.toLocaleString method and then appened into the time element using .innerHTML method
}
 function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  setAlarm(alarmTime);
  //this functions take an argument that is an event .prevent default prevents it from reloading then it retrieves the 
  //values of seconds hours and minutes that has been set in the dropdown menu and store it in their respective variables 
  //as defined then a function called convertToTime stores the retrieved values in the variable alarmTime finally the function 
  //named setAlarm that atkes the variable alarmTime as an argument sets the time for the alarm.
}

// This function takes all thenindividual values and presents them in a redable format as we normally see it.
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}


function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Alarm Ringing");
    }
    console.log("running");
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
    //This code sets up an interval to periodically check if the current time matches a specified alarm time. 
    //If a match is found, it triggers an alert and logs to the console. Additionally, it dynamically adds the alarm to the 
    //DOM using addAlaramToDom and optionally saves the alarm time if not in a fetching scenario.
  }
}

// Alarms set by user Dislayed in HTML
 function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
  //This code is part of a larger functionality to dynamically add alarms to the DOM (Document Object Model). 
  //It creates a new div element representing an alarm, styles it, sets its content (including a time display and a delete button),
  // adds a click event listener to the delete button, and then appends the entire alarm div to the beginning of the container for
  // displaying alarms.
}


function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
  //This code is part of a functionality to check for existing alarm data stored in local storage. 
  //It retrieves the stored data, parses it from JSON format to an array, and returns the array. 
  //The purpose is likely to provide the current list of alarms stored locally for further processing or display.
}

// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  //This code is responsible for saving a new alarm time by retrieving the existing alarms from local storage,
  //adding the new time to the array, and then updating the local storage with the modified array. 
  //It is part of a broader functionality to manage and persist alarm data locally.
}

// Fetching alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
  //The purpose of this code is to fetch existing alarm times from local storage using checkAlarams and then set 
  //each alarm using setAlarm. The true argument in setAlarm likely indicates that these alarms are being set during a 
  //fetching scenario, preventing them from being saved again to avoid duplication.
}


function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
  //This code is designed to handle the deletion of an alarm. 
  //It clears the associated interval, identifies the alarm div from the clicked button, 
  //logs the time, deletes the corresponding alarm data from local storage, and removes the alarm div from the DOM.
  // It's likely used in response to a user action to delete a specific alarm.
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  //This code is responsible for deleting a specific alarm time from local storage. 
  //It retrieves the existing alarms, finds the index of the specified time, removes that time from the array,
  // and then updates the local storage with the modified array. 
  //It is part of the broader functionality to manage and persist alarm data locally.
}

//the stopwatch logic
let stopwatchInterval;
let stopwatchSeconds = 0;

function updateStopwatchDisplay() {
  const hours = Math.floor(stopwatchSeconds / 3600);
  const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
  const seconds = stopwatchSeconds % 60;

  const formattedTime = `${formatTimeComponent(hours)}:${formatTimeComponent(minutes)}:${formatTimeComponent(seconds)}`;
  document.getElementById('stopwatch').innerText = formattedTime;
}

function formatTimeComponent(timeComponent) {
  return timeComponent < 10 ? '0' + timeComponent : timeComponent;
}

function startStopwatch() {
  stopwatchInterval = setInterval(() => {
    stopwatchSeconds++;
    updateStopwatchDisplay();
  }, 1000);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
}

function resetStopwatch() {
  stopwatchSeconds = 0;
  updateStopwatchDisplay();
  stopStopwatch();
}