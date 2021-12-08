const {filterByQuery, findById, createNewAnimal, validateAnimal} = require('../../lib/animals');
const {animals} = require('../../data/animals.json');
const router = require('express').Router();

//add route for animals json for app
//GET string that describes route client will fetch from
//THEN callback function to execute each time route is accessed with GET
router.get('/animals', (req,res) => {
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
router.get('/animals/:id', (req,res) => {
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
router.post('/animals', (req, res) => {
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

  module.exports = router;