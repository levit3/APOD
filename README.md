# Astronomical Picture of the Day

**Date:** 12th April, 2024

By: **Levi Mwendwa**

## Description
The Astronomical Picture of the Day(APOD) webpage accesses data from the NASA API and displays different astronomical images and their explanations as per the date. Its various functionalities include:

- By default shows the Picture of the current day with its description.
- A forward and back button to navigate to the next and previous date.
- A search function that returns the image and description of the date entered.
- Ability to press the right and left arrow key to navigate to the next and previous date respectively.
- Shows a blurred version of the current day's image as the background image.
- A history section shich is hidden by default and is revealed by clicking on the History header.
- Ability to click on a specific date on the history section to be able to render the details of that particular date.

## Installation
You use git clone to be able to download the documents in the GitHub.

You need an [API Key](https://api.nasa.gov/) for the program to work.

## Installation Requirements
- Git
- API Key
- Dotenv
- Dotenvify
- Browserify

## Installation instruction
1. Get the a free [API Key](https://api.nasa.gov/) from the  NASA website.

2. Git clone https://github.com/levit3/APOD

3. On VS Code or an editor of your choice, create a file called `.env` and enter the API key using the format `API_KEY = YOUR_API_KEY` where `YOUR_API_KEY` is the key you received earlier.

4. On the console, copy and paste and run the following code:
```
npm install dotenv
npm install dotenvify
npm i browserify -g
browserify -t dotenvify -e index.js -o bundle.js
```
5. The webpage is ready to run :+1:
> [!Note]
> Anytime you change the code in index.js, remember to run `browserify -t dotenvify -e index.js -o bundle.js` for the changes to apply.

## Technologies used
- Github
- Javascript
- HTML

## Support and contact details
github.com/levit3

### License
The content of this site is licensed under Moringa School license Copyright (c) 2024.
