const {SHA256} = require('crypto-js');
var jwt = require('jsonwebtoken');
 
var data = {
	id: 10
};

var token = jwt.sign(data,'Trooking')

console.log(token);

var decoded = jwt.verify(token,'Trooking')

console.log(decoded);
var message = "I am user";

 