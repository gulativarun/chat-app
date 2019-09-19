var socket = io();

function scrollToBottom(){

	var messages = $('#msg-list');
	var newMessage = messages.children('li:last-child');

	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight){
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect',function(){
	console.log('connected to server');
});

socket.on('disconnect',function(){
	console.log('disconnected');
});

socket.on('newMsg', function(argsm){
		
	var formattedTime = moment(argsm.createdAt).format('h:mm a');
	var li = $('<li></li>');
	li.text(`${argsm.from} ${formattedTime}: ${argsm.text}`);
	$('#msg-list').append(li);
	scrollToBottom();
});

socket.on('newLocation', function(argsm){
	var formattedTime = moment(argsm.createdAt).format('h:mm a');
	var li = $('<li></li>');
	var a = $('<a target="_blank">My current location</a>');

	li.text(`${argsm.from} ${formattedTime}: `);
	a.attr('href', argsm.url);
	li.append(a);
	$('#msg-list').append(li);
	scrollToBottom();
});


$('#msg-form').on('submit', function (e) {
	e.preventDefault();

	socket.emit('createMsg',{
		from: 'User',
		text: $('[name=msg]').val()
	},
	function(){
		$('[name=msg]').val('');
	});	
});


var locationButton = $('#send-location');
locationButton.on('click', function(){
	if ("geolocation" in navigator) {
		
	  	navigator.geolocation.getCurrentPosition(function(postion){
	  		locationButton.attr('disabled', 'disabled').text('Sending location...');
	  		socket.emit('location',{
	  			latitude: postion.coords.latitude,
	  			longitude: postion.coords.longitude
	  		},
			function(){
				locationButton.removeAttr('disabled').text('Send location');
			});	
	  	}, function(){
	  		alert('Not available');
	  	});

	} else {
		locationButton.removeAttr('disabled').text('Send location');
		return alert('Sorry, Feature not available');
	}
});

