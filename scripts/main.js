$(window).resize(function () { 
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight; 
});
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
	this.Sound;
	},
	shoot: function(){
			if((this.i-35) < canvas.height)
			{
			ctx.save();
			ctx.translate(canvas.width/2, canvas.height-60);
			ctx.rotate(this.angle);
			ctx.fillRect(-1,-35,3,3);
			ctx.restore();
			//this.i += 4;
			}
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
	ctx.drawImage(img, 0, 702, 50, 65, -25, -33, 50, 66);
	ctx.restore();
	}
});
var World = Class.extend({
	init: function(level){
		this.Score;
		//var framecount = 0;
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
		//var frame = 0;
		//var frames = [];
		this.x = pos.x;//x position top left corner
		this.y = pos.y;//y position top left corner
		this.assets = [ 43, 90, 150, 180, 210, 180, 150 ,90];
		this.width = 38;
		this.height = 26;
	},
	Animate:function(x){
	if(!x)
	ctx.drawImage(img, this.assets[0], 702, 50, 65, this.x, 0, 50, 66);
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
	img.onload = function(){
		ctx.drawImage(img, 0,0, 1008, 700, 0, 0, canvas.width, canvas.height);
	};	
	img.src = "images/landscape2.png";
	setInterval(animate, frameRate)
};
var animate = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0,0, 1008, 700, 0, 0, canvas.width, canvas.height);
	writeMessage();
	world.player.Animate();
	world.penguins.Animate(collides(world, world.penguins));
	if(world.weapon.shot)
	{
	  //world.weapon.shoot();
	  ctx.fillText("X:"+world.mouseX+" Y:"+world.mouseY, 20, 50);
	}
};

function writeMessage() {
	ctx.font = "bold 22px Arial";
	ctx.fillText("Score:0", 25, 25);
	ctx.fillText("Level:"+world.Level, canvas.width - 100, 25);
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
		world.weapon.shot = true;
		//world.weapon.x = world.mouseX;
		//world.weapon.y = world.mouseY;
		world.x = world.mouseX;
		world.y = world.mouseY;
		var myVideo=document.getElementById("video1"); 
		myVideo.play(); 
	    world.weapon.angle = Math.atan2(world.mouseX-(window.innerWidth/2), (window.innerHeight-60)- world.mouseY);
};
function collides(a, b) {
  return a.x >= b.x && a.x <= b.x+b.width &&
		 a.y >= b.y && a.y <= b.y+b.height;
}
