var express = require('express');
var router = express.Router();
var Member = require('../models/Member');
var Battery = require('../models/Battery');
var async = require('async');

router.get('/new', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }

  res.render('postBattery', {
    member : req.session.member || null
  });
});

//members test
router.get('/:batteryID', function(req, res, next) {
  Battery.get(req.params.batteryId, function(err, battery) {
    if(err) {
      console.log(err);
      next();
    } else {
      Member.get(battery.memberId, function(err, member) {
        if(err) {
          console.log(err);
        } else {
          battery.member = member;
          res.render('batteryDetail', {
            battery : battery,
            member : req.session.member || null
          });
        }
      })

    }
  });
});




router.post('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }

  var newBattery = new Battery({
    battery_name : req.body.battery_name,
    battery_price : req.body.battery_price,
    memberId : req.session.member.id
  });

  newBattery.save(function(err) {
    if(err) {
      res.status = err.code;
      res.json(err);
    } else {

      res.redirect("/");
    }
  });
});

router.put('/battery/:batteryID', function(req, res){
  //必須先取得battery在進行update
  Battery.get(req.params.batteryID, function(err, member){
    if(err){
      res.status(err.code);
      res.json(err);
    }else{
      //取得battery,進行update及save
      battery.battery_name = req.body.battery_name || battery.battery_name;
      battery.battery_price = req.body.battery_price || battery.battery_price;
      battery.save(function(err){
        if(err){
          res.status(err.code);
          res.json(err);
        }else{
          res.json(battery);
        }
      });
    }
  });

});

module.exports = router;
