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
let monsters = [];
var currentArea = [];

Array.prototype.randomElement  = function(){
    return this[Math.floor(Math.random() * this.length)];
  }

// roll dice to determine percentage
// function dynamicallyLoadScript(url) {
//     var script = document.createElement("script");  // create a script DOM node
//     script.src = url;  // set its src to the provided URL

//     document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
// }
// // lets try this again
// dynamicallyLoadScript("/noName/scripts/dice.js");

// Begin dice.js content
;(function(root){

    // From http://baagoe.com/en/RandomMusings/javascript/
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    function Mash() {
        var  n = 0xefc8249d
            ,mash;

        mash = function(data) {
            data = data.toString();
            for (var i = 0; i < data.length; i++) {
                n += data.charCodeAt(i);
                var h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 0x100000000; // 2^32
            }
            return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
        };

        mash.version = 'Mash 0.9';
        return mash;
    }

    // modified, from http://baagoe.com/en/RandomMusings/javascript/
    root.Alea = function Alea(){
        // Johannes Baagøe <baagoe@baagoe.com>, 2010
        var  args = [].slice.call(arguments)
            ,s0 = 0
            ,s1 = 0
            ,s2 = 0
            ,c = 1

            ,mash
            ,i
            ,random;

        if (args.length == 0) {
            args = [+new Date];
        }

        mash = Mash();
        s0 = mash(' ');
        s1 = mash(' ');
        s2 = mash(' ');

        for (i = 0; i < args.length; i++) {
            s0 -= mash(args[i]);
            if (s0 < 0) {
                s0 += 1;
            }
            s1 -= mash(args[i]);
            if (s1 < 0) {
                s1 += 1;
            }
            s2 -= mash(args[i]);
            if (s2 < 0) {
                s2 += 1;
            }
        }

        mash = null;

        random = function() {
            var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
            s0 = s1;
            s1 = s2;
            return s2 = t - (c = t | 0);
        };

        random.uint32 = function() {
            return random() * 0x100000000; // 2^32
        };

        random.fract53 = function() {
            return random() + 
                (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
        };

        random.version = 'Alea 0.9';
        random.args = args;
        return random;
    }

    // call a constructor with variable arguments
    // http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible/1608546#1608546
    function construct(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    }

    root.Dice = function(seed){
        this.gen = construct(Alea, arguments);
    }

    root.Dice.prototype = (function make(){
        var types =  {}
                    ,i

        for(i = 2; i <= 100; i++){
            types['d' + i] = (function(sides){
                return function(count, separate){
                    count = count || 1;

                    var rolls = []
                        ,total = 0
                        ,i = 0
                        ,a;

                    for(;i < count; i++){
                        a = ((this.gen()*sides)|0) + 1;
                        total += a;
                        rolls.push(a);
                    }

                    return separate === true
                        ? rolls
                        : total;
                }
            })(i)
        }

        return types;
    })();

})(typeof module === 'undefined'
    ? window
    : exports);
// End dice.js content
let dice = new Dice(); // defaults to +new Date() as a seed, can use any number of arguments for seeding

// show loading text???
document.getElementById("areaDescription").innerHTML = "Loading...";
// const request = async () => {
//     let movementStringsResponse = await fetch("/noName/json/movementStrings.json");
//     movementStrings = await movementStringsResponse.json();
// }

let timeCount = 6;

function performTimeCountDown()
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
        document.getElementById("areaDescription").style.visibility = "visible";
        document.getElementById("areaChoices").style.visibility = "visible";
        clearInterval(timer);
        // timeDiv.innerHTML = "";
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

const getMonsters = async() => {
    let monsterResponse = await fetch("/noName/json/monsters.json");
    monsters = await monsterResponse.json();
}
// Not currently using movementStrings. That was a previous concecpt.
// request();
otherRequest();
getPlaceHolderString();
getPlayerInformation();
getNonValidInputStrings();
getMonsters();
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
    // //                 <datalist id="thisAreaChoices">
// <select>
// <option value="JavaScript">JavaScript</option>
// <option value="Haskell">Haskell</option>
// <option value="Ruby">Ruby</option>
// <option value="Go">Go</option>
// <option value="Python">Python</option>
// <option value="etc">etc</option>
// </select>
// </datalist>
    let areaOptions = document.getElementById("thisAreaChoices");
    let optionDataListHtml = "<select>";
    area.areaChoices.filter(x => x.IsAvailable).forEach(x => 
        optionDataListHtml += '<option value="' + x.text + '">' + x.text + '</option>');
    optionDataListHtml += '</select>';
    areaOptions.innerHTML = optionDataListHtml;
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
            if (findUserChoice.IsAreaInteraction) {
                interactWithArea(findUserChoice);
            }
            if (findUserChoice.IsGameOver) {
                // TODO: Have death text
                document.getElementById("areaDescription").innerHTML = "<p>You have died</p>";
            }
            if (findUserChoice.IsRandomEncounter) {
                var rollAgainst = dice.d100();
                console.log("d100 check performed " + rollAgainst);
                if (rollAgainst > findUserChoice.PercentChanceOfOccurance) {
                    console.log("the random encounter was triggered");
                }
            }
            if (findUserChoice.PerformEncounter) {
                console.log("combat was tirggered");
                // find monster to fight
                let foundMonster = monsters.find(x => x.areaId == currentArea.areaId);
                document.getElementById("areaSpecificImg").style.backgroundImage = "url('" + foundMonster.ImageUrl + "')";
                // TODO: implement logic in function for combat...
                // TODO: Change input layout for combat   
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
    document.getElementById("areaDescription").style.visibility = "hidden";
    document.getElementById("areaChoices").style.visibility = "hidden";
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




