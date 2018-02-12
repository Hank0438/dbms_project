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

router.get('/search', function(req, res, next) {
  Battery.getAll(function(err, batteryList) {
    if(err) {
      next();
    } else {
      //這邊的做法是使用async each這樣的方式幫我們從articleList中一筆筆去找到member，然後新增一個key叫member在article物件中
      async.each(batteryList, function(battery, cb) {
        Member.get(battery.memberId, function(err, member) {
          if(err) {
            cb(err);
          } else {
            battery.member = member;
            cb(null);
          }
        });
      }, function(err){
        if(err) {
          res.status = err.code;
          next();
        } else {
          res.render('batterySearch',
          {
            member : req.session.member || null,
            batteryList: batteryList
          });
        }
      });

    }
  });
});


//測試searche功能

router.get('/search/result', function(req, res) {
  res.render('batterySearchResult', {

  });
});


router.post('/', function(req, res, next) {
  var inputname = req.body.inputname;
  Battery.getbyname(inputname, function(err, batterySearchList) {
  	if(err) {
  		console.log(err);
  	} else {
  		res.render('batterySearchResult',
  		{
  			batterySearchList : batterySearchList
  		});
  	}
  });
});
//測試searche功能


//members test
router.get('/:batteryID', function(req, res, next) {
  Battery.get(req.params.batteryID, function(err, battery) {
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

router.put('/:batteryId', function(req, res, next){
  //必須先取得battery在進行update
  Battery.get(req.params.batteryId, function(err, battery){
    if(err){
      console.log(err);
      next();
    }else{
      //取得battery,進行update及save

      battery.battery_name = req.body.battery_name || battery.battery_name;
      battery.battery_price = req.body.battery_price || battery.battery_price;
      battery.save(function(err){
        if(err){
          console.log(err);
          next();
        }else{
          res.redirect("/");
        }
      });
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



module.exports = router;
