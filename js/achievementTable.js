"use strict";

// achievementBoard -- responsible for displaying the "Achievements" table

var achievementTable = achievementTable || {};


achievementTable.loadUp = function() {
  achievementTable.clearOut();
  if (achManager.preloaded) {
    $.each(achManager.achievements, function(id, achObject) {
      var $achievementRow = achievementTable.buildTableRowFromData(achObject);
      $achievementRow.appendTo($('#achievementsTable tbody'));
    })
  }
  $('#achievements').fadeIn();
  $("#pageHeader").text("Achievements");
};

achievementTable.buildTableRowFromData = function(achObject) {
  var $tableRow = $('<tr></tr>');
  var $achievementName = $('<td></td>').text(achObject.name).addClass('achievementName');
  var $achievementDescrip = $('<td></td>').text(achObject.description).addClass('achievementDescrip');
  var $achievementURL = '';
  if (achObject.achievementState == 'REVEALED') {
    $achievementURL = achObject.revealedIconUrl;
    if (achObject.achievementType == "INCREMENTAL" &&
        achObject.hasOwnProperty('formattedCurrentStepsString')) {
      var progressText = '(' + achObject.formattedCurrentStepsString + '/' +
          achObject.formattedTotalSteps + ')';
      var $progressThingie = $('<div></div>').text(progressText);
      $achievementDescrip.append($progressThingie);
    }

  } else if (achObject.achievementState == 'UNLOCKED') {
    $achievementURL = achObject.unlockedIconUrl;
  } else if (achObject.achievementState == 'HIDDEN') {
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