var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users test listing. */
router.get('/test', function(req, res, next) {
  res.send('this is a test');
});
module.exports = router;
