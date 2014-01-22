"use strict";
/******************** GLOBALS ********************/
var game = game || {};
var img = null;
var bossimg = null;
var canvas = document.getElementById("window");
var ctx = canvas.getContext('2d');
var enemies = [];
var TheTrulyDead = [];
var bosses = [];
var player = player || {};//Later will make ready for multiple users.
canvas.width = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth;
canvas.height =  "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
game.mousePos = {
    x: 0,
    y: 0
};
window.onresize = function (event) {
	canvas.height = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
	canvas.width = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth;
}
/******************** EVENT LISTENERS ********************/
canvas.addEventListener('mousemove', function (evt) {
    game.mousePos = getMousePos(canvas, evt);
}, false);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};
function mouseClick(event) {
    event.preventDefault();
    if (!player.shot) {
        player.shoot();
        setTimeout(function () { player.shot = false; }, 400);
        player.shot = true;
    }
};
function SoundTest(ver) {
    var a = document.createElement('audio');
    //console.log(!!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')));
    if (!!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''))) {
        if (ver) {
            return new Audio("mp3/GunShot.mp3");
        }
        else {
            new Audio("mp3/PenguinCry1.mp3");
        }
    }
    else {
        if (ver) {
            return new Audio("content/GunShot.wav");
        } else {
            new Audio("content/PenguinCry1.wav");
        }
    }
}
/******************** PLAYER CLASS ********************/
player = {
    x: (canvas.width / 2),
    y: (canvas.height - 60),
    vx: 0,
    vy: 0,
	health: null,
    Bullets: [],
	active: true,
    draw: function () {
        ctx.save();
        ctx.translate((canvas.width / 2), canvas.height - 60);
        ctx.rotate(Math.atan2(game.mousePos.x - (canvas.width / 2), (canvas.height - 60) - game.mousePos.y));
        ctx.drawImage(img, 0, 0, 42, 59, -18, -33, 42, 59);
        ctx.restore();
    },
	update: function() {
		if (player.health < 1)
			return false;
		else 
			this.active;
	},
    shot: false,
    snd: SoundTest(true), //No longer need to create so many with the timer.
    shoot: function () {		
        var angle = Math.atan2((canvas.width / 2) - game.mousePos.x, (canvas.height - 60) - game.mousePos.y);
            player.snd.play();
            player.Bullets.push(Bullet({
                radian: angle,
                //This is where I need to fix! for the resize problem.
                x: (canvas.width / 2) + -18 * Math.sin(angle),
                y: (canvas.height - 60) + -18 * Math.cos(angle),
            }));
    },
    displayName: 'anonymous',
    profileUrl: '',
    userId: '',
    loadLocalPlayer: function () {
        var request = gapi.client.games.players.get({
            playerId: 'me'
        });
        request.execute(function (response) {
            if (!response.displayName) {
                response.displayName = 'anonymous';
            }
            $('#welcome #message').text('Welcome, ' + response.displayName + '!');
            $('#welcomeAchievements, #welcomeleaderboards').fadeIn();
            player.displayName = response.displayName;
            player.profileUrl = response.avatarImageUrl;
            player.userId = response.playerId;
            welcome.dataLoaded(welcome.ENUM_PLAYER_DATA);
        })
    }
};
/******************** ENEMY CLASS ********************/
function Enemy(I) {
    I = I || {};

    I.active = true;
    I.age = Math.floor(Math.random() * 128);

    I.x = Math.random() * canvas.width;
    I.y = 0;
    I.xVelocity = 0
    I.yVelocity = 1;

    I.width = 42;
    I.height = 37;

    I.length = 0;
    I.frame = undefined;
    I.index = 0;
    I.elapsed = 0;
    I.animation = new AnimationData(
        [{
            x: 40,
            length: 180
        }, {
            x: 78,
            length: 180
        }, {
            x: 127,
            length: 180
        }], {
            repeats: true,
            keyframe: 0
        }
    );
    I.reset = function () {
        I.elapsed = 0;
        I.index = 0;
        I.frame = I.animation.frames[I.index];
    };
    I.reset();
    I.length = I.animation.frames.length;
    I.inBounds = function () {
		if(I.y != canvas.height){
			return I.x >= 0 && I.x <= canvas.width  &&
				I.y >= 0 && I.y <= canvas.height;
		} else 
		{
			console.log("HIT!");
			player.health -= 1;
			return false;
		}
    };

    I.draw = function () {
        if (I.active)
            ctx.drawImage(img, I.frame.x, 0,  I.width,  I.height, I.x, I.y, I.width, I.height);
        else {            
            ctx.drawImage(img, 169, 0, 46, 37, I.x, I.y, 46, 37);
        }
    };

    I.update = function () {
        if (I.active) {
            I.x += I.xVelocity;
            I.y += I.yVelocity;
            I.xVelocity = Math.sin(I.age * Math.PI / 64);
            I.age++;
            I.active = I.active && I.inBounds();
			
            I.elapsed = I.elapsed + 30;

            if (I.elapsed >= I.frame.length) {
                I.index++;
                I.elapsed = I.elapsed - I.frame.length;
            }

            if (this.index >= this.length) {
                if (this.animation.options.repeats) {
                    this.index = this.animation.options.keyframe;
                } else {
                    this.index--;
                }
            }

            I.frame = I.animation.frames[I.index];
        }
    };
    I.deactive = function () {
        I.active = false;
    };
    return I;
};
/******************** BOSS CLASS ********************/
function Boss(I) {
    I = I || {};

    I.active = true;
    I.age = Math.floor(Math.random() * 128);

    I.x = Math.random() * canvas.width;
    I.y = 0;
    I.xVelocity = 0
    I.yVelocity = 1;

    I.width = 42;
    I.height = 37;

    I.length = 0;
    I.frame = undefined;
    I.index = 0;
    I.elapsed = 0;
    I.animation = new AnimationData(
        [{
            x: 40,
            length: 180
        }, {
            x: 78,
            length: 180
        }, {
            x: 127,
            length: 180
        }], {
            repeats: true,
            keyframe: 0
        }
    );
    I.reset = function () {
        I.elapsed = 0;
        I.index = 0;
        I.frame = I.animation.frames[I.index];
    };
    I.reset();
    I.length = I.animation.frames.length;
    I.inBounds = function () {
        return I.x >= 0 && I.x <= canvas.width  &&
            I.y >= 0 && I.y <= canvas.height;
    };

    I.draw = function () {
        if (I.active)
            ctx.drawImage(bossimg, 172,0,45, 146, I.x, I.y, I.width, I.height);			
    };

    I.update = function () {
        if (I.active) {
            I.x += I.xVelocity;
            I.y += I.yVelocity;
            I.xVelocity = Math.sin(I.age * Math.PI / 64);
            I.age++;
            I.active = I.active && I.inBounds();
			
            I.elapsed = I.elapsed + 30;

            if (I.elapsed >= I.frame.length) {
                I.index++;
                I.elapsed = I.elapsed - I.frame.length;
            }

            if (this.index >= this.length) {
                if (this.animation.options.repeats) {
                    this.index = this.animation.options.keyframe;
                } else {
                    this.index--;
                }
            }

            I.frame = I.animation.frames[I.index];
        }
    };
    I.deactive = function () {
        I.active = false;
    };
    return I;
};
/******************** BULLET CLASS ********************/
function Bullet(I) {
    I.active = true;
    I.speed = 12;
    I.radian = Math.atan2((canvas.width/2) - game.mousePos.x, (canvas.height - 60) - game.mousePos.y);
    I.xVelocity = -I.speed * Math.sin(I.radian);
    I.yVelocity = -I.speed * Math.cos(I.radian);
    I.width = 3;
    I.height = 3;
    I.color = "#000";

    I.inBounds = function () {
        return I.x >= 0 && I.x <= canvas.width &&
            I.y >= 0 && I.y <= canvas.height;
    };

    I.draw = function () {
        ctx.fillStyle = I.color;
        ctx.fillRect(I.x, I.y, I.width, I.height);
    };

    I.update = function () {
        I.x += I.xVelocity;
        I.y += I.yVelocity;

        I.active = I.active && I.inBounds();
    };
    return I;
};
/******************** ANIMATION METHOD ********************/
function AnimationData(frames, options) {
    this.frames = frames || [{
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        length: 0
    }];
    this.options = options || {
        repeats: false,
        keyframe: 0
    };
};
var self = [];
var timer = null;
/******************** INITALIZER METHOD ********************/
game.startGame = function () {
    game.LvlEnemies = 3;
    game.Lvl = 1;
	player.health = 10;
    img = new Image();
    img.src = "/images/CharacterSprites.png";
    bossimg = new Image();
    bossimg.src = 'images/ThePrinceBoss.png';
    canvas.addEventListener('mousedown', mouseClick);
    timer = setInterval(function () {
        update();
        draw();
    }, 40);
}; 
/******************** DRAW METHOD ********************/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	player.draw();
    TheTrulyDead.forEach(function (enemy) {
        enemy.draw();
    });
    // bosses.forEach(function (boss) {
        // boss.draw();
    // });
    player.Bullets.forEach(function (bullet) {
        bullet.draw();
    });
    enemies.forEach(function (enemy) {
        enemy.draw();
    });
    ctx.fillText("Kills:" + TheTrulyDead.length, 10, 50);
    ctx.fillText("Level:" + game.Lvl, 10, 70);
	ctx.fillText("Health:" + player.health, 10, 100);
};
/******************** UPDATE METHOD ********************/
function update() {
    if ((TheTrulyDead.length > game.LvlEnemies) && (enemies.length == 0)) {
        game.LvlComplete = true;
        game.LvlEnemies += 5;
        game.Lvl += 1;
		player.health = 10;
		//clearInterval(timer);
    }
    if (!game.LvlComplete && player.update) {
        player.Bullets.forEach(function (bullet) {
            bullet.update();
        });
        player.Bullets = player.Bullets.filter(function (bullet) {
            return bullet.active;
        });
        enemies.forEach(function (enemy) {
            enemy.update();
        });
        enemies = enemies.filter(function (enemy) {
            return enemy.active;
        });
		bosses.forEach(function (boss) {
            boss.update();
        });
		bosses = bosses.filter(function (boss) {
            return boss.active;
        });
        handleCollisions();
        if (game.LvlEnemies > enemies.length && (TheTrulyDead.length <= game.LvlEnemies)) {
                enemies.push(Enemy());
				bosses.push(Boss(this));
            }
    } else {
		if(!player.update)
			console.log("you died");
        enemies = [];
        TheTrulyDead = [];
		bosses = [];
        game.LvlComplete = false;
    }
};
/******************** COLLIDE METHOD ********************/
function collides(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
};
/******************** COLLISION HANDLER ********************/
function handleCollisions() {
    player.Bullets.forEach(function (bullet) {
        enemies.forEach(function (enemy) {
            if (collides(bullet, enemy)) {
                enemy.deactive();
                TheTrulyDead.push(enemy);
                var snd = SoundTest(false);
                snd.play();
                bullet.active = false;
            }
        });
    });
};