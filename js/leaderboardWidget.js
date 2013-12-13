"use strict";

var leaderboardWidget = leaderboardWidget || {};

leaderboardWidget.show = function(leadId)
{
  var leaderboardObject = leadManager.getLeaderboardObject(leadId);


  // Let's populate the little widget
  var iconUrl =   (leaderboardObject.iconUrl) ? leaderboardObject.iconUrl : 'img/genericLeaderboard.png';
  $('#leadUnlocked img').prop('src', iconUrl);
  $('#leadUnlocked #leadName').text(leaderboardObject.name);
  $('#leadUnlocked').css({top: '250px', opacity: '1.0'});
  $('#leadUnlocked').show();
  $('#leadUnlocked').delay(3000).animate({top: '50px', opacity: 0.1}, 500, function() {
    $('#leadUnlocked').hide();
  });

};