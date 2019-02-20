const triviaUri = 'http://jservice.io/api/';
var proxyUrl = 'https://cors-anywhere.herokuapp.com/';

var clueCategories = "";
var clues = "";
var offset = 0;
var clueAnswers = [];
function getRandomJService()
{
fetch(proxyUrl + triviaUri + "random")   
  .then(blob => blob.json())
  .then(data => {
    console.table(data);
    console.log(JSON.stringify(data));
    // document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
    document.getElementById("randomTrivia").innerHTML = data[0].question + "<br />" + data[0].answer;
    //return data;
  })
  .catch(e => {
    console.log(e);
    return e;
  });
}

function getRandom5() {
    return getRandomInt(1, 50) * 5; // Returns 10, 20, 30, 40 or 50
}
    
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
    
offset = getRandom5();
console.log("Offset is set at " + offset);
fetch(proxyUrl + triviaUri + "categories?count=5&offset=" + offset)   
  .then(blob => blob.json())
  .then(data => {
    console.table(data);
    console.log(JSON.stringify(data));
    // document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
    clueCategories += '<ul class="clueCategory">'
    data.forEach(x => clueCategories += '<li><a href="#" onClick="getCluesByCategoryId(' + x.id + ')">' + x.title + "</a></li>");
    clueCategories += '</ul>'
    document.getElementById("categories").innerHTML = clueCategories;
    //return data;
  })
  .catch(e => {
    console.log(e);
    return e;
  });


function getCluesByCategoryId(id)
{
    emptyDiv("catClues");
    fetch(proxyUrl + triviaUri + "category?id=" + id)   
    .then(blob => blob.json())
    .then(data => {
      console.table(data);
      console.log(JSON.stringify(data));
      // document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
      // empty clues var before filling it
      
      clues = "";
      clues = '<ul class="theClues">';
      data.clues.forEach(x => clues += '<li class="clueValue"><a href="#" onClick="unHideElement(' + "'q" + x.value + "'" + ')">' + x.value + '</a></li>' + '<li id="q' + x.value + '" class="clueQuestion">' + '<a href="#" onClick="unHideElement(' + "'a" + x.value + "'" + ')">' + x.question + '</a></li><li id="a' + x.value + '" ' + 'class="clueAnswer">' +  x.answer + "</li>"      
      );
      data.clues.forEach(x => clueAnswers.push(x.answer));
      // '<a href="#" onClick="unHideElement(' + "'a" + x.value + "'" + ')">'
      clues += '</ul>'

      document.getElementById("catClues").innerHTML = clues;
      //return data;
    })
    .catch(e => {
      console.log(e);
      return e;
    });    
}

function unHideElement(identifier)
{
    // function to add style elements to html tags directly as those will override the css file?
    //var changeThese = document.getElementsByClassName("clueQuestion")
    document.getElementById(identifier).style = "visibility: visible;"
}

function emptyDiv(id)
{
    // empty a div using id
    document.getElementById(id).innerHTML = "";
}

function performBuzzIn()
{
    var userAnswer = prompt("Please enter your answer");
    var foundIt = clueAnswers.find(x => x == userAnswer);
    if (foundIt != null) {
        alert("You answered correctly!");
    }
    else {
        console.log("Not the correct answer. Needs exact match for now");
    }

}