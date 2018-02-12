var express = require('express');
var router = express.Router();
var Member = require('../models/Member');
var Dealer = require('../models/Dealer');
var async = require('async');

router.get('/new', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }

  res.render('postDealer', {
    member : req.session.member || null
  });
});

router.get('/search', function(req, res, next) {
  Dealer.getAll(function(err, dealerList) {
    if(err) {
      next();
    } else {
      async.each(dealerList, function(dealer, cb) {
        Member.get(dealer.memberId, function(err, member) {
          if(err) {
            cb(err);
          } else {
            dealer.member = member;
            cb(null);
          }
        });
      }, function(err){
        if(err) {
          res.status = err.code;
          next();
        } else {
          res.render('dealerSearch',
          {
            member : req.session.member || null,
            dealerList: dealerList
          });
        }
      });

    }
  });
});


//members test
router.get('/:dealerID', function(req, res, next) {
  Dealer.get(req.params.dealerID, function(err, dealer) {
    if(err) {
      console.log(err);
      next();
    } else {
      Member.get(dealer.memberId, function(err, member) {
        if(err) {
          console.log(err);
        } else {
          dealer.member = member;
          res.render('dealerDetail', {
            dealer : dealer,
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

  var newDealer = new Dealer({

    dealer_name : req.body.dealer_name,
    dealer_phone : req.body.dealer_phone,
    dealer_email : req.body.dealer_email,
    dealer_address : req.body.dealer_address,
    memberId : req.session.member.id
  });

  newDealer.save(function(err) {
    if(err) {
      res.status = err.code;
      res.json(err);
    } else {

      res.redirect("/");
    }
  });
});


module.exports = router;
