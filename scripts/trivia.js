const triviaUri = 'http://jservice.io/api/';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

let clueCategories = "";
let clues = "";
let offset = 0;
let clueCategoriesData = [];
let clueCategoryCluesData = [];
let clueAnswers = [];
let pickedCategoryId = "";
let pickedClueId = "";
let getTheseValues = [200,400,600,800,1000];
let score = 0;
let onlyTheseClues = [];
let foundAnId = "";
let timeCount = 5;

// TODO: Reduce amount of time answer is displayed
// TODO: Deal with answers that have values inside ()...typically these are not the answer rather an explanation of how it fits the clue category.

function getOnlyFive(foundClues)
{
    // empty the variable before filling it
    onlyTheseClues = [];
    for (let index = 0; index < getTheseValues.length; index++) {
        const element = getTheseValues[index];
        onlyTheseClues.push(foundClues.find(x => x.value == element));
    }
}
function getRandom5() {
    return getRandomInt(1, 50) * 5;
}
    
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
    
offset = getRandom5();
console.log("Offset is set at " + offset);
fetch(proxyUrl + triviaUri + "categories?count=6&offset=" + offset)   
  .then(blob => blob.json())
  .then(data => {
    data.forEach(x => clueCategories += '<div class="column">' + x.title + "<div id=" + '"c' + x.id + '"></div></div>');
    data.forEach(x => clueCategoriesData.push(x));
    clueCategoriesData.forEach(x => getCluesByCategoryIdForData(x.id));
    document.getElementById("categories").innerHTML = clueCategories;
  })
  .catch(e => {
    console.log(e);
    return e;
  });



function getCluesByCategoryIdForData(id)
{
    fetch(proxyUrl + triviaUri + "category?id=" + id)   
    .then(blob => blob.json())
    .then(data => {
      clueCategoryCluesData.push(data);
      clueCategoryCluesData.forEach(getCluesByCategoryId(id));
    })
    .catch(e => {
        console.log(e);
        return e;
      });      
}

function getCluesByCategoryId(id)
{
    document.getElementById("catClues").innerHTML = "";
    pickedCategoryId = id;
    let foundClues = clueCategoryCluesData.find(x => x.id == id);
    foundClues = foundClues.clues.filter(x => getTheseValues.includes(x.value))
    .sort(function(a, b){return a.value - b.value});
    if (foundClues != null) {
        if (foundClues.length > 5) {
            getOnlyFive(foundClues);
            foundClues = onlyTheseClues;
        }
        clues = "";
        clues = '<ul class="theClues">';
        foundClues.forEach(x => clues += '<li class="clueValue" id="v' + x.id + '"><a href="#" onClick="displayClue(' + "'" + x.id + "'" + ')">$' + x.value + '</a></li>');
        clues += '</ul>';
        document.getElementById("c" + id).innerHTML = clues;
    }
}

function displayClue(identifier) {
    document.getElementById("categories").style = "visibility: hidden;";
    // remove item clicked on
    document.getElementById("v" + identifier).innerHTML = "";
    let divToEdit = document.getElementById("catClues");
    let onlyOneClue = getClueById(identifier);
    divToEdit.innerHTML = '<div class="clueQuestionAlt">' + onlyOneClue.question + '</div>';
    document.getElementById("userAnswerButton").style = "visibility: visible;"
    document.getElementById("userAnswerButton").innerHTML = '<button onclick="performBuzzIn(' + onlyOneClue.id + ')">Buzz In</button>'
    performTimeCountDown("clue", identifier);
}

function getClueById(identifier) {
    let thisCatId = clueCategoryCluesData.find(x => x.clues.find(y => y.id == identifier));
    let foundClues = clueCategoryCluesData.find(x => x.id == thisCatId.id);
    foundClues = foundClues.clues.filter(x => getTheseValues.includes(x.value))
    .sort(function(a, b){return a.value - b.value});
    if (foundClues != null) {
        if (foundClues.length > 5) {
            getOnlyFive(foundClues);
            foundClues = onlyTheseClues;
        }
    }
    let onlyOneClue = foundClues.find(x => x.id == identifier);
    return onlyOneClue    
}

function displayAnswer(identifier)
{
    // clear away buzz in button
    document.getElementById("userAnswerButton").innerHTML = "";
    document.getElementById("categories").style = "visibility: hidden;";
    let divToEdit = document.getElementById("catClues");
    let onlyOneClue = getClueById(identifier);
    divToEdit.innerHTML = '<div class="clueQuestionAlt">' + onlyOneClue.answer + '</div>';
    performTimeCountDown("answer", identifier);

}

function performTimeCountDown(clueOrAnswer, clueId)
{
    let timeDiv = document.getElementById("userTimer");
    // if (clueOrAnswer == "answer") {
    //     // reduce the amount of time needed to end the countdown
    //     timeCount = 5;
    //     console.log("hit on where time should change...");
    //     console.log(timeCount);
    // }
    let timer = setInterval(function() {
        console.log(timeCount);
        timeDiv.innerHTML = timeCount;
        timeCount--;
        if(timeCount === 0) {
          stopInterval()
        }
      }, 1000);
      
      let stopInterval = function() {
        console.log('time is up!');
        if (clueOrAnswer == "clue") {
            displayAnswer(clueId);
        }
        if (clueOrAnswer == "answer") {
            document.getElementById("catClues").innerHTML = "";
            document.getElementById("categories").style = "visibility: visibile;";            
        }
        clearInterval(timer);
        timeDiv.innerHTML = "";
        // reset timeCount back to 5
        timeCount = 5;
      }
}

function performBuzzIn(clueId)
{
    let userAnswer = prompt("Please enter your answer");
    // perform same stripping of 'extra' characters as done on the clue
    // now if user enters: the Crusaders, checks only for Crusaders
    userAnswer = userAnswer.toLocaleLowerCase().replace('"',"").replace('"',"").replace('an ',"").replace('<i>',"").replace('</i>',"").replace('the ',"").replace("a ","");
    console.log("The user answer being checked has become " + userAnswer);
    let clueAnswer = getClueById(clueId);
    // move back to direct comparison, except due some replacing on the clue answer to get rid of silly things.
    let checkAgainstThisAnswer = clueAnswer.answer.toLocaleLowerCase().replace('"',"").replace('"',"").replace('an ',"").replace('<i>',"").replace('</i>',"").replace('the ',"").replace("a ","");
    console.log("The clue answer being checked against has become " + checkAgainstThisAnswer);

    if (checkAgainstThisAnswer == userAnswer) {
        alert("You answered correctly!");
        score = score + clueAnswer.value;
    }
    else {
        console.log("Not the correct answer. Uses direct match stripping out the, an, a, quote marks, and <i> tags");
        alert("You answered incorrectly :(");
        score = score - clueAnswer.value;
    }
    // timeCount = 11;
    
    console.log("Player currently has $" + score);
    document.getElementById("userArea").innerText = "Player currently has $" + score;
    timeCount = 1;
    // let the timeout display the answer
}

