// **OBJECT BASED PROGRAMMING**
// an object with every important element inside the form
// The labelDOMElements function creates an object with multiple variables referring to DOM elements
// This is to avoid the visual mess of multiple 'variableName = document.getElementByID ("variable-name-but-in-kebab-case")'
const vitalElements = labelDOMElements([
    "toast",
    "toastClose",
    "toastMessage",
    "form",
    "nameTextInput",
    "weightNumberInput",
    "weightCategorySelect",
    "weightCategoryInfo",
    "competitionsEntered",
    "planTable",
    "beginnerRadioInput",
    "intermediateRadioInput",
    "eliteRadioInput",
    "privateRadioInput",
    "tableNotes",
    "submit"
])
const tableValueElements = labelDOMElements([
    "beginnerSessions",
    "beginnerCompetitions",
    "beginnerFee",
    "intermediateSessions",
    "intermediateCompetitions",
    "intermediateFee",
    "eliteSessions",
    "eliteCompetitions",
    "eliteFee",
    "privateSessions",
    "privateCompetitions",
    "privateFee"
])
// Default values, they are declared outside the function so that they can be saved even if another plan is chosen after being changed
let competitions = false
let privateHours = 1
 /* vitalElementsCheck function I made inspired by web APIs
It checks if every DOM element loaded properly
The function outputs an object with the following properties
Success: true if all elements are found, false if at least one wasn't found
checkedElements: array with all the checked elements
foundElements: array with all the found Elements
failedElements: array with all failed Elements
checked: amount of elemengts checked
found: amount of found elements
failed: you get the gist */
const vitalElementsCheck = DOMGuardClause({...vitalElements, ...tableValueElements})
if (vitalElementsCheck.success) { // I didnt bother to indent the insides of this if since its literally ALL of the code
    console.debug("All vital elements found, continuing script")
// Function to open the toast (only used once, but good for future expansions to the code)
function toastShow (message){
    console.debug("showing toast with alert:", message)
    vitalElements.toast.classList.add("show") // Show css class makes it visible, if it already has this class, nothing changes
    vitalElements.toastMessage.innerText = message
}
function toastHide () { // I shouldn't need to tell you what this does...   
    console.debug("hiding toast")
    vitalElements.toast.classList.remove("show")
}
// The table-notes DIV changes depending on the plan chosen, this function works with that
function planNotes (plan) {
    let notes
    switch (plan) {
        default:
        case 'beginner':
            notes =
                `<p>Competitions occur the second Saturday of the month.</p>
                <p>If you wish to participate in monthly competitions, you would need to register for either the "Intermediate" or "Elite" plan and pay an extra AED ${round(competitionsFee)} per Competition</p>`
        break
        // Quoting the document, "Only Intermediate and Elite athletes can enter competitions"
        // Therefore people signed up for private lessons can't
        case "intermediate":
        case "elite":
            notes =  
                `<p>Competitions occur the second Saturday of the month.</p>
                <p>If you wish to sign up for competitions, you would need to pay an extra AED ${round(competitionsFee)} per competition.</p>
                <label for="competitions">Check the button below if you wish to sign up for competitions.</label>
                <br>
                <input type="checkbox" id="competitions-checkbox" name="competitions" value=true ${competitions ? "checked" : ""}>`
                // "Srting ${variable} string" is a quick way to edit a string with a variable
                // This used to look much clunkier because I used "string " + variable + " string"
        break
        case 'private':
            notes =
                `<br><label for="range-input">Please choose how much hours a week do you wish to take private coaching (maximum ${plans.private.sessions} hours.)</label>
                <br>
                <input type="range" min="1" max="${plans.private.sessions}" step="1"  value="${privateHours}" id="range-input" name="private-hours">
                <p>You will have <input type="number" min="1" max="${plans.private.sessions}" value="${privateHours}" id="number-input" name="private-hours"> <span id="hour-plural">${plural(privateHours, "hour")}</span> of private coaching each week.</p>`  
                // here i create both a radio input and a number input that both are for choosing how much hours of private lessons the user would take
                //I sync up both inputs on the notes.addEventListener below
        break
    }
    return notes
}
// The following is the tex that shows when you hover the info item
// The values here change depending on the weightLimits array in global.js
vitalElements.weightCategoryInfo.title = `Each category has a maximum weight limit:
${weightLimits.map(i => `${convertCase(i.category, "cC", "P-K-C")}: ${i.limit}`).join('\n')}
Heavyweight: unlimited`
// This changes the info text inside of the table depending on the plans object in global.js
// If the price of a plan, or the amount of sessions or competition availability of a training plan changes,
// It wouldnt need to be changed much times
Object.entries(tableValueElements).forEach(([key, el]) => { 
    const valueKey = convertCase(key, "cC", "array")
    const value = plans[valueKey[0]][valueKey[1]]
    switch (valueKey[1]) {
        case "fee":
            el.innerText = round(value)
        break
        case "competitions":
            el.innerText = value ? "Yes" : "No"
        break
        case "sessions":
            const whatAreWeCounting = (valueKey[0] === "private") ? " hour" : " session"
            el.innerText = String(value) + plural(value, whatAreWeCounting)
    }
})
vitalElements.tableNotes.innerHTML = planNotes() // The default text of the tableNotes should be the same as beginner
// **EVENT BASED PROGRAMMING**

vitalElements.form.addEventListener("input", (e) => { //Listens for inputs within the form, identifies origin and value, and does its corresponding behaviors
    // Whenever it detects an input event it registers what input does it come from and what is its current value
    let inputOrigin = e.target.name
    let inputValue = e.target.value
    // the value of checkbox inputs is always the same wether its checked or not
    // So this 'if' makes it so that checkboxes store their checked property in inputValue instead
    if (e.target.type === "checkbox") { inputValue = e.target.checked}
    console.debug("Current input value:", inputValue)
    // In this debug I use e.target.id instead of inputOrigin since both the privare hour slider and number inputs have the same name
    console.debug("Input detected:", convertCase(e.target.id, "k-c", "eng"))
    switch(inputOrigin) {
        case "private-hours":  //If the input changes private hours (can only happen if private plan is selected)
            const rangeInput = document.getElementById("range-input")
            const numberInput = document.getElementById("number-input")
            const hourPlurality = document.getElementById("hour-plural")
            if (['1', '2', '3', '4', '5'].includes(inputValue)) {
                // privateHours (default value is 1) only changes to the input's current value if its an integer between 1 and 5
                // This is because the number input is finnicky where its possible to write numbers outside of the minimum and maximum
                privateHours = inputValue
            }
            if (rangeInput && numberInput) {
                // Makes sure both private hour inputs are loaded
                // If both are loaded, it changes their values to the privateHours value
                // If the user inputed an illegal value, privateHours didnt change so it doesnt reflect in the inputs
                rangeInput.value = numberInput.value = privateHours
            } else {
                if (!rangeInput) {
                    console.error("Unable to find slider input for private hour selection")
                }
                if (!numberInput) {
                    console.error("Unable to find number input for private hour selection")
                }
            }
            if (hourPlurality) {
                // Changes the plurality of the word 'hour/s' after the number input
                hourPlurality.innerHTML = plural(privateHours, "hour")
            } else {
                console.error("Unable to find plurality <span> for private hours")
            }
        break
        case "competitions": // If its the competitions enabled/disabled checkbox
            // saves the value of the checkbox
            competitions = e.target.checked
        break
        case "training-plan": // If the user chooses a training plan
            //Moved this to the function written above, as it gets pretty messy and unreadable if start nesting switches
            vitalElements.tableNotes.innerHTML = planNotes(inputValue)
    }
    // Moved this console.debug below since the switch can change the inputValue
})
vitalElements.form.addEventListener("submit", (e) => { //If the user attempts to submit the form
    console.debug("Submit detected!")
    // Below i check if the user is qualified for their weight category, if not, it denies the submission
    const weight = vitalElements.weightNumberInput.value
    const chosenWeightCategory = convertCase(vitalElements.weightCategorySelect.value, "k-c", "cC")
    const chosenCategoryLimit = weightLimits.find(i => chosenWeightCategory === i.category)?.limit
    console.debug(`Submitting with the weight category "${convertCase(chosenWeightCategory, "k-c", "cC")}, "with limit", ${chosenCategoryLimit}`)
    if (chosenWeightCategory === 'heavyweight') return
    if (weight >= chosenCategoryLimit && !chosenCategoryLimit =="") {
        e.preventDefault() //Prevents the submit from doing their default behavior
        console.log("submit denied")
        toastShow(`You cannot enter the ${convertCase(chosenWeightCategory, "cC", "P-K-C")} category if your weight is above ${chosenCategoryLimit} kg, please check your submission`)
        // If i had used alert() instead of toastShow, it would delay the eventListener, causing a warning in the console
        // Since alert() pauses the code until dismissed
    } 
})
vitalElements.toastClose.addEventListener("click", () => toastHide()) //Button to close the toast
} else { // If vitalElementsCheck.success === false
    console.error(`Unable to find ${vitalElementsCheck.failed} vital element${plural(vitalElementsCheck.failed)}: ${vitalElementsCheck.failedElements}`) // Im proud of this line cause it uses a bunchg of my custom functions
    alert("page failed loading, try refreshing or contact team nogueira if issue persists")
    //Originally used toastShow, but fails cause the function is declared inside the if
    // I could declare it outside the if, but it depends on DOM elements that can fail loading anyways
}