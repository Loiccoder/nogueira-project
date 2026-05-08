// PROCEDURAL PROGRAMMING
// OBJECTS/VARIABLES
// Extracts what the user inputed from the URL
const params = new URLSearchParams(window.location.search);
const results = {
    username: params.get("name"),
    trainingPlan: params.get("training-plan"),
    privateHours: params.get("private-hours"),
    competitions: params.get("competitions"),
    weight: params.get("weight"),
    weightCategory: convertCase(params.get("weight-category"), "k-c", "cC"),
    competitionsThisMonth: params.get("competitions-this-month")
}
// destructuring commonly referensed properties from the object, so i dont have ot write 'results.' every time
let {trainingPlan, privateHours, weightCategory} = results
const nameSpan = document.getElementById("username")
const planTierSpan = document.getElementById("plan-tier")
const invoice = document.getElementById("invoice")
const weightCategorySpan = document.getElementById("weight-category-chosen")
const weightNotesSpan = document.getElementById("weight-category-notes")
const vitalElementsCheck = DOMGuardClause({nameSpan, planTierSpan, invoice, weightCategorySpan, weightNotesSpan})
if (vitalElementsCheck.success) {
//The rest of the code wont work if any of the DOM elements arent found.
//Once again, i dont bother with identing
// FUNCTIONS
function calculateTotal (fee, competitions, competitionsFee, weeklyPayments) {
    // weeklyPayments is to cover for the fact that privateHouurs multiplies the fee
    return fee * weeklyPayments * 4 + (competitions && competitionsFee)
    // (competitions && competitionsFee) adds the competitionsFEe if competitions = true
}
function newInvoiceItem (item, info, pricing, total=false) {
    //This function adds a row to the invoice table
    let newRow = invoice.insertRow(invoice.rows.length)
    newRow.classList.add(total ? "invoice-total" : "invoice-item")
    newRow.insertCell(0).innerHTML = 
    `<p class="invoice-item-title">${item}</p>
    <p class="invoice-item-info">${info}</p>`
    newRow.insertCell(1).innerHTML = 
    `<p class="invoice-item-price">${pricing}</p>`
}
function recommendCategory (weight) { // Finds the recommended category based on the users's weight 
    return weightLimits.find(category => weight <= category.limit)?.category ?? "heavyweight"
    // This one was tough but fun logic to figure out
}
// EXECUTION
// Changes the text in the website to correspond to the submitted values
nameSpan.innerText = results.username 
planTierSpan.innerText = capitalize(trainingPlan)
const chosenCategory = convertCase(weightCategory, "cC", "P-K-C") // Properly formated
const recommendedCategory = convertCase(recommendCategory(results.weight), "cC", "P-K-C")
weightCategorySpan.innerText = chosenCategory
// Changes the notes regarding the chosen category depending if its the most suitable category or not
weightNotesSpan.innerText =  (recommendedCategory === chosenCategory) ?`${chosenCategory} is a great fit for you!` : `while you can technically participate in ${chosenCategory}, ${recommendedCategory} would be a better fit for you`
newInvoiceItem(
    capitalize(trainingPlan) + " training",
    privateHours ? `${privateHours} ${privateHours === 1 ? "hour" : "hours"} of training weekly` : `${plans[trainingPlan].sessions} training sessions per week`,
    `${round(plans[trainingPlan].fee * (privateHours || 1) * 4)} AED`
)
// If competitions are enabled, this crates a separate row for the price of competitions
if (results.competitions) {newInvoiceItem("Monthly competitions", "On the second Saturday of each month", `${round(competitionsFee)} AED`)}
// Calculates the total with the fee, wether or not if there are competitions, and if it should be multipplied by the hours in the case of an hourly rate
let total = calculateTotal(plans[trainingPlan].fee, results.competitions, competitionsFee, privateHours || 1)
newInvoiceItem("Total", "",`${round(total)} AED`, true)
} else { // If not all elements are found
    console.error(`Unable to find ${vitalElementsCheck.failed} vital element${plural(vitalElementsCheck.failed)}: ${convertCase(vitalElementsCheck.failedElements, "cC", "eng")}`)
    alert("page failed loading, try refreshing or contact team nogueira if issue persists")
}