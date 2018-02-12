var express = require('express');
var router = express.Router();
var Member = require('../models/Member');
var Supplier = require('../models/Supplier');
var async = require('async');

router.get('/new', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }

  res.render('postSupplier', {
    member : req.session.member || null
  });
});

router.get('/search', function(req, res, next) {
  Supplier.getAll(function(err, supplierList) {
    if(err) {
      next();
    } else {
      async.each(supplierList, function(supplier, cb) {
        Member.get(supplier.memberId, function(err, member) {
          if(err) {
            cb(err);
          } else {
            supplier.member = member;
            cb(null);
          }
        });
      }, function(err){
        if(err) {
          res.status = err.code;
          next();
        } else {
          res.render('supplierSearch',
          {
            member : req.session.member || null,
            supplierList: supplierList
          });
        }
      });

    }
  });
});


//members test
router.get('/:supplierID', function(req, res, next) {
  Supplier.get(req.params.supplierID, function(err, supplier) {
    if(err) {
      console.log(err);
      next();
    } else {
      Member.get(supplier.memberId, function(err, member) {
        if(err) {
          console.log(err);
        } else {
          supplier.member = member;
          res.render('supplierDetail', {
            supplier : supplier,
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

  var newSupplier = new Supplier({

    supplier_name : req.body.supplier_name,
    supplier_phone : req.body.supplier_phone,
    supplier_email : req.body.supplier_email,
    supplier_address : req.body.supplier_address,
    memberId : req.session.member.id
  });

  newSupplier.save(function(err) {
    if(err) {
      res.status = err.code;
      res.json(err);
    } else {

      res.redirect("/");
    }
  });
});


module.exports = router;
