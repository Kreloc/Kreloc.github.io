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
    data.forEach(x => clueCategories += '<div class="column"><a href="#" onClick="getCluesByCategoryId(' + x.id + ')">' + x.title + "</a><div id=" + '"c' + x.id + '"></div></div>');
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
        foundClues.forEach(x => clues += '<li class="clueValue"><a href="#" onClick="unHideElement(' + "'q" + x.id + "'" + ')">$' + x.value + '</a></li>' + '<li id="q' + x.id + '" class="clueQuestion">' + '<a href="#" onClick="unHideElement(' + "'a" + x.id + "'" + ')">' + x.question + '</a></li><li id="a' + x.id + '" ' + 'class="clueAnswer">' +  x.answer + "</li>"
        );
        clues += '</ul>'
        document.getElementById("c" + id).innerHTML = clues;
    }
}

function unHideElement(identifier)
{ 
    if (identifier.includes("q")) {
        // light up the buzz in button        
        pickedClueId = identifier.substring(1);
        findCategoryId(pickedClueId);
        document.getElementById("userAnswerButton").style = "visibility: visible;"
        document.getElementById("userAnswerButton").innerHTML = '<button onclick="performBuzzIn(' + pickedCategoryId +',' + pickedClueId + ')" id="' + pickedCategoryId + pickedClueId +'">Buzz In</button>'
    }
    document.getElementById(identifier).style = "visibility: visible;"
}

function performBuzzIn(categoryId, clueId)
{
    var userAnswer = prompt("Please enter your answer");
    // perform same stripping of 'extra' characters as done on the clue
    // now if user enters: the Crusaders, checks only for Crusaders
    userAnswer = userAnswer.toLocaleLowerCase().replace('"',"").replace('an ',"").replace('<i>',"").replace('</i>',"").replace('the ',"").replace("a ","");
    console.log("The user answer being checked has become " + userAnswer);
    var foundClues = clueCategoryCluesData.find(x => x.id == categoryId);
    var clueAnswer = foundClues.clues.find(x => x.id == clueId);
    // move back to direct comparison, except due some replacing on the clue answer to get rid of silly things.
    var checkAgainstThisAnswer = clueAnswer.answer.toLocaleLowerCase().replace('"',"").replace('an ',"").replace('<i>',"").replace('</i>',"").replace('the ',"").replace("a ","");
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
    unHideElement("a" + clueId);
    console.log("Player currently has a score of " + score);
    document.getElementById("userArea").innerText = "Current score is: " + score;
    document.getElementById("userAnswerButton").style = "visibility: hidden;"
}

function findCategoryId(clueId) {
    foundAnId = "";
    for (let index = 0; index < clueCategoryCluesData.length; index++) {
        const element = clueCategoryCluesData[index];
        for (let otherIndex = 0; otherIndex < element.clues.length; otherIndex++) {
            const clueElement = element.clues[otherIndex];
            if (clueElement.id == clueId) {
                foundAnId = element.id
            }
        }
        
    }
}
