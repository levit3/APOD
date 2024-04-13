// require("dotenv").config();
//we initialize every variable that we will use later on
const header = document.getElementById("dateHeader");
const title = document.getElementById("title");
const potd = document.getElementById("potd");
const dateHeader = document.getElementById("dateHeader");
const descriptionHeader = document.getElementById("descriptionHeader");
const explanationContainer = document.getElementById("explanation");
const form = document.getElementById("dateSearch");
const dateInput = form.dateInput;
let date = null;
const explanation = document.createElement("p");
const nextDay = document.getElementById("next");
const prevDay = document.getElementById("previous");
const notFound = document.getElementById("notFound");
const historyHeader = document.getElementById("historyHeader");
const backgroundImage = document.createElement("div"); //we create a container where we can store the background image

//we get the current date
const currentDate = new Date();
let day = currentDate.getDate();
let month = currentDate.getMonth() + 1;
let year = currentDate.getFullYear();
let dateToday = `${year}-0${month}-${day}`;

//initializes history variables
const dateHistoryArray = [];
const dateHistoryList = document.getElementById("dateHistoryList");
const dateHistoryContainer = document.querySelector(".dateHistory");

//we fetch data from the server
// const apiKey = process.env.API_KEY;
fetch(
  `https://api.nasa.gov/planetary/apod?api_key=4ucYmBRjTLylUm0NrRpR5VCFPyetItgFep4hWuAh`
)
  .then((res) => res.json())
  .then((data) => renderData(data)) //we pass on the data to the render function in order to render it to the DOM
  .catch((error) => console.error(error.message)); //we catch any error messages in the console

//we create a function that renders the data to the webpage
function renderData(data) {
  title.innerText = data.title;
  date = data.date;
  dateHeader.innerText = data.date;
  explanation.innerText = data.explanation;
  explanationContainer.appendChild(explanation);
  potd.innerHTML = `
    <img id="image" src="${data.url}" alt="${data.title}"/>
    `;
  const image = document.getElementById("image");
  //we style the image so that its at the center of the page
  image.style.position = "absolute";
  image.style.left = "0";
  image.style.right = "0";
  image.style.top = "0";
  image.style.bottom = "0";
  image.style.margin = "auto";
  image.style.maxWidth = "100%";
  image.style.maxHeight = "73%";

  //we style the body so that it has the image as the background image and ensure it is blurred
  backgroundImage.style.backgroundImage = `url(${data.url})`;
  backgroundImage.style.position = "absolute";
  backgroundImage.style.top = "0"; //ensure the image is pinned to the top
  backgroundImage.style.left = "0"; //ensure the image is pinned to the left
  backgroundImage.style.width = "100%";
  backgroundImage.style.height = "100%";
  backgroundImage.style.zIndex = "-1"; //we ensure the div is behind all other elements
  backgroundImage.style.filter = "blur(60px)"; //we apply a blur effect to the background
  document.body.appendChild(backgroundImage);

  //we remove the disabled and hidden attributes in case the user had gone a day further than the current date
  nextDay.removeAttribute("disabled");
  notFound.setAttribute("hidden", true);
  explanationContainer.removeAttribute("hidden");

  let newDate = data.date; //we assign the current date to the variable newDate
  //we check if the current date is already in the array to avoid repetition
  if (dateHistoryArray.indexOf(newDate) === -1) {
    dateHistoryArray.push(newDate); //if the current date is not in the array then it is added
    const historyContainer = document.createElement("div");
    //we populate the history container with a date and a remove button
    historyContainer.innerHTML = `<span style="display:inline-block"><li class="listItem">${newDate}</li></span> <span style = "display:inline-block"><button class = "listDelButton">x</button></span>`;
    //we append the container to the history list container element
    dateHistoryList.appendChild(historyContainer);
    const delButton = historyContainer.querySelector(".listDelButton");
    delButton.addEventListener("click", removeDate); //we immediately add an event listener to the button and pass it on to the remove date function
    let listItem = historyContainer.querySelector(".listItem");
    listItem.style.cursor = "pointer";
    listItem.addEventListener("click", renderListItem); //we immediately add an event listener that will show the data of the date clicked
  }
}
//we add an event listener to the form for when a date is searched and submitted
form.addEventListener("submit", (event) => {
  event.preventDefault();
  date = dateInput.value;
  if (
    //we ensure that the date inputted is not greater than the current date
    parseInt(date.split("-")[0]) > parseInt(dateToday.split("-")[0]) ||
    (parseInt(date.split("-")[1]) === parseInt(dateToday.split("-")[1]) &&
      parseInt(date.split("-")[0]) > parseInt(dateToday.split("-")[0])) ||
    (parseInt(date.split("-")[2]) > parseInt(dateToday.split("-")[2]) &&
      parseInt(date.split("-")[1]) === parseInt(dateToday.split("-")[1]) &&
      parseInt(date.split("-")[0]) === parseInt(dateToday.split("-")[0]))
  ) {
    date = dateHistoryArray.slice([-1]).join(""); //ensures that the previous button will return the user to where he was before the invalid date
    tomorrow();
  } else {
    fetchDate(date); //pass it on to the function that will get the date data from the api
    form.reset(); //we reset the form to clear anything that had been previously entered
  }
});

