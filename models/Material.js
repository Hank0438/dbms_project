var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var Material = function(options) {
  this.material_ID = options.material_ID;
  this.parts_name = options.parts_name;
  this.inventory_quantity = options.inventory_quantity;
  this.material_price = options.material_price;
  this.memberId = options.memberId;
};

Material.getAll = function(cb) {
  db.select()
    .from('material')
    .map(function(row) {
      return new Material({
        material_ID : row.material_ID,
        parts_name : row.parts_name,
        inventory_quantity : row.inventory_quantity,
        material_price : row.material_price,
        memberId : row.memberId
      });
    })
    .then(function(materialList) {
      cb(null, materialList);
    })
    .catch(function(err) {
      cb(new GeneralErrors.Database());
    });
}

Material.get = function(materialID, cb) {
  db.select()
    .from('material')
    .where({
      material_ID : materialID
    })
    .map(function(row) {
      return new Material({
        material_ID : row.material_ID,
        parts_name : row.parts_name,
        inventory_quantity : row.inventory_quantity,
        material_price : row.material_price,
        memberId : row.memberId
      });
    })
    .then(function(materialList) {
      if(materialList.length) {
        cb(null, materialList[0]);
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
Material.prototype.save = function (cb) {
  if(this.material_ID) {
    db('material')
      .update({
        parts_name : this.parts_name,
        inventory_quantity : this.inventory_quantity,
        material_price : this.material_price,
      })
      .where({
        material_ID : this.material_ID,
      })
      .then(function() {
        cb(null);
      })
      .catch(function(err) {
        console.log(err);
        cb(null, new GeneralErrors.Database());
      })
  } else {
    db('material')
      .insert({
        parts_name : this.parts_name,
        inventory_quantity : this.inventory_quantity,
        material_price : this.material_price,
        member_id : this.memberId
      })
      .then(function(result) {
        this.material_ID= result[0];
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log(err);
        cb(null, new GeneralErrors.Database());
      });
  }
};


module.exports = Material;
