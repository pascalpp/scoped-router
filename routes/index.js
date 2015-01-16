var express = require('express');
var router = express.Router();

/* Serve index.html for all GET requests for any URL */
router.get('*', function(req, res) {
  res.render('index', { title: 'Tabbed Views and Scoped Routing' });
});

module.exports = router;