nextDay.addEventListener("click", handleNextDay);
prevDay.addEventListener("click", handlePrevDay);

//adds event listeners for when the right or left arrow button is clicked
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    handlePrevDay(); //passes function that renders the previous date when left arrow is clicked
  } else if (event.key === "ArrowRight") {
    handleNextDay(); //passes function that renders the next date when the right arrow is clicked
  }
});

function handleNextDay() {
  let dateArray = date.split("-");
  if (
    //checks for months that have 31 days
    (dateArray[2] === "31" && dateArray[1] === "01") ||
    (dateArray[2] === "31" && dateArray[1] === "03") ||
    (dateArray[2] === "31" && dateArray[1] === "05") ||
    (dateArray[2] === "31" && dateArray[1] === "07") ||
    (dateArray[2] === "31" && dateArray[1] === "08") ||
    (dateArray[2] === "31" && dateArray[1] === "10")
  ) {
    let x = parseInt(dateArray[1]) + 1; //changes to the next month
    dateArray[1] = `0${x.toString()}`;
    dateArray[2] = "01"; //changes day to first of the month
    date = dateArray.join("-");
    fetchDate(date);
  } else if (
    //checks for months that have 30 days
    (dateArray[2] === "30" && dateArray[1] === "04") ||
    (dateArray[2] === "30" && dateArray[1] === "06") ||
    (dateArray[2] === "30" && dateArray[1] === "09") ||
    (dateArray[2] === "30" && dateArray[1] === "11")
  ) {
    let x = parseInt(dateArray[1]) + 1;
    dateArray[1] = `0${x.toString()}`;
    dateArray[2] = "01"; //changes day to first of the month
    date = dateArray.join("-");
    fetchDate(date);
  } else if (
    //checks if the month is february and if it is a leap year
    dateArray[1] === "02" &&
    dateArray[2] === "29" &&
    dateArray[0] % 4 === 0
  ) {
    dateArray[1] = "03";
    dateArray[2] = "01"; //changes date to first of march
    date = dateArray.join("-");
    fetchDate(date);
  } else if (
    //checks if the month is february and if it not a leap year
    dateArray[1] === "02" &&
    dateArray[2] === "28" &&
    dateArray[0] % 4 !== 0
  ) {
    dateArray[1] = "03";
    dateArray[2] = "01"; //changes the date to the first of March
    date = dateArray.join("-");
    fetchDate(date);
  } else if (
    //checks if it is the end of the year
    dateArray[2] === "31" &&
    dateArray[1] === "12"
  ) {
    let x = parseInt(dateArray[0]) + 1; //changes to the next year
    dateArray[0] = x.toString();
    dateArray[1] = "01";
    dateArray[2] = "01"; //changes date to first day of the year
    date = dateArray.join("-");
    fetchDate(date);
  } else if (dateArray.join("-") === dateToday) {
    tomorrow(); //function to show it cannot render date in the future
  } else {
    let x = parseInt(dateArray[2]) + 1; //adds 1 to the date to show data of the next day
    dateArray[2] = x.toString();
    date = dateArray.join("-");
    fetchDate(date);
  }
}
function handlePrevDay() {
  let dateArray = date.split("-");
  // checks if previous month has 31 days
  if (
    (dateArray[2] === "01" && dateArray[1] === "04") ||
    (dateArray[2] === "01" && dateArray[1] === "06") ||
    (dateArray[2] === "01" && dateArray[1] === "08") ||
    (dateArray[2] === "01" && dateArray[1] === "09") ||
    (dateArray[2] === "01" && dateArray[1] === "11")
  ) {
    let x = parseInt(dateArray[1]) - 1;
    dateArray[1] = `0${x.toString()}`;
    dateArray[2] = "31";
    date = dateArray.join("-");
  }
  // Checks if previous month has 30 days
  else if (
    (dateArray[2] === "01" && dateArray[1] === "02") ||
    (dateArray[2] === "01" && dateArray[1] === "07") ||
    (dateArray[2] === "01" && dateArray[1] === "10") ||
    (dateArray[2] === "01" && dateArray[1] === "12")
  ) {
    let x = parseInt(dateArray[1]) - 1;
    dateArray[1] = `0${x.toString()}`;
    dateArray[2] = "30";
    date = dateArray.join("-");
  }
  // Checks if the previous month is February and it's a leap year
  else if (
    dateArray[1] === "03" &&
    dateArray[2] === "01" &&
    dateArray[0] % 4 === 0
  ) {
    dateArray[1] = "02";
    dateArray[2] = "29";
    date = dateArray.join("-");
  }
  // Checks if the previous month is February and it's not a leap year
  else if (
    dateArray[1] === "03" &&
    dateArray[2] === "01" &&
    dateArray[0] % 4 !== 0
  ) {
    dateArray[1] = "02";
    dateArray[2] = "28";
    date = dateArray.join("-");
  }
  // Checks if its the last day of the year
  else if (dateArray[2] === "01" && dateArray[1] === "01") {
    let x = parseInt(dateArray[0]) - 1;
    dateArray[0] = x.toString();
    dateArray[1] = "12";
    dateArray[2] = "31";
    date = dateArray.join("-");
  }
  // For all other cases, decrease the day by 1
  else {
    let x = parseInt(dateArray[2]) - 1;
    dateArray[2] = x.toString();
    date = dateArray.join("-");
  }
  // Calls the function to fetch data of a date
  fetchDate(date);
}

