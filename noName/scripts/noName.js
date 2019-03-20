// Code for noName simple game
// var person = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};
// this file is not being found. Making an edit and then saving to see if that resolves it.
let areaCounter = 0;
let validUserInput = [];
let input = document.getElementById("userInput");
// retrieve the movementStrings from the json file
// retrieve the areaDescriptions from the json file
// retrieve the placeHolderStrings from the json file


let movementStrings = [];
let areaDescriptions = [];
let placeholderStrings = [];
let nonValidInputStrings = [];
let player = [];
var currentArea = [];

Array.prototype.randomElement  = function(){
    return this[Math.floor(Math.random() * this.length)];
  }
// show loading text???
document.getElementById("areaDescription").innerHTML = "Loading...";
// const request = async () => {
//     let movementStringsResponse = await fetch("/noName/json/movementStrings.json");
//     movementStrings = await movementStringsResponse.json();
// }

let timeCount = 6;

function performTimeCountDown(clueOrAnswer, clueId)
{
    let timer = setInterval(function() {
        console.log(timeCount);
        // timeDiv.innerHTML = timeCount;
        timeCount--;
        if(timeCount === 0) {
          stopInterval()
        }
      }, 1000);
      
      let stopInterval = function() {
        console.log('time is up!');
        document.getElementById("areaChoiceResonse").innerHTML = "";
        document.getElementById("areaDescription").style.visibility = "false";
        document.getElementById("areaChoices").style.visibility = "false";
        clearInterval(timer);
        timeDiv.innerHTML = "";
        // reset timeCount back to 11
        timeCount = 6;
      }
}

const otherRequest = async() => {
    let areaDescriptionsResponse = await fetch("/noName/json/areaDescriptions.json");
    areaDescriptions = await areaDescriptionsResponse.json();
    currentArea = areaDescriptions.find(x => x.areaId == areaCounter);
    fillAreaDescriptionDivs(currentArea);
}

const getPlaceHolderString = async() => {
    let placeHolderResponse = await fetch("/noName/json/placeHolderStrings.json");
    placeholderStrings = await placeHolderResponse.json();
    input.placeholder = placeholderStrings.randomElement();
}

const getPlayerInformation = async() => {
    let playerResponse = await fetch("/noName/json/player.json");
    player = await playerResponse.json();
}
const getNonValidInputStrings = async() => {
    let nonValidResponse = await fetch("/noName/json/nonValidInputStrings.json");
    nonValidInputStrings = await nonValidResponse.json();
}
// Not currently using movementStrings. That was a previous concecpt.
// request();
otherRequest();
getPlaceHolderString();
getPlayerInformation();
getNonValidInputStrings();
// TODO: Have array of strings for the placeHolder text that can be radnomly or selective retrieved.
// input.placeholder = "Enter choice";
console.log(input);


function emptyContent(newArea)
{
    console.log("attempting to empty div contents");
    document.getElementById("areaDescription").innerHTML = "";
    document.getElementById("areaChoices").innerHTML = "";
    document.getElementById("userInput").innerHTML = "";
    document.getElementById("areaChoiceResonse").value = "";   
}

function fillAreaDescriptionDivs(area)
{
    console.log(area);
    emptyContent();
    let areaTitle = document.getElementById("areaTitle");
    areaTitle.innerHTML = area.title;
    let areaDescriptionDiv = document.getElementById("areaDescription");
    areaDescriptionDiv.innerHTML = "<p>" + area.description + "</p>";
    let areaChoicesDiv = document.getElementById("areaChoices");
    let areaChoicesHtml = "";
    area.areaChoices.forEach(x => areaChoicesHtml += x.output);
    areaChoicesDiv.innerHTML = areaChoicesHtml;
}




function getChoiceResponse()
{
    console.log("attempting to get userInput");
    let userEntered = input.value;
    console.log(userEntered);
    if (userEntered != null) {
        let findUserChoice = currentArea.areaChoices.find(x => x.text == userEntered && x.IsAvailable);
        console.log(findUserChoice);
        if (findUserChoice == null) {
            // TODO: Have array of strings for this kind of failure response that is selected from randomly
            document.getElementById("areaChoiceResonse").innerHTML = "<p>" + nonValidInputStrings.randomElement() + "</p>";
        }
        else {
            if (findUserChoice.IsMovement) {
                // TODO: Have array of strings to describe different movement that is selected from semi randomly.
                let movementHtml = "";
                movementHtml += "<p> you moved " + findUserChoice.text + ".</p>";
                // get choice response from area
                movementHtml += findUserChoice.choiceDescription;
                document.getElementById("areaChoiceResonse").innerHTML = movementHtml;
                moveArea(findUserChoice);
            }
            else
            {
                // TODO: Have array of strings for each of the following user inputs as defined by another function, I think.
                interactWithArea(findUserChoice);
            }
            if (findUserChoice.IsGameOver) {
                // TODO: Have death text
                document.getElementById("areaDescription").innerHTML = "<p>You have died</p>";
            }
            if (findUserChoice.IsLoadNewArea) {
                areaCounter = areaCounter + findUserChoice.IncrementAreaCountBy;
                currentArea = areaDescriptions.find(x => x.areaId == areaCounter);
                // change the background picture for the new area
                // possibly change font colors as well
                // TODO: keep more information in the areaDescription json file relating to this style information?
                var bgImgDiv = document.getElementsByClassName('bgimg');
                var bgImgUrl = currentArea.stlyeData.backgroundImgUrl;
                bgImgDiv[0].style.backgroundImage = "url('" + bgImgUrl + "')";
                var divClass = "bgimg w3-display-container w3-animate-opacity ";
                divClass = divClass + currentArea.stlyeData.textColor;
                bgImgDiv[0].className = divClass;
                fillAreaDescriptionDivs(currentArea);
                input.placeholder = placeholderStrings.randomElement();
            }
            if (findUserChoice.PerformEncounter) {
                console.log("combat was tirggered");
                // TODO: implement logic in function for combat...
                // TODO: Change input layout for combat   
            }
        }
    }
}

function moveArea(wentToArea, leftFromArea)
{
    // TODO: Have this actually change the areaDescription and Choices
    
}
function interactWithArea(pickedChoice)
{
    // TODO: Have this actually change the areaChoiceResponse based on what type of interaction and where it is.
    // Have array of strings attached to each area and their choices.
    document.getElementById("areaDescription").style.visibility = "false";
    document.getElementById("areaChoices").style.visibility = "false";
    console.log(pickedChoice);
    let areaChoiceResponseHtml = "";
    areaChoiceResponseHtml += "<p> you " + pickedChoice.text + ".</p>";
    areaChoiceResponseHtml += pickedChoice.choiceDescription;
    document.getElementById("areaChoiceResonse").innerHTML = areaChoiceResponseHtml;
    if (pickedChoice.IsItemFound) {
        player[0].Items.push(pickedChoice.Item);
        console.log(player);
    }
    // timer go for six seconds before changing back to previous information
    performTimeCountDown();
}


