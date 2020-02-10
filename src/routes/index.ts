// @ts-ignore
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req: any, res: any) {
  console.log(req.session);
  // @ts-ignore
  res.render('index', { title: 'Express', main_site_url: global.config.main_site_url });
});

module.exports = router;
