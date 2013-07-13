$(window).resize(function () { 
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight; 
});
var progressBar;
     
function showProgressBar()
{
    progressBar = document.createElement("progress");
    progressBar.value = 0;
    progressBar.max = 100;
    document.body.appendChild(progressBar);
 }
           
 function updateProgressBar(e)
 {
    if (e.lengthComputable)
       progressBar.value = e.loaded / e.total * 100;
    else
        progressBar.removeAttribute("value");
    }
            
 function hideProgressBar()
 { document.body.removeChild(progressBar); }
            

var ctx = null;
var img = null;
var frameRate = 1000/60;
var Weapon = Class.extend({
	init: function(){//Function for all vars.
	this.angle;
	this.shot = false;
	this.Rate;//speed of the weapon
	this.Type;
	this.x ;//= -1+(window.innerWidth/2);
	this.y ;//= -35+(window.innerHeight-60);
	this.i = 0;
	this.Bullets;//bullet count before reload
	this.Sound = document.getElementById("gunshot"); 
	},
	shoot: function(){
	    world.weapon.Sound.play();
		ctx.save();
		ctx.translate(canvas.width/2, canvas.height-60);
		ctx.rotate(Math.atan2(world.mouseX-(canvas.width/2), canvas.height-world.mouseY));
		ctx.drawImage(img, 40, 730, 100, 30, -10, -62, 100, 30);
		ctx.restore();
	}
});
var Player = Class.extend({
	init: function(){
		this.Position = [(window.innerWidth/2),(window.innerHeight-60)];
		this.Box;
		this.Rotation;
	}, 
	Animate: function(){
	ctx.save();
	ctx.translate(canvas.width/2, canvas.height-60);
	ctx.rotate(Math.atan2(world.mouseX-(canvas.width/2), canvas.height-world.mouseY));
	ctx.drawImage(img, 0, 702, 42, 64, -21, -33, 42, 64);
	ctx.restore();
	}
});
var World = Class.extend({
	init: function(level){
		this.Score;
		this.framecount = 0;
		this.Level = level;
		this.mouseX = 0;
		this.mouseY = 0;
		this.x = this.mouseX;
		this.y = this.mouseY;
		this.message = "Start you engines!";
		this.Penguins = new Array();
		this.weapon = new Weapon();
		this.player = new Player();
		//will remove soon..
		this.penguins = new Penguin(pos = {x:window.innerWidth/2, y:0});
	},
	setup: function(){
		
	}
});
var Penguin = Class.extend({
	init:function(pos){
		this.frame = 0;
		//var frames = [];
		this.x = pos.x;//x position top left corner
		this.y = pos.y;//y position top left corner
		this.assets = [39, 82];//39, 130, 60, 130];
		this.width = 37;
		this.height = 26;
		this.shot = false;
	},
	Animate:function(){
	 if(!this.shot)
	 { 
	   if((world.framecount%15)==0)
	   { this.frame = (this.frame+1) %this.assets.length;}
	   if((world.framecount%25)==0)
	   { this.y += 3; }
	   ctx.drawImage(img, this.assets[this.frame], 702, 46, 37, this.x, this.y, 46, 37);
	 }
	}
});

var world = new World(1);//Needs to be Global;

var setup = function(){
	canvas = document.getElementById("window");
	canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        world.message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
		world.mouseX = mousePos.x;
		world.mouseY = mousePos.y;
      }, false);
	canvas.addEventListener('mousedown', mouseClick);
	ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	img = new Image();
	img = document.getElementById("background");
	$('body').append('<img class="promotes left" src="images/HTML5_Logo_32.png" width="32" height="32" alt="HTML5 Powered" title="HTML5 Powered"> <img class="promotes right" src="https://developers.google.com/appengine/images/appengine-silver-120x30.gif" alt="Powered by Google App Engine" />');
	setInterval(animate, frameRate)
};
var animate = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0,0, 1003, 695, 0, 0, canvas.width, canvas.height);
	writeMessage();
	world.player.Animate();
	world.penguins.Animate();
	if(world.weapon.shot)
	{
	  	if(!world.weapon.Sound.ended)
		{
		 ctx.fillText("Wait", 20, 80);
		}
		else {
		ctx.fillText("Ready", 20, 100);
		}
	}
	world.framecount +=1;
};

function writeMessage() {
	ctx.font = "bold 22px Arial";
	ctx.fillText("Score:0", 25, 25);
	ctx.fillText("Level:"+world.Level, canvas.width - 100, 25);
	//ctx.fillText("X:"+world.mouseX+" Y:"+world.mouseY, 20, 50);
};

//Input engine!  
function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      };
function mouseClick(event){
		event.preventDefault()
		if(!world.weapon.shot)
		{
		world.weapon.shot = true;
		world.weapon.shoot();
		} else (world.weapon.Sound.ended)
		{
		 world.weapon.Sound.play();
		}
		world.x = world.mouseX;
		world.y = world.mouseY;
		world.penguins.shot = collides(world, world.penguins);
};
function collides(a, b) {
  return a.x >= b.x && a.x <= b.x+b.width &&
		 a.y >= b.y && a.y <= b.y+b.height;
}
