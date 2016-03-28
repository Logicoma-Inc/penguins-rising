var leadManager = leadManager || {};
leadManager.preloaded = false;
leadManager.leaderboards = {};

/* loads up the leaderboard definitions. Not the scores themselves */
leadManager.preloadData = function() {

    var request = gapi.client.games.leaderboards.list();
    request.execute(function(response) {
        console.log('Leaderboard data', response);
        if (response.kind === 'games#leaderboardListResponse' &&
            response.hasOwnProperty('items')) {
            for (var i = 0; i < response.items.length; i++) {
                leadManager.leaderboards[response.items[i].id] = response.items[i];
            }
        }
        leadManager.preloaded = true;
        welcome.dataLoaded(welcome.ENUM_LEADERBOARDS);
    });
};

leadManager.getLeaderboardObject = function(leadId) {
    return leadManager.leaderboards[leadId];
};

leadManager.gotScore = function(receivedScore, difficulty, callback) {
    var leaderboardId = (difficulty === game.EASY) ? constants.LEADERBOARD_EASY : constants.LEADERBOARD_HARD;

    var request = gapi.client.games.scores.submit({
        leaderboardId: leaderboardId,
        score: receivedScore
    });
    request.execute(function(response) {
        console.log('Data from submitting high score is ', response);
        var newWeeklyHighScore = false;
        if (response.hasOwnProperty('beatenScoreTimeSpans')) {
            for (var i = 0; i < response.beatenScoreTimeSpans.length; i++) {
                if (response.beatenScoreTimeSpans[i] === 'WEEKLY') {
                    console.log('Hooray! New weekly high score!');
                    newWeeklyHighScore = true;
                    leaderboardWidget.show(leaderboardId);
                    //TODO: Update our internal model as well
                } else {}
            }
        }
        callback(newWeeklyHighScore);
    });
};
var leaderboardWidget = leaderboardWidget || {};

leaderboardWidget.show = function(leadId) {
    var leaderboardObject = leadManager.getLeaderboardObject(leadId);


    // Let's populate the little widget
    var iconUrl = (leaderboardObject.iconUrl) ? leaderboardObject.iconUrl : 'img/genericLeaderboard.png';
    $('#leadUnlocked img').prop('src', iconUrl);
    $('#leadUnlocked #leadName').text(leaderboardObject.name);
    $('#leadUnlocked').css({
        top: '250px',
        opacity: '1.0'
    });
    $('#leadUnlocked').show();
    $('#leadUnlocked').delay(3000).animate({
        top: '50px',
        opacity: 0.1
    }, 500, function() {
        $('#leadUnlocked').hide();
    });

};
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
            .click(function() {
                leaderboardsTable.selectLeaderboard(leadObj.id);
            })
        );
    $tableRow.append($iconCell).append($nameCell).append($viewButtonCell);

    return $tableRow;
};

leaderboardsTable.selectLeaderboard = function(leaderboardId) {
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