var achievementWidget = achievementWidget || {};

achievementWidget.showAchievementWidget = function(achId)
{
  // Let's populate the little widget
  var achUnlocked = $('#achUnlocked');
  achUnlocked.find('img').prop('src', achManager.achievements[achId].unlockedIconUrl);
  achUnlocked.find('#achName').text(achManager.achievements[achId].name);
  achUnlocked.find('#achDescrip').text(achManager.achievements[achId].description);
  achUnlocked.css({'top': '300px', 'opacity': '1.0'});
  achUnlocked.show();
  achUnlocked.delay(2000).animate({top: 50, opacity: 0.1}, 500, function() {
    achUnlocked.hide();
  });

  //TODO: Update our internal model as well
};
