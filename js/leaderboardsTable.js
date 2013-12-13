"use strict";

var leaderboardsTable = leaderboardsTable || {};

leaderboardsTable.showAllLeaderboards = function() {
  leaderboardsTable.clearOut();
  if (leadManager.preloaded) {
    $.each(leadManager.leaderboards, function(id, leadObject) {
      var $leaderboardRow = leaderboardsTable.buildLeaderboardsRowFromData(leadObject);
      $leaderboardRow.appendTo($('#leaderboardsTable tbody'));
    });
    $('#leaderboards').fadeIn();
  }
  $('#pageHeader').text('Leaderboards');
};

leaderboardsTable.buildLeaderboardsRowFromData = function(leadObj) {
  var $tableRow = $('<tr></tr>');
  var leaderboardIcon = (leadObj.iconUrl) ? leadObj.iconUrl : 'img/genericLeaderboard.png';
  var $iconCell = $('<td></td>')
      .append($('<img />')
      .prop('src', leaderboardIcon).addClass('medIcon')
  );
  var $nameCell = $('<td></td>').text(leadObj.name);
  var $viewButtonCell = $('<td></td>')
      .append($('<input type="button" />')
      .prop('value', 'View')
      .click(function() {leaderboardsTable.selectLeaderboard(leadObj.id)})
  );
  $tableRow.append($iconCell).append($nameCell).append($viewButtonCell);

  return $tableRow;
};

leaderboardsTable.selectLeaderboard = function(leaderboardId)
{
  $('#leaderboards').hide();
  leaderboardTable.showLeaderboard(leaderboardId, leaderboardTable.BACK_TO_ALL_LEADERBOARDS);

};

leaderboardsTable.clearOut = function() {
  $('#leaderboardsTable tbody').html('');
};

leaderboardsTable.goBack = function() {
  $('#leaderboards').fadeOut();
  welcome.loadUp();

};