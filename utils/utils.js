module.exports.add = (a,b) => a+b;

module.exports.square = (a) => a**a;


module.exports.user = (user,fullname) => {
	let name = fullname.split(' ');
	user.firstname = name[0];
	user.lastname = name[1];
	return user;
}