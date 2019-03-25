const dogApiUri = "http://icanhazdadjoke.com/";
// const dadJokeHeaders = {'Accept':'application/json'};

const randomDogUri = 'https://dog.ceo/api/breeds/image/random';

fetch(randomDogUri)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
    document.getElementById("dogImage").src = myJson.message;
  });


function getNewDogImage()
{
    fetch(randomDogUri)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
    document.getElementById("dogImage").src = myJson.message;
  });
}
