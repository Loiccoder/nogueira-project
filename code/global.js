// This js file has a lot of variables and functions that i refernce in both index.js and results.js
// Some are objects with data i will be referencing to
// Theres also functions to facilitate any future logic
// creats an object with all the plans and their info, this is used to update the table in the main page and calculate prices on results.js
// This makes it easier if the client ever wishes to update prices/ sessions per plan
// Also dictates if competitions are available on each plan
const plans = {
    beginner: {
        fee: 250,
        sessions: 2,
        competitions: false
    },
    intermediate: {
        fee:300,
        sessions: 3,
        competitions: true
    },
    elite: {
        fee: 350,
        sessions: 5,
        competitions: true
    },
    private: {
        fee: 90.5,
        sessions: 5,  // For the sake of logic, the `sessions` key is used for max hours
        competitions: false
    }

}
//price for competitions
const competitionsFee = 220
const weightLimits = [ // The limits of the weight categories, they are written here in case they change for some reason
    // Its on this format of an array full of objects to facilitate the logic in results.js
    {category: "flyweight", limit: 66},
    {category: "lightweight", limit: 73},
    {category: "lightMiddleweight", limit: 81},
    {category: "middleweight", limit: 90},
    {category: "lightHeavyweight", limit: 100}
    // Since heavyweight has no limit, its not here
]
function capitalize (inputString) { // turns "sample text" into "Sample text"
    let string  = String(inputString)
    return string.at(0).toUpperCase() + string.slice(1)
}
// This function makes a floating point from the input number (n) and then rounds it to the "roundTo"th decimal
// This is because .toFixed isnt as reliable with integers
// by default the value for roundTo is 2, since that is what the task ask for 
function round (n, roundTo = 2) {
    //doesn't actually round the number but i dont know how else to call it
    //round is good enough
    return Number.parseFloat(n).toFixed(roundTo)
}
function plural(value, toChange="") {
    return value === 1 ? toChange : toChange.concat("s")
}
// I made this function to change case stylings as a project separate from this task as a challenge to myself
// I use it for legibility in the website and console, as well as some logic to make html's kebab-case and js's camelCase compatible
// This is 100% unnecesary
// In short, this function:
//  1. takes the text, splits it into an array of multiple worlds
// 2. reattaches it into a string in the desired format
function convertCase (inputString, inputCase, outputCase) {
    // Makes sure the input is a string
    let string = String(inputString)
    // I use stringArray in both switches, so i declare it here to expand its scope to the whole function
    let stringArray = []
    //console.debug('Converting string "', string, '" from ', inputCase, ' to ', outputCase)
    // I removed this because it clutters the console
    switch (inputCase) {
        case "eng":
        case "english":
            stringArray = string.split(" ")
        break
        case "cC":
        case "camelCase":
        case "PC":
        case "PascalCase":
            // string.split(/(?=[A-Z])/) takes the string and splits it before each uppercase letter
            // I honestly can't explain how ?=[A-Z]/ works, im still learning regex, I just know it works
            // If the string starts with an uppercase, it creates an empty "" item as the first item of the array
            // .filter(Boolean) removes all empty items on the array to prevent this
            // map allows me to modify each item individually
            // since i cant turn the string into lowercase before splitting
            stringArray = string.split(/(?=[A-Z])/).filter(Boolean).map(item => item.toLowerCase())
        break
        case "P-K-C":
        case "Pascal-Kebab-Case": // Some of these i made up but i need for the code
        case "k-c":
        case "kebab-case":
            stringArray = string.split("-")
        break
        case "s_c":
        case "snake_case":
        case "S_S_C":
        case "SCREAMING_SNAKE_CASE":
            stringArray = string.toLowerCase().split("_")
        break
        case "dots":
            stringArray = string.split(".")
        break
        case "commas":
            stringArray = string.split(",")
        break
        default:
        console.error('InputCase "', inputCase,  '" not recognized')
        return string
    }
    switch (outputCase) {
        case "eng":
        case "english":
            return stringArray.join(" ")
        break
        case "cC":
        case "camelCase":
            return stringArray.map((item, index) => index === 0 ? item.toLowerCase() : capitalize(item)).join("")
            // if its the first word on the array (index === 0), it turns everything to lowercase
            // for the rest of the words the first letter is uppercased
        break
        case "PC":
        case "PascalCase":
            return stringArray.map(i => capitalize(i)).join("")
        break
        case "k-c":
        case "kebab-case":
            return stringArray.join("-").toLowerCase()
        break
        case "P-K-C":
        case "Pascal-Kebab-Case": // This is what weight categories (such as Light-Middleweight) use
            return stringArray.map(i => capitalize(i)).join("-")
        break
        case "s_c":
        case "snake_case":
            return stringArray.join("_").toLowerCase()
        break
        case "S_S_C":
        case "SCREAMING_SNAKE_CASE":
            return stringArray.join("_").toUpperCase()
        break
        case "array":
            return stringArray
        break
        default:
        console.error('OutputCase "', outputCase,  '" not recognized')
        return string
    }
}
// I was tired of constantly writing out 'variableName = document.getElementById("variable-name-but-in-kebab-case")
// This creates an object with all the labeled DOM elements
function labelDOMElements (keys=[]) {
    const obj = {}
    keys.forEach(key => {
        const elementId = convertCase(key, "cC", "k-c")
        obj[key] = document.getElementById(elementId)
    })
    return obj
}
/* This is probably my favorite function here
It checks if all DOM elements had fully loaded, then returns an object based on the results
Inspired by web APIs such as performance 
Had fun making it
*/
function DOMGuardClause (elements) {
    const results = { // The object the function outputs
        success: true, // Wether all the elements were found or not
        checkedElements: [], // Aray of all checked ellements
        foundElements: [], // Array of all found elements
        failedElements: [], // Array of all elements not found
        checked: 0, // How much elements were checked
        found: 0, //  How much elements were found
        failed: 0 // How much elements were not found
    }
    Object.entries(elements).forEach(([key, el]) => {
        // key is the name of element (string name of the variable)
        // el is the element itself
        results.checked = results.checkedElements.push(key)
        if (el) {
            console.debug(`Found "${convertCase(key, "cC", "eng")}"`)
            // here i use both of the uses for the push() function
            // The push function adds an item to an array
            // The push function ALSO outputs the new array length after the push
            // So the push here updates both results.found and results.foundElements
            results.found = results.foundElements.push(key)
        }
        else {
        // If the element is not found, then el is `undefined`, which would make the console not be able to tell what failed
        // This is why i have key and el separated
        console.error(`Unable to find "${convertCase(key, "cC", "eng")}"`)
        results.failed = results.failedElements.push(key)
    }
    })
    results.success = results.failed === 0
    return results
}