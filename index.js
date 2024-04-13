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

//we fetch data from the server
const apiKey = process.env.API_KEY;
fetch(`https://api.nasa.gov/planetary/apod?api_key=apiKey`)
  .then((res) => res.json())
  .then((data) => renderData(data)) //we pass on the data to the render function in order to render it to the DOM
  .catch((error) => console.error(error.message)); //we catch any error messages in the console
