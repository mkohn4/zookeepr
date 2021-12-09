const {filterByQuery, findById, createNewAnimal, validateAnimal, validateZookeeper, createNewZookeeper} = require('../../lib/zookeepers');
const {zookeepers} = require('../../data/zookeepers.json');
const router = require('express').Router();

//add route for zookeepers json for app
//GET string that describes route client will fetch from
//THEN callback function to execute each time route is accessed with GET
router.get('/zookeepers', (req,res) => {
    //When callback fn called, and response received, send 'hello' to client
    //res.send('hello!');
    //UPDATE response to send zookeepers JSON data to client
    //res.json(zookeepers);
    //UPDATE2 access query proprty on the request object to console log filtered query string data from json
    let results = zookeepers;
    //if there is a query string in the URL, results to send to client should be filtered by the querystring parameter
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    console.log(req.query);
    res.json(results);
});

//GET request to return a single animal by ID
router.get('/zookeepers/:id', (req,res) => {
    const result = findById(req.params.id, zookeepers);
    if (result) {
        //if a result is returned from the id return the animal
        res.json(result);
    } else {
        //else send a 404 error
        res.send(404);
    }
});

//app method wherein a client requests a server to accept data
router.post('/zookeepers', (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);

    //set id based on what the next index of the array will be
    req.body.id = zookeepers.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if (!validateZookeeper(req.body)) {
        //when we get a 400 error response, send this error
        res.status(400).send('The zookeeper is not properly formatted');
    } else {
        const zookeeper = createNewZookeeper(req.body, zookeepers);
        res.json(zookeeper);
    }
  });

  module.exports = router;