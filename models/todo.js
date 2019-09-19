const mongoose = require('mongoose');


const Todo = mongoose.model('Todo', { 
	text: { 
		type: String 
	},
	completed: { 
		type: Boolean,
		default : false
	},
	completedAt: { 
		type: Number 
	},
	_creator: {
		required: true,
		type: mongoose.Schema.Types.ObjectId
	}
});


var newTodo = new Todo({
	text : 'Take a nap',
	completedAt : 2111
})

// newTodo.save().then((result)=>{
// 	console.log(result);
// },(err)=>{
// 	console.log(err);
// });

module.exports = {Todo}