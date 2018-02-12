var express = require('express');
var router = express.Router();
var Member = require('../models/Member');
var Material = require('../models/Material');
var async = require('async');

router.get('/new', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }

  res.render('postMaterial', {
    member : req.session.member || null
  });
});

router.get('/search', function(req, res, next) {
  Material.getAll(function(err, materialList) {
    if(err) {
      next();
    } else {
      async.each(materialList, function(material, cb) {
        Member.get(material.memberId, function(err, member) {
          if(err) {
            cb(err);
          } else {
            material.member = member;
            cb(null);
          }
        });
      }, function(err){
        if(err) {
          res.status = err.code;
          next();
        } else {
          res.render('materialSearch',
          {
            member : req.session.member || null,
            materialList: materialList
          });
        }
      });

    }
  });
});


//members test
router.get('/:materialID', function(req, res, next) {
  Material.get(req.params.materialID, function(err, material) {
    if(err) {
      console.log(err);
      next();
    } else {
      Member.get(material.memberId, function(err, member) {
        if(err) {
          console.log(err);
        } else {
          material.member = member;
          res.render('materialDetail', {
            material : material,
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

  var newMaterial = new Material({

    parts_name : req.body.parts_name,
    inventory_quantity : req.body.inventory_quantity,
    material_price : req.body.material_price,
    memberId : req.session.member.id
  });

  newMaterial.save(function(err) {
    if(err) {
      res.status = err.code;
      res.json(err);
    } else {

      res.redirect("/");
    }
  });
});


module.exports = router;
