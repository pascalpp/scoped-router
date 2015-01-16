var express = require('express');
var router = express.Router();

/* Redirect http://localhost:9000 to http://localhost:9000/slides */
router.get('', function(req, res) {
  res.redirect('/slides');
});

/* Serve index.html for all GET requests for any URL */
router.get('*', function(req, res) {
  res.render('index', { title: 'Tabbed Views and Scoped Routing' });
});

module.exports = router;
