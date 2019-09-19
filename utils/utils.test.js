const expect = require('expect');
const utils = require('./utils');
const app  = require('./../app.js').app;

console.log(app.listen)

it('testing an api',(done)=>{
	request(app)
	  .get('/')
	  // .expect('Content-Type', /json/)
	  // .expect('Content-Length', '15')
	  .expect(200)
	  .end(function(err, res) {
	    if (err) throw err;
	    done();
	});

})
