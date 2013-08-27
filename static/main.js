var img = null;
var mousePos = { x:0, y:0};
canvas = document.getElementById("window");
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var snd = new Audio("./sounds/PenguinCry1.wav"); // buffers automatically when created
canvas.addEventListener('mousemove', function(evt) {
	mousePos = getMousePos(canvas, evt);
  }, false);
var player = {
  x: (canvas.width/2),
  y: (canvas.height-60),
  vx: 0,
  vy: 0,
  Bullets: [],
  draw: function() {
	ctx.save();
	ctx.translate(canvas.width/2, canvas.height-60);
	ctx.rotate(Math.atan2(mousePos.x-this.x, this.y-mousePos.y));
	ctx.drawImage(img, 0, 702, 42, 64, -21, -33, 42, 64);
	ctx.restore();
  },
  shoot: function() {
		var angle = Math.atan2(player.x- mousePos.x, player.y - mousePos.y);
		this.Bullets.push(Bullet({
		radian: angle,
		speed: 6,
		x: player.x + -18*Math.sin(angle),
		y: player.y + -18*Math.cos(angle),
		x: this.x + -18*Math.sin(angle),
		y: this.y + -18*Math.cos(angle),
	  }));
	}
};
 
enemies = [];
TheDead = [];
function AnimationData(frames, options) {
  this.frames = frames || [{ x: 0, y: 0, w: 0, h: 0, length: 0 }];
  this.options = options || {
    repeats: false,
    keyframe: 0
  };
}

function Enemy(I) {
  I = I || {};

  I.active = true;
  I.age = Math.floor(Math.random() * 128);
  
  I.x = canvas.width / 4 + Math.random() * canvas.width/2;
  I.x = Math.random() * canvas.width ;
  I.y = 0;
  I.xVelocity = 0
  I.yVelocity = 1;

  I.width = 32;
  I.height = 32;

  I.length = 0;
  I.frame = undefined;
  I.index = 0;
  I.elapsed = 0;
  I.animation = new AnimationData(
        [
          { x: 40, y: 0, w: 24, h: 24, length: 180 },
          { x: 82, y: 0, w: 24, h: 24, length: 180 },
		  { x: 130, y: 0, w: 24, h: 24, length: 180 }
        ],
        {
          repeats: true,
          keyframe: 0 
        }
      );
	  I.reset = function() {
  I.elapsed = 0;
  I.index = 0;
  I.frame = this.animation.frames[this.index];
};
  I.reset();
  I.length = I.animation.frames.length;
  I.inBounds = function() {
	return I.x >= 0 && I.x <= canvas.width &&
	  I.y >= 0 && I.y <= canvas.height;
  };

  I.draw = function() {
	if (this.active)
	ctx.drawImage(img, I.frame.x, 702, 46, 37, this.x, this.y, 46, 37);
	else
	ctx.drawImage(img, 165, 702, 46, 37, this.x, this.y , 46, 37);
  };

  I.update = function() {
	//I.x += I.xVelocity;
	I.y += I.yVelocity;
	I.xVelocity = 1;//Math.sin(I.age * Math.PI / 64);
	I.age++;
	I.active = I.active && I.inBounds();
    if(this.active)
	{
		I.x += I.xVelocity;
		I.y += I.yVelocity;
		I.xVelocity = Math.sin(I.age * Math.PI / 64);
		I.age++;
		I.active = I.active && I.inBounds(); 
		this.elapsed = this.elapsed + 30;

  if(this.elapsed >= this.frame.length) {
    this.index++;
    this.elapsed = this.elapsed - I.frame.length;
  }

  if(this.index >= this.length) {
    if(this.animation.options.repeats) {
      this.index = this.animation.options.keyframe;
    } else {
      this.index--;
    }
  }

  this.frame = this.animation.frames[this.index];
	}
  };
  I.deactive = function() {
	    this.active = false;
  };
  I.deactive = function() {
    this.active = false;
  };
  return I;
};
        
function Bullet(I) {
  I.active = true;
  I.radian = Math.atan2(player.x- mousePos.x, player.y - mousePos.y);
  I.xVelocity = -I.speed * Math.sin(I.radian);
  I.yVelocity = -I.speed * Math.cos(I.radian);
  I.width = 3;
  I.height = 3;
  I.color = "#000";

  I.inBounds = function() {
	return I.x >= 0 && I.x <= canvas.width &&
	  I.y >= 0 && I.y <= canvas.height;
  };

  I.draw = function() {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  
  I.update = function() {
	I.x += I.xVelocity;
	I.y += I.yVelocity;

	I.active = I.active && I.inBounds();
  };
  return I;
}

var setup = function(){
	img = new Image();
	img = document.getElementById("background");
	canvas.addEventListener('mousedown', mouseClick);
	setInterval(function() {
          update();
          draw();
		  $(window).resize(function () { 
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight; 
});
        }, 100/6);
};

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0,0, 1003, 695, 0, 0, canvas.width, canvas.height);
	 TheDead.forEach(function(enemy) {
		enemy.draw();
	 });
	player.draw();
	player.Bullets.forEach(function(bullet) {
		bullet.draw();
	  });
	 enemies.forEach(function(enemy) {
            enemy.draw();
     });
};
 
function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      };
function mouseClick(event){
		event.preventDefault();
		player.shoot();
};
function update() {
	player.Bullets.forEach(function(bullet) {
		  player.Bullets.forEach(function(bullet) {
            bullet.update();
          });
		  player.Bullets = player.Bullets.filter(function(bullet) {
            return bullet.active;
          });
		   enemies.forEach(function(enemy) {
            enemy.update();
          });
        
           enemies = enemies.filter(function(enemy) {
			// //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
             return enemy.active;
           });
		  handleCollisions();
		  if(Math.random() < 0.01) {
		  if(Math.random() < .02) {
            enemies.push(Enemy());
          }
}
        
function collides(a, b) {
          return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
        }
        
        function handleCollisions() {
          player.Bullets.forEach(function(bullet) {
            enemies.forEach(function(enemy) {
              if(collides(bullet, enemy)) {
		enemy.deactive();
				snd.play();
				enemy.deactive();
				TheDead.push(enemy);
                bullet.active = false;
              }
            });
          });
        }