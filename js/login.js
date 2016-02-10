var constants = constants || {};
constants.CLIENT_ID = '926286388840-qbj01r8d9on9dvnnba1m8iiknrtulrb1.apps.googleusercontent.com';
constants.ACH_DONT_GET_COCKY_KID = 'CgkInoXkzIgWEAIQCA';
constants.ACH_WERE_ALL_OUT_OF_BUBBLEGUM = 'CgkInoXkzIgWEAIQCw';
constants.ACH_PRIME_TIME_FOR_YOUR_LIFE = 'CgkInoXkzIgWEAIQLg';
constants.ACH_THE_PRINCESS_IS_BACK = 'CgkInoXkzIgWEAIQEg';
constants.ACH_GOT_LUCKY = 'CgkInoXkzIgWEAIQDg';
constants.ACH_A_TASTE_FOR_BLOOD = 'CgkInoXkzIgWEAIQDw';
constants.ACH_KICKIN_IT_OLD_SKOOL = 'CgkInoXkzIgWEAIQDQ';
constants.ACH_A_HIGHER_FOOD_CHAIN = 'CgkInoXkzIgWEAIQBw';
constants.ACH_DONT_FEAR_THE_REPEAR = 'CgkInoXkzIgWEAIQKA';
constants.ACH_THE_MOTHER_LOAD_OF_COWS = 'CgkInoXkzIgWEAIQEw';
constants.ACH_ZOMBIE_PENGUIN_TRAINEE = 'CgkInoXkzIgWEAIQKQ';
constants.ACH_ZOMBIE_PENGUIN_ADAPT = 'CgkInoXkzIgWEAIQBg';
constants.ACH_ZOMBIE_PENGUIN_EXCEPT = 'CgkInoXkzIgWEAIQEQ';
constants.ACH_ZOMBIE_PENGUIN_MASTER = 'CgkInoXkzIgWEAIQDA';
constants.ACH_THERES_CAKE_AND_ICE_CREAM = 'CgkInoXkzIgWEAIQLA';
constants.LEAD_HIGH_SCORES = 'CgkInoXkzIgWEAIQBQ';
constants.LEAD_LONGEST_LIVED = 'CgkInoXkzIgWEAIQKg';


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
    gapi.client.load('games', 'v1', function(response) {
        achManager.loadData();
        leadManager.preloadData();
        welcome.loadUp();
        $('#BetaInfo').hide();
        //game.init();
        //challenge.tryToLoad();
    });

    // Load up v1management
    gapi.client.load('gamesManagement', 'v1management', function(response) {
        welcome.dataLoaded(welcome.ENUM_MANAGEMENT_API);
    });

    // Load up /plus/v1
    gapi.client.load('plus', 'v1', function(response) {
        welcome.dataLoaded(welcome.ENUM_PLUS_API);
    });
};
login.handleAuthResult = function(auth) {
    console.log('We are in handle auth result');
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);
    checkReady(function($) {
        if (auth) {
            $('#loginDiv').fadeOut();
            login.loadClient();
        } else {
            $('#loginDiv').fadeIn();
        }
    });
};
// Poll for jQuery to come into existance
var checkReady = function(callback) {
    if (window.jQuery) {
        callback(jQuery);
    } else {
        window.setTimeout(function() {
            checkReady(callback);
        }, 100);
    }
};
login.trySilentAuth = function() {
    //console.log('Trying silent auth');
    gapi.auth.authorize({
        client_id: constants.CLIENT_ID,
        scope: login.scopes,
        immediate: true
    }, login.handleAuthResult);
};

login.showLoginDialog = function() {
    gapi.auth.authorize({
        client_id: constants.CLIENT_ID,
        scope: login.scopes,
        immediate: false
    }, login.handleAuthResult);
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
    if (whatData === welcome.ENUM_LEADERBOARDS) {
        welcome.leaderboards_loaded = true;
    } else if (whatData === welcome.ENUM_ACHIEVEMENT_DEFS) {
        welcome.achievement_defs_loaded = true;
    } else if (whatData === welcome.ENUM_ACHIEVEMENT_PROGRESS) {
        welcome.achievement_progress_loaded = true;
    } else if (whatData === welcome.ENUM_PLAYER_DATA) {
        welcome.player_data_loaded = true;
    } else if (whatData === welcome.ENUM_CHALLENGE_DATA) {
        welcome.challenge_loaded = true;
    } else if (whatData === welcome.ENUM_MANAGEMENT_API) {
        welcome.management_APIs_loaded = true;
    } else if (whatData === welcome.ENUM_PLUS_API) {
        welcome.plus_APIs_loaded = true;
    }
    welcome.activateButtonsIfReady();

};

welcome.activateButtonsIfReady = function() {
    if (welcome.leaderboards_loaded &&
        welcome.achievement_defs_loaded &&
        welcome.achievement_progress_loaded &&
        welcome.player_data_loaded &&
        welcome.challenge_loaded &&
        welcome.management_APIs_loaded &&
        welcome.plus_APIs_loaded) {
        $('#welcome input').attr('disabled', false);
        $('#game').show();
        welcome.startGame();
    }
};

welcome.loadUp = function() {
    $('#welcome').fadeIn();
};

welcome.showCredits = function toggle(obj, obj2) {
    var el = document.getElementById(obj);
    el.style.display = (el.style.display !== 'none' ? 'none' : '');
    document.getElementById(obj2).style.display = (document.getElementById(obj2).style.display === 'block' ? 'none' : 'block');
};

welcome.showAchievements = function() {
    achievementTable.loadUp();
};

welcome.showLeaderboards = function() {
    leaderboardsTable.showAllLeaderboards();
};

welcome.startGame = function() {
    document.getElementById("dialog-modal").style.display = "none";
    //document.getElementById("footer").style.background = "#6cf";
    document.getElementById("game").style.display = "block";
    game.startGame();
};
