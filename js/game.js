"use strict";
/******************** GLOBALS ********************/
var game = game || {};
var img = null;
var canvas = document.getElementById("window");
var ctx = canvas.getContext('2d');
var enemies = [];
var TheTrulyDead = [];
var player = player || {};//Later will make ready for multiple users.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
game.mousePos = {
    x: 0,
    y: 0
};
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
/******************** PLAYER CLASS ********************/
player = {
    x: (window.innerWidth / 2),
    y: (window.innerHeight- 60),
    vx: 0,
    vy: 0,
    Bullets: [],
    draw: function () {
        ctx.save();
        ctx.translate((canvas.width / 2), canvas.height - 60);
        ctx.rotate(Math.atan2(game.mousePos.x - this.x, this.y - game.mousePos.y));
        ctx.drawImage(img, 0, 0, 42, 59, -18, -33, 42, 59);
        ctx.restore();
    },
    shot: false,
    shoot: function () {
            var angle = Math.atan2(player.x - game.mousePos.x, player.y - game.mousePos.y);
            var snd = new Audio("content/GunShot.wav"); // buffers automatically when created
            snd.play();
            this.Bullets.push(Bullet({
                radian: angle,
                x: this.x + -18 * Math.sin(angle),
                y: this.y + -18 * Math.cos(angle),
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
        return I.x >= 0 && I.x <= canvas.width - 50 &&
            I.y >= 0 && I.y <= canvas.height;
    };

    I.draw = function () {
        if (I.active)
            ctx.drawImage(img, I.frame.x, 0,  I.width,  I.height, I.x, I.y, I.width, I.height);
        else {
            var penguin = Math.floor(Math.random() * 3) + 1;
            var x = 169;
            ctx.drawImage(img, x, 0, 46, 37, I.x, I.y, 46, 37);
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
function Boss() {
    this.length = 0;
    this.frame = undefined;
    this.Index = 0;
    this.elapsed = 0;
    this.self = new Image();
    this.animation = new AnimationData(
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
    this.update = function () {
        return true;
    };
    this.draw = function () {
        ctx.drawImage(img, this.frame.x, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    };
    this.deactive = function () {
        this.active = false;
    };
};
/******************** BULLET CLASS ********************/
function Bullet(I) {
    I.active = true;
    I.speed = 12;
    I.radian = Math.atan2(player.x - game.mousePos.x, player.y - game.mousePos.y);
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
var firstboss = new Boss();
/******************** INITALIZER METHOD ********************/
game.startGame = function () {
    game.LvlEnemies = 3;
    game.Lvl = 1;
    img = new Image();
    img.src = "/images/CharacterSprites.png";
    canvas.addEventListener('mousedown', mouseClick);
    setInterval(function () {
        update();
        draw();
    }, 40);
};
/******************** DRAW METHOD ********************/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    TheTrulyDead.forEach(function (enemy) {
        enemy.draw();
    });
    player.draw();
    player.Bullets.forEach(function (bullet) {
        bullet.draw();
    });
    enemies.forEach(function (enemy) {
        enemy.draw();
    });
    ctx.fillText("Kills:" + TheTrulyDead.length, 10, 50);
    ctx.fillText("Level:" + game.Lvl, 10, 70);
};
/******************** UPDATE METHOD ********************/
function update() {
    if (TheTrulyDead.length > game.LvlEnemies) {
        game.LvlComplete = true;
        game.LvlEnemies += 5;
        game.Lvl += 1;
    }
    if (!game.LvlComplete) {
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
        handleCollisions();
        if (game.LvlEnemies > enemies.length) {
                enemies.push(Enemy());
            }
    } else {
        enemies = [];
        TheTrulyDead = [];
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
                var snd = new Audio("content/PenguinCry1.wav");
                snd.play();
                bullet.active = false;
            }
        });
    });
};