//we fetch the data from the current date variable and pass it on to the renderData function for it to be displayed on the DOM
function fetchDate(date) {
  fetch(
    `https://api.nasa.gov/planetary/apod?api_key=4ucYmBRjTLylUm0NrRpR5VCFPyetItgFep4hWuAh&date=${date}`
  )
    .then((res) => res.json())
    .then((dateData) => renderData(dateData))
    .catch((error) => console.error(error.message));
}

//function that renders a page not found error when the user tries to go to a date greater than the current date
function tomorrow() {
  //we remove all the content from the webpage
  notFound.removeAttribute("hidden"); //removes the hidden attribute to show the content on the DOM
  nextDay.setAttribute("disabled", true); //we disable the next button to prevent the user from going forward further
  backgroundImage.style.backgroundImage = "";
  document.body.style.backgroundColor = "darkgrey";
  title.innerText = "";
  dateHeader.innerText = "";
  explanationContainer.setAttribute("hidden", true);
  //renders the page not found gif onto the page
  potd.innerHTML = `<img id="image" src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmljMWgzeWV4Nnp1eGs4a3M0NDFzMmhpc2xzNXpuMzJxNWV2YXNpaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/j3KEAyVwci7GPtOVNv/giphy.gif" width="400" height="400" alt="404 error"/>`;
  //we center the image onto the center of the page
  const image = document.getElementById("image");
  image.style.margin = "auto";
  image.style.position = "absolute";
  image.style.left = "0";
  image.style.right = "0";
  image.style.marginTop = "85px";
  notFound.innerHTML = `<h3><span style = "color:cornflowerblue; font-weight:800; font-size:35px">You seem lost</span></h3>
  <h4><span style = "font-size:25px; font-weight:200">Calm down. It's not tomorrow yet</span></h4>`; //page not found error message
  //we add a day to the date so as to ensure going back returns the user to the current date
  let dateArray = date.split("-");
  let x = parseInt(dateArray[2]) + 1;
  dateArray[2] = x.toString();
  date = dateArray.join("-");
}

//we create a delete function that removes the whole date element from the History container and array
function removeDate(event) {
  const value = event.target.parentNode.previousElementSibling.innerText; //we select the date that is to be deleted
  const index = dateHistoryArray.indexOf(value); //we find the index of the date to be deleted in the array
  dateHistoryArray.splice(index, 1); //we remove the date from the array
  event.target.parentNode.parentNode.remove(); //we remove the entire element that hold the date and delete button
}

//we create a function that passes on the event's target value to be rendered
function renderListItem(event) {
  fetchDate(event.target.innerText);
}

//we hide the history container until when clicked for a cleaner page
historyHeader.addEventListener("click", (event) => {
  if (dateHistoryContainer.hasAttribute("hidden")) {
    dateHistoryContainer.removeAttribute("hidden");
  } else {
    dateHistoryContainer.setAttribute("hidden", true);
  }
});

//we change the cursor style to show a pointer
nextDay.style.cursor = "pointer";
prevDay.style.cursor = "pointer";
historyHeader.style.cursor = "pointer";
