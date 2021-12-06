const express = require('express');
const {animals} = require('./data/animals');
//set PORT equal to running process env port or 3001 if not
const PORT = process.env.PORT || 3001;

//instantiate server and assign to app so we can chain methods to it later
const app = express();

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

//setup listen() method on server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


