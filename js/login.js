"use strict";

var constants = constants || {};
constants.LEADERBOARD_EASY = 'CgkInoXkzIgWEAIQBQ';
constants.LEADERBOARD_HARD = 'CgkInoXkzIgWEAIQKg';
constants.CLIENT_ID = '758222750366.apps.googleusercontent.com';
constants.APP_ID = '758222750366';

var login = login || {};
login.userId = '';
login.loggedIn = false;


login.scopes = 'https://www.googleapis.com/auth/games';

login.init = function() {
  // Need to add this 1 ms timeout to work around an odd but annoying bug
  window.setTimeout(login.trySilentAuth, 1);
};
login.loadClient = function() {

  // Load up /games/v1
  gapi.client.load('games','v1',function(response) {
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
  //console.log('We are in handle auth result');
  if (auth) {
    //console.log('Hooray! You\'re logged in!');
    $('#loginDiv').fadeOut();
    login.loadClient();
  } else {
    $('#loginDiv').fadeIn();
  }
};
login.trySilentAuth = function() {
  //console.log('Trying silent auth');
  gapi.auth.authorize({client_id: constants.CLIENT_ID, scope: login.scopes, immediate: true}, login.handleAuthResult);
};

login.showLoginDialog=function() {
  gapi.auth.authorize({client_id: constants.CLIENT_ID, scope: login.scopes, immediate: false}, login.handleAuthResult);
};
var welcome = welcome || {};

welcome.leaderboards_loaded = false;
welcome.achievement_defs_loaded = false;
welcome.achievement_progress_loaded = false;
welcome.player_data_loaded = false;
welcome.challenge_loaded = false;
welcome.management_APIs_loaded = false;
welcome.plus_APIs_loaded = false;

// And an enum
welcome.ENUM_LEADERBOARDS = 1;
welcome.ENUM_ACHIEVEMENT_DEFS = 2;
welcome.ENUM_ACHIEVEMENT_PROGRESS = 3;
welcome.ENUM_PLAYER_DATA = 4;
welcome.ENUM_CHALLENGE_DATA = 5;
welcome.ENUM_MANAGEMENT_API = 6;
welcome.ENUM_PLUS_API = 7;

welcome.dataLoaded = function(whatData) {
   if (whatData == welcome.ENUM_LEADERBOARDS) {
     welcome.leaderboards_loaded = true;
   } else if (whatData == welcome.ENUM_ACHIEVEMENT_DEFS) {
     welcome.achievement_defs_loaded = true;
   } else if (whatData == welcome.ENUM_ACHIEVEMENT_PROGRESS) {
     welcome.achievement_progress_loaded = true;
   } else if (whatData == welcome.ENUM_PLAYER_DATA) {
     welcome.player_data_loaded = true;
   } else if (whatData == welcome.ENUM_CHALLENGE_DATA) {
     welcome.challenge_loaded = true;
   } else if (whatData == welcome.ENUM_MANAGEMENT_API) {
		welcome.management_APIs_loaded = true;
   } else if (whatData == welcome.ENUM_PLUS_API) {
		welcome.plus_APIs_loaded = true;
   }
  welcome.activateButtonsIfReady();

};

welcome.activateButtonsIfReady = function()
{
  if (welcome.leaderboards_loaded &&
      welcome.achievement_defs_loaded &&
      welcome.achievement_progress_loaded &&
      welcome.player_data_loaded &&
      welcome.challenge_loaded &&
      welcome.management_APIs_loaded &&
      welcome.plus_APIs_loaded)
  {
    $('#welcome input').attr('disabled',false);
	  $('#game').show();
      welcome.startGame();
  }

};


welcome.loadUp = function() {
  $('#welcome').fadeIn();
};

welcome.showAchievements = function() {
  $('#welcome').fadeOut();
  achievementTable.loadUp();

};

welcome.showLeaderboards = function() {
  $('#welcome').fadeOut();
  leaderboardsTable.showAllLeaderboards();
};

welcome.startGame = function(/*difficulty*/) {
  //$('#welcome').fadeOut();
    //$('#dialog-modal').hide();
    document.getElementById("dialog-modal").style.display = "none";
    document.getElementById("game").style.display = "block";
  //$('#game').fadeIn();
  game.startGame();
};

welcome.showCredits = function() {
  $('#welcome').fadeOut();
  $('#GameCredits').fadeIn();
};


