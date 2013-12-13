"use strict";

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
  $('#welcome').fadeOut();
  $('#dialog-modal').hide();
  $('#game').fadeIn();
  game.startGame();
};

welcome.showCredits = function() {
  $('#welcome').fadeOut();
  $('#GameCredits').fadeIn();
};