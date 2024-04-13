require("dotenv").config();
//we initialize every variable that we will use later on
const header = document.getElementById("dateHeader");
const title = document.getElementById("title");
const potd = document.getElementById("potd");
const dateHeader = document.getElementById("dateHeader");
const descriptionHeader = document.getElementById("descriptionHeader");
const container = document.getElementById("explanation");
const form = document.getElementById("dateSearch");
const dateInput = form.dateInput;
let date = null;
const explanation = document.createElement("p");
const nextDay = document.getElementById("next");
const prevDay = document.getElementById("previous");
const notFound = document.getElementById("notFound");

//we get the current date
const currentDate = new Date();
let day = currentDate.getDate();
let month = currentDate.getMonth() + 1;
let year = currentDate.getFullYear();
let dateToday = `${year}-0${month}-${day}`;

//we fetch data from the server
const apiKey = process.env.API_KEY;
fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
  .then((res) => res.json())
  .then((data) => renderData(data)) //we pass on the data to the render function in order to render it to the DOM
  .catch((error) => console.error(error.message)); //we catch any error messages in the console

//we create a function that renders the data to the webpage
function renderData(data) {
  title.innerText = data.title;
  date = data.date;
  dateHeader.innerText = data.date;
  explanation.innerText = data.explanation;
  container.appendChild(explanation);
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
}
//we add an event listener to the form for when a date is searched and submitted
form.addEventListener("submit", (event) => {
  event.preventDefault();
  date = dateInput.value;
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
    .then((res) => res.json())
    .then((dateData) => renderData(dateData)) //we pass the data from the search to the renderData function to be rendered to the DOM
    .catch((error) => console.error(error.message));
  form.reset(); //we reset the form to clear anything that had been previously entered
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
    fetchNextDate(date);
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
    fetchNextDate(date);
  } else if (
    //checks if the month is february and if it is a leap year
    dateArray[1] === "02" &&
    dateArray[2] === "29" &&
    dateArray[0] % 4 === 0
  ) {
    dateArray[1] = "03";
    dateArray[2] = "01"; //changes date to first of march
    date = dateArray.join("-");
    fetchNextDate(date);
  } else if (
    //checks if the month is february and if it not a leap year
    dateArray[1] === "02" &&
    dateArray[2] === "28" &&
    dateArray[0] % 4 !== 0
  ) {
    dateArray[1] = "03";
    dateArray[2] = "01"; //changes the date to the first of March
    date = dateArray.join("-");
    fetchNextDate(date);
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
    fetchNextDate(date);
  } else if (dateArray.join("-") === dateToday) {
    tomorrow(); //function to show it cannot render date in the future
  } else {
    let x = parseInt(dateArray[2]) + 1; //adds 1 to the date to show data of the next day
    dateArray[2] = x.toString();
    date = dateArray.join("-");
    fetchNextDate(date);
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
  fetchNextDate(date);
}

//we fetch the data from the date and pass it on to the renderData function for it to be displayed on the DOM
function fetchNextDate(date) {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}=${date}`)
    .then((res) => res.json())
    .then((dateData) => renderData(dateData))
    .catch((error) => console.error(error.message));
}
