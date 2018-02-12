var express = require('express');
var router = express.Router();
var Member = require('../models/Member');
var Article = require('../models/Article');
var async = require('async');

router.get('/new', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }

  res.render('postArticle', {
  member : req.session.member || null
  });
});

router.get('/search', function(req, res, next) {
  Article.getAll(function(err, articleList) {
    if(err) {
      next();
    } else {
      //這邊的做法是使用async each這樣的方式幫我們從articleList中一筆筆去找到member，然後新增一個key叫member在article物件中
      async.each(articleList, function(article, cb) {
        Member.get(article.memberId, function(err, member) {
          if(err) {
            cb(err);
          } else {
            article.member = member;
            cb(null);
          }
        });
      }, function(err){
        if(err) {
          res.status = err.code;
          next();
        } else {
          res.render('articleSearch',
          {
            member : req.session.member || null,
            articleList: articleList
          });
        }
      });

    }
  });
});




router.get('/:articleId', function(req, res, next) {
  Article.get(req.params.articleId, function(err, article) {
    if(err) {
      console.log(err);
      next();
    } else {
      Member.get(article.memberId, function(err, member) {
        if(err) {
          console.log(err);
        } else {
          article.member = member;
          res.render('articleDetail', {
            article : article,
            member : req.session.member || null
          });
        }
      })

    }
  });
});




router.put('/:articleId', function(req, res, next){
  //必須先取得battery在進行update
  Article.get(req.params.articleId, function(err, article){
    if(err){
      console.log(err);
      next();
    }else{
      //取得article,進行update及save
      article.title = req.body.title || article.title;
      article.content = req.body.content || article.content;
      article.save(function(err){
        if(err){
          res.status(err.code);
          res.json(err);
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

  var newArticle = new Article({
    title : req.body.title,
    content : req.body.content,
    memberId : req.session.member.id
  });

  newArticle.save(function(err) {
    if(err) {
      res.status = err.code;
      res.json(err);
    } else {

      res.redirect("/");
    }
  });
});



module.exports = router;
