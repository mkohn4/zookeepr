const express = require('express');
const {animals} = require('./data/animals');
const fs = require('fs');
const path = require('path');
//set PORT equal to running process env port or 3001 if not
const PORT = process.env.PORT || 3001;

//instantiate server and assign to app so we can chain methods to it later
const app = express();
//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming json data
app.use(express.json());

app.use(express.static('public'));

//take in requested query paramters as an argument and filter animal json data to have a new filteres array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    //note that we save the animalsArray as filteredResults
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        //save personalityTraits as a dedicated array
        //if personalityTraits is a string, plave it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }-
        //loop through each trait in the personalityTrats array
        personalityTraitsArray.forEach(trait => {
            //check trait against each animal in the filteredResults array (which initially is a copy of the animalsArray)
            //For each trait being targeted by the filter, the filteredResults array will contain only entries that contain that trait
            //so at the end we have an array of animals that have each one of the traits when the forEach loop is finished
            filteredResults = filteredResults.filter(animal => {
                animal.personalityTraits.indexOf(trait) !== -1;
            });
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id,animalsArray) {
    //take id and array of animals and return a single animal object that matches the ID
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal (body, animalsArray) {
    console.log(body);
    //functions main code
    const animal = body;
    animalsArray.push(animal);

    //use fs writeFile method sycnhronously to write to animals.json file
    //in data subdirectory and use path.join() to join value of __dirname
    //which is where the file is we execute the code in, with the animals.json path
    fs.writeFileSync(
        path.join(__dirname, './data/ainals.json'),
        //save js array data as JSON
        //use null argument to not overwrite existing data
        //2 argument calls out whitespace to add between values to make it readable
        JSON.stringify({animals: animalsArray}, null, 2)
    );
    //return finished code to post route for response
    return animal;
};

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;

}


//add route for animals json for app
//GET string that describes route client will fetch from
//THEN callback function to execute each time route is accessed with GET
app.get('/api/animals', (req,res) => {
    //When callback fn called, and response received, send 'hello' to client
    //res.send('hello!');
    //UPDATE response to send animals JSON data to client
    //res.json(animals);
    //UPDATE2 access query proprty on the request object to console log filtered query string data from json
    let results = animals;
    //if there is a query string in the URL, results to send to client should be filtered by the querystring parameter
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    console.log(req.query);
    res.json(results);
});

//GET request to return a single animal by ID
app.get('/api/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        //if a result is returned from the id return the animal
        res.json(result);
    } else {
        //else send a 404 error
        res.send(404);
    }
});

//app method wherein a client requests a server to accept data
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);

    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        //when we get a 400 error response, send this error
        res.status(400).send('The animal is not properly formatted');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }


    //add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    //send data back as json
    res.json(req.body);
  });

  //route that creates root homepage
  app.get('/',(req,res) => {
      //when a user goes to the root homepage, serve up the public/index.html file
      res.sendFile(path.join(__dirname, './public/index.html'));
  })

  //send animals.html file when user naviagtes to root server/animnals
  app.get('/animals', (req,res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
  })
//send zoopers html page when user navigates to /zookepers page on server
//when user requests the zookeeper url, GET the request and RESPOND with above
  app.get('/zookeepers', (req,res) => {
      res.sendFile(path.join(__dirname, './public/zookeepers.html'));
  })

//if user naviagtes to a url on the domain that doesnt exist, take them to index
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, './publish/index.html'));
})

//setup listen() method on server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


