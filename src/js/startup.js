(function() {
    "use strict";
    var signinCallback = function(auth) {
        login.handleAuthResult(auth);
    };
    var apisLoaded = function() {
        login.init();
    };

    function AssetManager() {
        this.successCount = 0;
        this.errorCount = 0;
        this.downloadQueue = [];
        this.cache = {};
    }
    AssetManager.prototype.queueDownload = function(path) {
        this.downloadQueue.push(path);
    };
    AssetManager.prototype.downloadAll = function(downloadCallback) {
        if (this.downloadQueue.length === 0) {
            downloadCallback();
        }
        for (var i = 0; i < this.downloadQueue.length; i++) {
            var path = this.downloadQueue[i];
            var img = new Image();
            var that = this;

            img.src = path;
            this.cache[path] = img;
        }
    };
    AssetManager.prototype.isDone = function() {
        return (this.downloadQueue.length === this.successCount + this.errorCount);
    };
    AssetManager.prototype.getAsset = function(path) {
        return this.cache[path];
    };
    var ASSET_MANAGER = new AssetManager();
    ASSET_MANAGER.downloadAll(function() {});
    if (ASSET_MANAGER.isDone) {
        document.getElementById("Gamer").innerHTML = "Play";
    }

    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-41648493-1', 'penguinsontherise.appspot.com');
    ga('send', 'pageview');
})();
