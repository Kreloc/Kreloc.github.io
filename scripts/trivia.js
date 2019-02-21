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
//
// gather and cache all the data before displaying any of it?
// var player = {
//     score = 0,

// }
var score = 0;
// function getRandomJService()
// {
// fetch(proxyUrl + triviaUri + "random")   
//   .then(blob => blob.json())
//   .then(data => {
//     console.table(data);
//     console.log(JSON.stringify(data));
//     // document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
//     document.getElementById("randomTrivia").innerHTML = data[0].question + "<br />" + data[0].answer;
//     //return data;
//   })
//   .catch(e => {
//     console.log(e);
//     return e;
//   });
// }

function getRandom5() {
    return getRandomInt(1, 50) * 5; // Returns 10, 20, 30, 40 or 50
}
    
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
    
offset = getRandom5();
console.log("Offset is set at " + offset);
fetch(proxyUrl + triviaUri + "categories?count=6&offset=" + offset)   
  .then(blob => blob.json())
  .then(data => {
    console.table(data);
    console.log(JSON.stringify(data));
    // document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
    clueCategories += '<ul class="clueCategory">'
    data.forEach(x => clueCategories += '<li><a href="#" onClick="getCluesByCategoryId(' + x.id + ')">' + x.title + "</a></li>");
    data.forEach(x => clueCategoriesData.push(x));
    clueCategoriesData.forEach(x => getCluesByCategoryIdForData(x.id));
    clueCategories += '</ul>'
    document.getElementById("categories").innerHTML = clueCategories;
    //return data;
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
      console.table(data);
      console.log(JSON.stringify(data));
      clueCategoryCluesData.push(data);
      //data.clues.forEach(x => clueCategoryCluesData.push(x));
    })
    .catch(e => {
        console.log(e);
        return e;
      });      
}

function getCluesByCategoryId(id)
{
    emptyDiv("catClues");
    pickedCategoryId = id;
    var foundClues = clueCategoryCluesData.find(x => x.id == id);
    foundClues = foundClues.clues.filter(x => getTheseValues.includes(x.value))
    .sort(function(a, b){return a.value - b.value});
    if (foundClues != null) {
        if (foundClues.length > 5) {
            // TODO: do stuff to eliminate duplicate scores
        }
        clues = "";
        clues = '<ul class="theClues">';
        foundClues.forEach(x => clues += '<li class="clueValue"><a href="#" onClick="unHideElement(' + "'q" + x.id + "'" + ')">$' + x.value + '</a></li>' + '<li id="q' + x.id + '" class="clueQuestion">' + '<a href="#" onClick="unHideElement(' + "'a" + x.id + "'" + ')">' + x.question + '</a></li><li id="a' + x.id + '" ' + 'class="clueAnswer">' +  x.answer + "</li>"
        );
        clues += '</ul>'
        document.getElementById("catClues").innerHTML = clues;
    }
}

function unHideElement(identifier)
{
    // function to add style elements to html tags directly as those will override the css file?
    //var changeThese = document.getElementsByClassName("clueQuestion")    
    if (identifier.includes("q")) {
        // light up the buzz in button
        pickedClueId = identifier.substring(1);
        document.getElementById("userAnswerButton").style = "visibility: visible;"
        document.getElementById("userAnswerButton").innerHTML = '<button onclick="performBuzzIn(' + pickedCategoryId +',' + pickedClueId + ')" id="' + pickedCategoryId + pickedClueId +'">Buzz In</button>'
    }
    document.getElementById(identifier).style = "visibility: visible;"
}
function hideElement(identifier)
{
    document.getElementById(identifier).style = "visibility: hidden;"
}


function emptyDiv(id)
{
    // empty a div using id
    document.getElementById(id).innerHTML = "";
}

function performBuzzIn(categoryId, clueId)
{
    // get the right set of clues
    var userAnswer = prompt("Please enter your answer");
    var foundClues = clueCategoryCluesData.find(x => x.id == categoryId);
    var clueAnswer = foundClues.clues.find(x => x.id == clueId);
    if (clueAnswer.answer == userAnswer) {
        alert("You answered correctly!");
        if (clueAnswer.value != null) {
            score = score + clueAnswer.value;    
        }
        
    }
    else {
        console.log("Not the correct answer. Needs exact match for now");
        alert("You answered incorrectly :(");
        if (clueAnswer.value != null) {
            score = score - clueAnswer.value;    
        }        
    }
    unHideElement("a" + clueId);
    // hideElement(pickedCategoryId + pickedClueId);
    console.log("Player currently has a score of " + score);
    document.getElementById("userArea").innerText = "Current score is: " + score;
    // simply empty the userArea div each time to get rid of the button?
    document.getElementById("userAnswerButton").style = "visibility: hidden;"

}
