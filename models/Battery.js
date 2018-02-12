//這是battery model
var db = require('../libs/db');//引入sql builder
var GeneralErrors = require('../errors/GeneralErrors');


var Battery = function(options){
  this.battery_ID = options.battery_ID;
  this.battery_name = options.battery_name;
  this.battery_price = options.battery_price;
  this.completed_date = options.completed_date;
  this.memberId = options.memberId;

};

Battery.getAll = function(cb) {
  db.select()
    .from('battery')
    .map(function(row) {
      return new Battery({
        battery_ID : row.battery_ID,
        battery_name : row.battery_name,
        battery_price : row.battery_price,
        completed_date : row.completed_date,
        memberId : row.member_id
      });
    })
    .then(function(batteryList) {
      cb(null, batteryList);
    })
    .catch(function(err) {
      cb(new GeneralErrors.Database());
    });
}


//class function
Battery.get = function(batteryID, cb){
  //傳入一個batteryID時，進入資料庫找出相對應的battery_ID
  db.select()
    .from('battery')
    .where({
      battery_ID : batteryID
    })
    .map(function(row){
      return new Battery({
        battery_ID : row.battery_ID,
        battery_name : row.battery_name,
        battery_price : row.battery_price,
        completed_date : row.completed_date,
        memberId : row.member_id
      });
    })
    .then(function(batteryList){
      if(batteryList.length){
        cb(null, batteryList[0]);
      }else{
       //產生NotFound err給前端
        cb(null, new GeneralErrors.NotFound());
      }
    })
    .catch(function(err){
      console.log(err);
      cb(new GeneralErrors.Database());
    })
}

//測試search功能
Battery.getbyname = function(batteryname, cb) {
	db.select()
	  .from('battery')
	  .where({
	  	battery_name : batteryname
	  })
	  .map(function(row) {
      console.log(row);
	  	return new Battery({
        battery_ID : row.battery_ID,
        battery_name : row.battery_name,
        battery_price : row.battery_price,
        completed_date : row.completed_date,
        memberId : row.member_id
	  	});
	  })
	  .then(function(batterySearchList) {
	  	if(batteryList.length) {
	  		cb(null, batterySearchList);
	  	} else {
	  		cb(new GeneralErrors.NotFound());
	  	}
	  })
	  .catch(function(err) {
	  	console.log(err);
	  	cb(new GeneralErrors.Database());
	  });
}
//測試search功能



//instance function
Battery.prototype.save = function(cb){
  //save是當物件不存在時新增，對DB做更新
  if(this.battery_ID){
    //已存在
    db("battery")
      .update({
        battery_name : this.battery_name,
        battery_price : this.battery_price
      })
      .where({
        battery_ID : this.battery_ID
      })
      .then(function(){
        cb(null);
      })
      .catch(function(err){
        console.log(err);
        cb(null, new GeneralErrors.Database());
      });
  } else {
    //不存在
    db("battery")
      .insert({
        battery_name : this.battery_name,
        battery_price : this.battery_price,
        member_id : this.memberId
      })
      .then(function(result) {
        this.battery_ID = result[0];
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log(err);
        cb(null, new GeneralErrors.Database());
      });
  }
};



module.exports = Battery;
