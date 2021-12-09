const router = require('express').Router();
const path = require('path');
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(animalRoutes);
router.use(require('./zookeeperRoutes'));

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"));
  });
  
  router.get("/animals", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/animals.html"));
  });
  
  router.get("/zookeepers", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/zookeepers.html"));
  });
  
  router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

module.exports = router;