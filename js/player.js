"use strict";
var player = player || {};

player.displayName = 'anonymous';
player.profileUrl = '';
player.userId = '';

player.loadLocalPlayer = function() {
  var request = gapi.client.games.players.get({playerId: 'me'});
  request.execute(function(response) {
    console.log('This is who you are ', response);
	if(!response.displayName) {
	response.displayName = 'anonymous';
	}
	$('#welcome #message').text('Welcome, ' + response.displayName + '!');
    player.displayName = response.displayName;
    player.profileUrl = response.avatarImageUrl;
    player.userId = response.playerId;
    console.log('This is the player object', player);
    welcome.dataLoaded(welcome.ENUM_PLAYER_DATA);
  });
};

