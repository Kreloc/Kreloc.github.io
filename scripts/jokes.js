const dadJokeUri = "http://icanhazdadjoke.com/";
const dadJokeHeaders = {'Accept':'application/json'};

const randomJokeUri = 'https://official-joke-api.appspot.com/random_joke';

fetch(randomJokeUri)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
    document.getElementById("randomJoke").innerHTML = myJson.setup + "<br /> " + myJson.punchline;
  });
