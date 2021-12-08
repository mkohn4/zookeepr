const path = require('path');
const router = require('express').Router();

//route that creates root homepage
router.get('/',(req,res) => {
    //when a user goes to the root homepage, serve up the public/index.html file
    res.sendFile(path.join(__dirname, './public/index.html'));
})

//send animals.html file when user naviagtes to root server/animnals
router.get('/animals', (req,res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
})
//send zoopers html page when user navigates to /zookepers page on server
//when user requests the zookeeper url, GET the request and RESPOND with above
router.get('/zookeepers', (req,res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
})

//if user naviagtes to a url on the domain that doesnt exist, take them to index
router.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, './publish/index.html'));
})