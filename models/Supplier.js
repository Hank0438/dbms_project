var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var Supplier = function(options) {
  this.supplier_ID = options.supplier_ID;
  this.supplier_name = options.supplier_name;
  this.supplier_phone = options.supplier_phone;
  this.supplier_email = options.supplier_email;
  this.supplier_address = options.supplier_address;
  this.memberId = options.memberId;
};

Supplier.getAll = function(cb) {
  db.select()
    .from('supplier')
    .map(function(row) {
      return new Supplier({
        supplier_ID : row.supplier_ID,
        supplier_name : row.supplier_name,
        supplier_phone : row.supplier_phone,
        supplier_email : row.supplier_email,
        supplier_address : row.supplier_address,
        memberId : row.member_id
      });
    })
    .then(function(supplierList) {
      cb(null, supplierList);
    })
    .catch(function(err) {
      cb(new GeneralErrors.Database());
    });
}

Supplier.get = function(supplierID, cb) {
  db.select()
    .from('supplier')
    .where({
      supplier_ID : supplierID
    })
    .map(function(row) {
      return new Supplier({
        supplier_ID : row.supplier_ID,
        supplier_name : row.supplier_name,
        supplier_phone : row.supplier_phone,
        supplier_email : row.supplier_email,
        supplier_address : row.supplier_address,
        memberId : row.member_id
      });
    })
    .then(function(supplierList) {
      if(supplierList.length) {
        cb(null, supplierList[0]);
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
Supplier.prototype.save = function (cb) {
  if(this.supplier_ID) {
    db('supplier')
      .update({
        supplier_name : this.supplier_name,
        supplier_phone : this.supplier_phone,
        supplier_email : this.supplier_email,
        supplier_address : this.supplier_address
      })
      .where({
        supplier_ID : this.supplier_ID
      })
      .then(function() {
        cb(null);
      })
      .catch(function(err) {
        console.log(err);
        cb(null, new GeneralErrors.Database());
      })
  } else {
    db('supplier')
      .insert({
        supplier_name : this.supplier_name,
        supplier_phone : this.supplier_phone,
        supplier_email : this.supplier_email,
        supplier_address : this.supplier_address,
        member_id : this.memberId
      })
      .then(function(result) {
        this.supplier_ID = result[0];
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log(err);
        cb(null, new GeneralErrors.Database());
      });
  }
};


module.exports = Supplier;
