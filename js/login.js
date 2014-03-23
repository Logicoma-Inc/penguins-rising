"use strict";

var constants = constants || {}
constants.CLIENT_ID = '758222750366.apps.googleusercontent.com';
constants.ACH_DONT_GET_COCKY_KID = 'CgkInoXkzIgWEAIQCA';
constants.ACH_WERE_OUT_OF_BUBBLEGUM = 'CgkInoXkzIgWEAIQCw';
constants.ACH_ITS_A_PRIME_LIFE = 'CgkInoXkzIgWEAIQLg';
constants.ACH_THE_PRINCESS_ISNT_HAPPY = 'CgkInoXkzIgWEAIQEg';
constants.ACH_GOT_LUCKY = 'CgkInoXkzIgWEAIQDg';
constants.ACH_SAVE_IT_FOR_LATER = 'CgkInoXkzIgWEAIQBg';
constants.ACH_A_HIGHER_FOOD_CHAIN = 'CgkInoXkzIgWEAIQBw';
constants.ACH_MAMA_DONT_LIKE_TATTLETALES = 'CgkInoXkzIgWEAIQDA';
constants.ACH_KICKIN_IT_OLD_SKOOL = 'CgkInoXkzIgWEAIQDQ';
constants.ACH_A_TASTE_FOR_BLOOD = 'CgkInoXkzIgWEAIQDw';
constants.ACH_NEED_NOT_HATE_ALL = 'CgkInoXkzIgWEAIQEQ';
constants.ACH_THE_GUN_OF_A_THOUSAND_TRUTHS = 'CgkInoXkzIgWEAIQEw';
constants.ACH_DONT_FEAR_THE_REPEAR = 'CgkInoXkzIgWEAIQKA';
constants.ACH_BIRDS_THE_WORD = 'CgkInoXkzIgWEAIQKQ';
constants.ACH_CAKE_AND_ICE_CREAM_ON_LEVEL_100 = 'CgkInoXkzIgWEAIQLA';
constants.LEAD_HIGH_SCORES = 'CgkInoXkzIgWEAIQBQ';
constants.LEAD_LONGEST_LIVED = 'CgkInoXkzIgWEAIQKg';
constants.LEAD_TOP_NO_LIFERS = 'CgkInoXkzIgWEAIQKw';


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
  document.getElementById("dialog-modal").style.display = "none";
  document.getElementById("game").style.display = "block";  
  game.startGame();
};

welcome.showCredits = function() {
  $('#welcome').fadeOut();
  $('#GameCredits').fadeIn();
};


