"use strict";

var leaderboardTable = leaderboardTable || {}

leaderboardTable.BACK_TO_GAME = 1;
leaderboardTable.BACK_TO_ALL_LEADERBOARDS = 2;

leaderboardTable.goBackTo = leaderboardTable.BACK_TO_ALL_LEADERBOARDS

leaderboardTable.showLeaderboard = function(leaderboardId, backDestination)
{
  leaderboardTable.goBackTo = backDestination;
  console.log("I am going to show leaderboard ", leaderboardId);
  $('#leaderboardTable tbody').html('');

  var request = gapi.client.games.scores.list(
      {collection: 'SOCIAL',
        leaderboardId: leaderboardId,
        timeSpan: 'WEEKLY'
      }
  );
  request.execute(function(response) {
    console.log('This is your data: ', response);
    if (response.hasOwnProperty('items')) {
      for (var i=0; i<response.items.length; i++) {
        var $leaderboardRow = leaderboardTable.buildTableRowFromData(response.items[i]);
        $leaderboardRow.appendTo($('#leaderboardTable tbody'));
      }
    }
    $('#leaderboard').fadeIn();
  });
  $('#pageHeader').text(leadManager.getLeaderboardObject(leaderboardId).name);

};


leaderboardTable.buildTableRowFromData = function(rowObj) {
  var scorePlayer = rowObj.player;
  var $tableRow = $('<tr></tr>');
  var $iconCell = $('<td></td>')
      .append($('<img />')
      .prop('src', scorePlayer.avatarImageUrl + '?sz=75')
  );
  var $nameCell = $('<td></td>').text(scorePlayer.displayName);
  var $scoreCell = $('<td></td>').text(rowObj.formattedScore);
  $tableRow.append($iconCell).append($nameCell).append($scoreCell);

  return $tableRow;
};

leaderboardTable.goBack = function() {
  $('#leaderboard').hide();
  if (leaderboardTable.goBackTo == leaderboardTable.BACK_TO_ALL_LEADERBOARDS) {
    $('#leaderboards').fadeIn();
  } else {
    $('#game').fadeIn();
  }

};