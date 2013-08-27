#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
game = '''
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>Penguins Rising</title>
<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
<script src="static/countdown.js" type="text/javascript"></script>
<script>
$(function() {
$( "#dialog-modal" ).dialog({
	  open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); $('.ui-dialog-titlebar').hide(); },
	  height: 340,
	  width: 400,
	  modal: true
	});
});

</script>
</head>
<body style="background-color:#EDEDED">
<audio id="Bleed">
  <source src="static/Bleed.ogg" type="audio/ogg">
  <source src="static/Bleed.mp3" type="audio/mpeg">
  Your browser does not support this audio format.
</audio>
<video autoplay loop poster="#" style="-webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;  position: fixed;  top: 0;
  left: 0; bottom: 0; right: 0;  z-index: -1000;">
  <source src="static/GamePlay.mp4" type="video/mp4">
  <source src="static/Gameplay.ogg" type"video/ogg">
  Your browser does not support this video format.
</video>
<div id="dialog-modal">
<button id="enabled" class="ui-state-default ui-corner-all" style="float:right;" onclick="Play();" title="Turn Volume On"><span class="ui-icon ui-icon-volume-on"></span></button>
<button style="display:none;float:right;" id="disabled" onclick="Stop();" class="ui-state-default ui-corner-all" title="Turn Volume Off"><span class="ui-icon ui-icon-volume-off"></span></button>
<h2 style="color:red; font-family: Viner Hand ITC;">Penguins Rising</h2>
<p>Coming Soon...</p>
<a href="http://www.google.com/calendar/event?action=TEMPLATE&text=Penguins%20Rising%20Release&dates=20131001/20131002&details=Are%20you%20ready%3F&location=&trp=true&sprop=Penguins%20Rising&sprop=name:http%3A%2F%2Fwww.penguinsontherise.appspot.com" target="_blank"><img src="//www.google.com/calendar/images/ext/gc_button2.gif" border=0></a>
<script type="application/javascript">
 var Count = new Countdown({
								 	year: 2013, 
									month: 10,
									day: 1,
									width:300, 
									height:60,  
									rangeHi:"month",
									style:"flip"	// <- no comma on last item!									});
});
function Play(){
    var bleed=document.getElementById("Bleed"); 
    bleed.play();
    $("#disabled").show();
    $("#enabled").hide();
};
function Stop(){
    var bleed=document.getElementById("Bleed"); 
    bleed.pause();
    $("#disabled").hide();
    $("#enabled").show();
};
</script>
</div>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-41648493-1', 'penguinsontherise.appspot.com');
  ga('send', 'pageview');

</script>
</body>
</html>
'''

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write(game)

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
