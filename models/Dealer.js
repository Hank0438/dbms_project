var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var Dealer = function(options) {
  this.dealer_ID = options.dealer_ID;
  this.dealer_name = options.dealer_name;
  this.dealer_phone = options.dealer_phone;
  this.dealer_email = options.dealer_email;
  this.dealer_address = options.dealer_address;
  this.memberId = options.memberId;
};

Dealer.getAll = function(cb) {
  db.select()
    .from('dealer')
    .map(function(row) {
      return new Dealer({
        dealer_ID : row.dealer_ID,
        dealer_name : row.dealer_name,
        dealer_phone : row.dealer_phone,
        dealer_email : row.dealer_email,
        dealer_address : row.dealer_address,
        memberId : row.member_id
      });
    })
    .then(function(dealerList) {
      cb(null, dealerList);
    })
    .catch(function(err) {
      cb(new GeneralErrors.Database());
    });
}

Dealer.get = function(dealerID, cb) {
  db.select()
    .from('dealer')
    .where({
      dealer_ID : dealerID
    })
    .map(function(row) {
      return new Dealer({
        dealer_ID : row.dealer_ID,
        dealer_name : row.dealer_name,
        dealer_phone : row.dealer_phone,
        dealer_email : row.dealer_email,
        dealer_address : row.dealer_address,
        memberId : row.member_id
      });
    })
    .then(function(dealerList) {
      if(dealerList.length) {
        cb(null, dealerList[0]);
      } else {
        cb(null, new GeneralErrors.NotFound());
      }

    })
    .catch(function(err) {
      console.log(err);
      cb(new GeneralErrors.Database());
    });
}

//instance fnuction
Dealer.prototype.save = function (cb) {
  if(this.dealer_ID) {
    db('dealer')
      .update({
        dealer_name : this.dealer_name,
        dealer_phone : this.dealer_phone,
        dealer_email : this.dealer_email,
        dealer_address : this.dealer_address
      })
      .where({
        dealer_ID : this.dealer_ID
      })
      .then(function() {
        cb(null);
      })
      .catch(function(err) {
        console.log(err);
        cb(null, new GeneralErrors.Database());
      })
  } else {
    db('dealer')
      .insert({
        dealer_name : this.dealer_name,
        dealer_phone : this.dealer_phone,
        dealer_email : this.dealer_email,
        dealer_address : this.dealer_address,
        member_id : this.memberId
      })
      .then(function(result) {
        this.dealer_ID = result[0];
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log(err);
        cb(null, new GeneralErrors.Database());
      });
  }
};


module.exports = Dealer;
