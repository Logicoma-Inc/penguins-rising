// Achievements manager -- responsible for loading and granting achievements
var achManager = achManager || {};

achManager.achievements = {};
achManager.preloaded = false;

achManager.loadData = function() {
    var request = gapi.client.games.achievementDefinitions.list();
    request.execute(function(response) {
        console.log('Achievement definitions', response);
        if (response.kind === 'games#achievementDefinitionsListResponse' &&
            response.hasOwnProperty('items')) {
            for (var i = 0; i < response.items.length; i++) {
                achManager.achievements[response.items[i].id] = response.items[i];
                // Will be overwritten later if we have achievement data
                achManager.achievements[response.items[i].id].achievementState = response.items[i].initialState;
            }
            welcome.dataLoaded(welcome.ENUM_ACHIEVEMENT_DEFS);
            achManager.loadAchievementsEarnedByPlayer();

        }
    });
};

achManager.loadAchievementsEarnedByPlayer = function() {
    var request = gapi.client.games.achievements.list({
        playerId: 'me'
    });
    request.execute(function(response) {
        console.log('Your achievement data: ', response);
        if (response.kind === 'games#playerAchievementListResponse' &&
            response.hasOwnProperty('items')) {
            for (var i = 0; i < response.items.length; i++) {
                var nextAch = response.items[i];
                achManager.achievements[nextAch.id].achievementState = nextAch.achievementState;
                if (nextAch.hasOwnProperty('formattedCurrentStepsString')) {
                    achManager.achievements[nextAch.id].formattedCurrentStepsString = nextAch.formattedCurrentStepsString;
                }
            }
            welcome.dataLoaded(welcome.ENUM_ACHIEVEMENT_PROGRESS);
        } else {
            console.log("**Unexpected response **", response);
        }
    });

    achManager.preloaded = true;

};

achManager.scoreRequested = function(requestedValue) {
    if (requestedValue === 0) {
        achManager.unlockAchievement(constants.ACH_HUMBLE);
    } else if (requestedValue === 9999) {
        achManager.unlockAchievement(constants.ACH_COCKY);
    }

};

achManager.scoreReturned = function(receivedValue) {
    if (receivedValue === 1337) {
        achManager.unlockAchievement(constants.ACH_LEET);
    } else if (receivedValue > 1 && utils.isPrime(receivedValue)) {
        achManager.unlockAchievement(constants.ACH_PRIME);
    }
    achManager.submitProgress(constants.ACH_BORED, 1);
    achManager.submitProgress(constants.ACH_REALLY_BORED, 1);

};

achManager.getNameForId = function(achId) {
    return achManager.achievements[achId].name;
};

achManager.submitProgress = function(achId, amount) {
    var request = gapi.client.games.achievements.increment({
        achievementId: achId,
        stepsToIncrement: amount
    });
    request.execute(function(response) {
        console.log('Data from incrementing achievement is ', response);
        // Let's updated our locally cached version
        achManager.achievements[achId].currentSteps = response.currentSteps;
        achManager.achievements[achId].formattedCurrentStepsString = String(response.currentSteps);
        if (response.newlyUnlocked) {
            achievementWidget.showAchievementWidget(achId);
        } else {
            console.log('You either haven\'t unlocked ' + achManager.achievements[achId].name + ' yet, or you unlocked it already.');
        }
    });
};


achManager.unlockAchievement = function(achId) {
    var request = gapi.client.games.achievements.unlock({
        achievementId: achId
    });
    request.execute(function(response) {
        console.log('Data from earning achievement is ', response);
        if (response.newlyUnlocked) {
            achievementWidget.showAchievementWidget(achId);
            // Let's refresh our data here, while we're at it
            achManager.loadAchievementsEarnedByPlayer();
        } else {
            console.log('You unlocked ' + achManager.achievements[achId].name + ' but you already unlocked it earlier.');
        }
    });

};
// achievementBoard -- responsible for displaying the "Achievements" table

var achievementTable = achievementTable || {};

achievementTable.loadUp = function() {
    achievementTable.clearOut();
    if (achManager.preloaded) {
        $.each(achManager.achievements, function(id, achObject) {
            var $achievementRow = achievementTable.buildTableRowFromData(achObject);
            $achievementRow.appendTo($('#achievementsTable tbody'));
        });
    }
    $('#achievements').fadeIn();
    $("#pageHeader").text("Achievements");
};

achievementTable.buildTableRowFromData = function(achObject) {
    var $tableRow = $('<tr></tr>');
    var $achievementName = $('<td></td>').text(achObject.name).addClass('achievementName');
    var $achievementDescrip = $('<td></td>').text(achObject.description).addClass('achievementDescrip');
    var $achievementURL = '';
    if (achObject.achievementState === 'REVEALED') {
        $achievementURL = achObject.revealedIconUrl;
        if (achObject.achievementType === "INCREMENTAL" &&
            achObject.hasOwnProperty('formattedCurrentStepsString')) {
            var progressText = '(' + achObject.formattedCurrentStepsString + '/' +
                achObject.formattedTotalSteps + ')';
            var $progressThingie = $('<div></div>').text(progressText);
            $achievementDescrip.append($progressThingie);
        }

    } else if (achObject.achievementState === 'UNLOCKED') {
        $achievementURL = achObject.unlockedIconUrl;
    } else if (achObject.achievementState === 'HIDDEN') {
        $achievementURL = 'images/Question_mark.png';
        // While we're add it, let's change the name and description
        $achievementName.text('Hidden');
        $achievementDescrip.text('This mysterious achievement will be revealed later');
    }
    var $achievementImage = $('<img />').attr('src', $achievementURL).attr('alt', achObject.achievementState)
        .addClass('medIcon').appendTo($('<td></td>'));
    $tableRow.append($achievementName).append($achievementDescrip).append($achievementImage);

    return $tableRow;
};

achievementTable.goBack = function() {
    $('#achievements').fadeOut();
    welcome.loadUp();

};

achievementTable.clearOut = function() {
    $('#achievementsTable tbody').html('');
};
var achievementWidget = achievementWidget || {};

achievementWidget.showAchievementWidget = function(achId) {
    // Let's populate the little widget
    var achUnlocked = $('#achUnlocked');
    achUnlocked.find('img').prop('src', achManager.achievements[achId].unlockedIconUrl);
    achUnlocked.find('#achName').text(achManager.achievements[achId].name);
    achUnlocked.find('#achDescrip').text(achManager.achievements[achId].description);
    achUnlocked.css({
        'top': '300px',
        'opacity': '1.0'
    });
    achUnlocked.show();
    achUnlocked.delay(2000).animate({
        top: 50,
        opacity: 0.1
    }, 500, function() {
        achUnlocked.hide();
    });

    //TODO: Update our internal model as well
};
