# Nogueira athlete registration form 
BTEC Computing first unit project made in vs code. This is my first html/js/css project that isnt just a bunch of 'hello world's and sample buttons and images, im proud of how much i pushed myself and learnt from working on this.
## Description
The user inputs their information in a form, and then it opens a new tab with results as how the assignment brief asks for, with some extra bits here and there. I made sure to make it clear what the code does and also how it got to the point it is today (proving the whole human process of trial and error when coding)
## Navigation
below I will explain folders and their files
### Code
All of the code files (.js, .html, .css) are here. originally separataed into three folders for each language, but shortened down to one for brevity when navigating and when files reference each other. 
#### index.html
Main html, featuring the form with inputs, a table and a "table notes" div. It also has a custom toast pop up.
This file references global.js, index.js, and index.css
#### results.html
After the user succesfully fills and submits the form in index.html, a new tab will open with results.html's content featuring multiple empty spans that are later filled in with custom content relating to what the user inputed in the form. It also has an 'invoice' table
This file references global.js, results.js, and results.css
#### index.css
css styling the main form website, their inputs, the plan training table, and the custom toast popup
#### results.css
css styling the results website and the invoice table
#### global.js
A lot of variables, objects, arrays, and custom functions are declared here.
All variables here should not change while the program runs. It has values such as prices for each training plan, or the weight limits for it boxing class. These are here so that if team nogueira where to change some values (such as changing their pricing,) these changes would affect the whole website easily.
A bunch of functions here (mainly convertCase) are functions i made as a small personal project OUTSIDE of this assignment. Mostly to challenge and expand my js knowledge and logic handling skills. These functions do come in handy to handling some logic in the assignment as well with some smaller functions made for this project.
Ideally, all .js files should depend on this one
#### index.js
Handles logic for the main page with object and event based programming. It uses a custom function from global.js that labels DOM elements that the js will interact with, as well as another one to check that all the DOM elements handled properly.
In the event based side of things. It sets up event listeners that waits for input changes and performs logic accordingly. Mainly, if the training plan is switched, it changes the contents of the "table notes" div and manages the inputs within it.
This file is where most of the work came to, with multiple 'sketches' in the archive folder
#### results.js
Post-submit logic. Using url parameters to extract and store the form results. setting up functions and executing them to display the user the processed result, all wiith procedural programming and handy logic functions declared in global.js
### Archive
Old archived code that i reworked. I keep them in a folder to show my history of trial and error
#### calc.js.old 
Originally named calc.js, later renamed to index.js, this is my first iteration of logic for index.html. This used a function that was was called inside of the index.html inputs instead of event listeners (since i wasnt aware of their existance) I duplicated this file, renamed it, and setup event listeners in place of the functions to be more to spirit with the event based programming
#### index_2.js.old
second scrapped version of index.js, here i didnt have global.js, so code is a bit clunkier and messy. After i made global.js, i reworked this code to include it as well as merging the 'change' and 'input' event listeners and adding an extra (submit) event listener, as well as overall cleaner logic.
### resources
In this folder i stored external resources used such as images and fonts. originally i used a font i installed from google fonts but then switched tha. built in font. The font folder still exist for the sake of future-proofing.