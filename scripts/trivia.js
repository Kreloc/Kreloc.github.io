const triviaUri = 'http://jservice.io/api/';
var proxyUrl = 'https://cors-anywhere.herokuapp.com/';

var clueCategories = "";
var clues = "";
var offset = 0;
var clueCategoriesData = [];
var clueCategoryCluesData = [];
var clueAnswers = [];
var pickedCategoryId = "";
var pickedClueId = "";
var getTheseValues = [200,400,600,800,1000];
var score = 0;
var onlyTheseClues = [];
var foundAnId = "";
var timeCount = 11;

// TODO: Bugfix for timer after buzz in button used. Loops through timer on main page afterwards that needs to finsih before going to next clue.
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
    var foundClues = clueCategoryCluesData.find(x => x.id == id);
    foundClues = foundClues.clues.filter(x => getTheseValues.includes(x.value))
    .sort(function(a, b){return a.value - b.value});
    if (foundClues != null) {
        if (foundClues.length > 5) {
            getOnlyFive(foundClues);
            foundClues = onlyTheseClues;
        }
        clues = "";
        clues = '<ul class="theClues">';
        foundClues.forEach(x => clues += '<li class="clueValue"><a href="#" onClick="displayClue(' + "'" + x.id + "'" + ')">$' + x.value + '</a></li>');
        clues += '</ul>';
        document.getElementById("c" + id).innerHTML = clues;
    }
}

function displayClue(identifier) {
    document.getElementById("categories").style = "visibility: hidden;";
    var divToEdit = document.getElementById("catClues");
    var onlyOneClue = getClueById(identifier);
    divToEdit.innerHTML = '<div class="clueQuestionAlt">' + onlyOneClue.question + '</div>';
    document.getElementById("userAnswerButton").style = "visibility: visible;"
    document.getElementById("userAnswerButton").innerHTML = '<button onclick="performBuzzIn(' + onlyOneClue.id + ')">Buzz In</button>'
    performTimeCountDown("clue", identifier);
}

function getClueById(identifier) {
    var thisCatId = clueCategoryCluesData.find(x => x.clues.find(y => y.id == identifier));
    var foundClues = clueCategoryCluesData.find(x => x.id == thisCatId.id);
    foundClues = foundClues.clues.filter(x => getTheseValues.includes(x.value))
    .sort(function(a, b){return a.value - b.value});
    if (foundClues != null) {
        if (foundClues.length > 5) {
            getOnlyFive(foundClues);
            foundClues = onlyTheseClues;
        }
    }
    var onlyOneClue = foundClues.find(x => x.id == identifier);
    return onlyOneClue    
}

function displayAnswer(identifier)
{
    // clear away buzz in button
    document.getElementById("userAnswerButton").innerHTML = "";
    document.getElementById("categories").style = "visibility: hidden;";
    var divToEdit = document.getElementById("catClues");
    var onlyOneClue = getClueById(identifier);
    divToEdit.innerHTML = '<div class="clueQuestionAlt">' + onlyOneClue.answer + '</div>';
    performTimeCountDown("answer", identifier);

}

function performTimeCountDown(clueOrAnswer, clueId)
{
    var timeDiv = document.getElementById("userTimer");
    var timer = setInterval(function() {
        console.log(timeCount);
        timeDiv.innerHTML = timeCount;
        timeCount--;
        if(timeCount === 0) {
          stopInterval()
        }
      }, 1000);
      
      var stopInterval = function() {
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
        // reset timeCount back to 11
        timeCount = 11;
      }
}

function performBuzzIn(clueId)
{
    var userAnswer = prompt("Please enter your answer");
    // perform same stripping of 'extra' characters as done on the clue
    // now if user enters: the Crusaders, checks only for Crusaders
    userAnswer = userAnswer.toLocaleLowerCase().replace('"',"").replace('"',"").replace('an ',"").replace('<i>',"").replace('</i>',"").replace('the ',"").replace("a ","");
    console.log("The user answer being checked has become " + userAnswer);
    var clueAnswer = getClueById(clueId);
    // move back to direct comparison, except due some replacing on the clue answer to get rid of silly things.
    var checkAgainstThisAnswer = clueAnswer.answer.toLocaleLowerCase().replace('"',"").replace('"',"").replace('an ',"").replace('<i>',"").replace('</i>',"").replace('the ',"").replace("a ","");
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
    timeCount = 1;
    console.log("Player currently has $" + score);
    document.getElementById("userArea").innerText = "Player currently has $" + score;
    displayAnswer(clueId);
}

