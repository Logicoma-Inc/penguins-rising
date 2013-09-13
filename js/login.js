"use strict";

var login = login || {};


login.userId = '';
login.loggedIn = false;


login.scopes = 'https://www.googleapis.com/auth/games';

login.init = function() {
  // Need to add this 1 ms timeout to work around an odd but annoying bug
  window.setTimeout(login.trySilentAuth, 1);
};

/**
 * This function allows us to load up the game service via the discovery doc
 * and makes calls directly through the client library instead of needing
 * to specify the REST endpoints.
 */
login.loadClient = function() {

  // Load up /games/v1
  gapi.client.load('games','v1',function(response) {
    player.loadLocalPlayer();
    achManager.loadData();
    leadManager.preloadData();
    welcome.loadUp();
    $('#BetaInfo').hide();
    //game.init();
    //challenge.tryToLoad();
  });

  // Load up v1management
  gapi.client.load('gamesManagement','v1management', function(response) {
    welcome.dataLoaded(welcome.ENUM_MANAGEMENT_API);
  });

  // Load up /plus/v1
  gapi.client.load('plus','v1', function(response) {
    welcome.dataLoaded(welcome.ENUM_PLUS_API)
  });

};


login.handleAuthResult = function(auth) {
  console.log('We are in handle auth result');
  if (auth) {
    console.log('Hooray! You\'re logged in!');
    $('#loginDiv').fadeOut();
    login.loadClient();
  } else {
    $('#loginDiv').fadeIn();
  }
};


login.trySilentAuth = function() {
  console.log('Trying silent auth');
  gapi.auth.authorize({client_id: constants.CLIENT_ID, scope: login.scopes, immediate: true}, login.handleAuthResult);
};

login.showLoginDialog=function() {
  gapi.auth.authorize({client_id: constants.CLIENT_ID, scope: login.scopes, immediate: false}, login.handleAuthResult);
};



