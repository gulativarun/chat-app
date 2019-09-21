
(function($){
  $.deparam = $.deparam || function(uri){
    if(uri === undefined){
      uri = window.location.search;
    }
    var queryString = {};
    uri.replace(
      new RegExp(
        "([^?=&]+)(=([^&#]*))?", "g"),
        function($0, $1, $2, $3) {
        	queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
        }
      );
      return queryString;
    };
})(jQuery);

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
	var params = $.deparam(window.location.search);

	socket.emit('join', params,function(err){
			if(err){
				window.location.href = "/";
			}
	});
});

socket.on('updateUserList', function(users){
	console.log(users);
	var ol = $('<ol></ol>');
	users.forEach(function(user){
		ol.append($('<li></li>').text(user));
	});

	$('#users').html(ol);

});

socket.on('disconnect',function(){
	console.log('disconnected');
});

socket.on('newMsg', function(argsm){
	console.log(argsm);
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



