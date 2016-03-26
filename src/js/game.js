'use script';

var img = new Image();
img.src = "http://fassetar.github.io/penguins-rising/content/img/characters.png";
var canvas = document.getElementById("window");
var ctx = canvas.getContext('2d');
var enemies = [];
var TheTrulyDead = [];
var bosses = [];
var game = {
  paused: false,
  timer: null,
  Lvl: 1,
  Lvlcomplete: false,
  LvlEnemies: 3,
  mousePos: {
    x: 0,
    y: 0
  },
  loop: function() {
    if (!game.over && !game.paused) {
      game.update();
      draw();
    } else if (game.over) {
      var cf = confirm("Your lose! Start Over?");
      if (cf) {
        location.reload();
      }
    } //Create Pause Menu
    requestAnimFrame(game.loop);
  },
  over: false,
  startGame: function() {
    canvas.addEventListener('mousedown', mouseClick);
    window.requestAnimFrame = (
      function(callback) {
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(callback) {
            window.setTimeout(callback, 100 / 2);
          };
      })();
    game.loop();
  },
  update: function() { //UPDATE METHOD
    if ((TheTrulyDead.length > game.LvlEnemies) && (enemies.length === 0)) {
      game.Lvlcomplete = true;
      game.LvlEnemies += 5;
      game.Lvl += 1;
      player.health = 10;
    }
    //Remove or shorten this!
    canvas.height = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    canvas.width = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth;
    if (player.health <= 0) {
      game.over = true;
    }
    if (!game.Lvlcomplete && player.update) {
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
        return enemy.active;
      });
      handleCollisions();
      if (game.LvlEnemies > enemies.length && (TheTrulyDead.length <= game.LvlEnemies)) {
        enemies.push(Enemy());
        bosses.push(Boss(this));
      }
    } else {
      if (!player.update) {
        console.log("you died");
      }
      enemies = [];
      TheTrulyDead = [];
      bosses = [];
      game.Lvlcomplete = false;
      document.getElementsByClassName("LvlComplete")[0].style.display = "block";
      game.paused = true;
    }
  }

};
window.onblur = function(evt) {
  Pause(true);
}
var Pause = function(flag) {
  game.paused = (flag) ? flag : !game.paused;
  if (game.paused) {
    document.getElementsByClassName("pause")[0].style.display = "block";
  } else {
    document.getElementsByClassName("pause")[0].style.display = "none";
  }
}
function NextLevel() {
  Pause(false);
  document.getElementsByClassName("LvlComplete")[0].style.display = "none";
}

document.onkeypress = (function(evt) {
  evt = evt || window.event;
  var charCode = evt.keyCode || evt.which;
  var charStr = String.fromCharCode(charCode);
  if (charStr === "p") {
    Pause();
  }
});
window.onresize = (function(event) {
  canvas.height = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
  canvas.width = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth;
})();

// EVENT LISTENERS
canvas.addEventListener('mousemove', function(evt) {
  game.mousePos = getMousePos(canvas, evt);
}, false);

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function mouseClick(event) {
  event.preventDefault();
  if (!player.shot) {
    player.shoot();
    setTimeout(function() {
      player.shot = false;
    }, 500);
    player.shot = true;
  }
}
var a = document.createElement('audio');
var SoundTest = function() {
  return (!!(a.createElement('audio').canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')));
};

//PLAYER CLASS
var player = {
  x: (canvas.width / 2),
  y: (canvas.height - 60),
  vx: 0,
  vy: 0,
  health: 10,
  Bullets: [],
  active: true,
  weapons: {
    selected: [0, 0, 0],
    choice: ["Uzi", "Hunting Rifle", "Shotgun", "Minigun"],
    secondary: ["Grenade", "Mine", "Ice Cracker", "Reaper"],
    support: ["Upgrade Wall", "Barbes Wire", "Eskimo Guards", "Polar Bear", "Mortar Support"]
  },
  draw: function() {
    ctx.save();
    ctx.translate((canvas.width / 2), canvas.height - 60);
    ctx.rotate(Math.atan2(game.mousePos.x - (canvas.width / 2), (canvas.height - 60) - game.mousePos.y));
    ctx.drawImage(img, 0, 0, 42, 59, -18, -33, 42, 59);
    ctx.restore();
  },
  update: function() {
    if (player.health < 1) {
      return false;
    } else {
      return true;
    }
  },
  shot: false,
  snd: new Audio((SoundTest) ? "http://fassetar.github.io/penguins-rising/content/audio/mp3/gunshot.mp3" : "http://fassetar.github.io/penguins-rising/content/audio/wav/gunshot.wav"),
  shoot: function() {
    var angle = Math.atan2((canvas.width / 2) - game.mousePos.x, (canvas.height - 60) - game.mousePos.y);
    player.snd.play();
    player.Bullets.push(Bullet({
      radian: angle,
      x: (canvas.width / 2) + -18 * Math.sin(angle),
      y: (canvas.height - 60) + -18 * Math.cos(angle)
    }));
  },
  displayName: 'anonymous',
  profileUrl: '',
  userId: '',
  loadLocalPlayer: function() {
    var request = gapi.client.games.players.get({
      playerId: 'me'
    });
    request.execute(function(response) {
      if (!response.displayName) {
        response.displayName = 'anonymous';
      }
      $('#welcome #message').text('Welcome, ' + response.displayName + '!');
      $('#welcomeAchievements, #welcomeleaderboards').fadeIn();
      player.displayName = response.displayName;
      player.profileUrl = response.avatarImageUrl;
      player.userId = response.playerId;
      welcome.dataLoaded(welcome.ENUM_PLAYER_DATA);
    });
  }
};

// ENEMY CLASS
function Enemy(I) {
  I = I || {};
  I.active = true;
  I.age = Math.floor(Math.random() * 128);
  I.x = Math.random() * canvas.width;
  I.y = 0;
  I.xVelocity = 0;
  I.yVelocity = 0.5;
  I.width = 42;
  I.height = 37;
  I.length = 0;
  I.frame = undefined;
  I.index = 0;
  I.elapsed = 0;
  I.snd = new Audio((SoundTest) ? "http://fassetar.github.io/penguins-rising/content/audio/mp3/cry.mp3" : "content/wav/cry.wav");
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
    });
  I.reset = (function() {
    I.elapsed = 0;
    I.index = 0;
    I.frame = I.animation.frames[I.index];
  })();
  I.length = I.animation.frames.length;
  I.inBounds = function() {
    if (I.y !== canvas.height) {
      return I.x >= 0 && I.x <= canvas.width &&
        I.y >= 0 && I.y <= canvas.height;
    } else {
      player.health -= 1;
      return false;
    }
  };
  I.RnP = Math.floor(Math.random() * 3);
  I.deadAnm = [169, 204, 250];
  I.draw = function() {
    if (I.active) {
      ctx.drawImage(img, I.frame.x, 0, I.width, I.height, I.x, I.y, I.width, I.height);
    } else {
      ctx.drawImage(img, I.deadAnm[I.RnP], 0, 45, 37, I.x, I.y, 46, 37);
    }
  };
  I.update = function() {
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
  I.deactive = function() {
    I.active = false;
  };
  return I;
}

// BOSS CLASS
function Boss() {}
Boss.prototype = new Enemy();

// BULLET CLASS
function Bullet(I) {
  I.type = 0;
  I.active = true;
  I.speed = 10;
  I.radian = Math.atan2((canvas.width / 2) - game.mousePos.x, (canvas.height - 60) - game.mousePos.y);
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
    ctx.fillStyle = I.color;
    ctx.fillRect(I.x, I.y, I.width, I.height);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.active = I.active && I.inBounds();
  };
  return I;
}

// ANIMATION METHOD
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
}

var border = new Image();
border.src = "https://raw.githubusercontent.com/fassetar/penguins-rising/master/src/content/img/borderline.jpg";
// DRAW METHOD
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(border, 23, canvas.height - 150, canvas.width - 45, 100);
  player.draw();
  TheTrulyDead.forEach(function(enemy) {
    enemy.draw();
  });
  player.Bullets.forEach(function(bullet) {
    bullet.draw();
  });
  enemies.forEach(function(enemy) {
    enemy.draw();
  });
  ctx.fillText("Kills:" + TheTrulyDead.length, 10, 50);
  ctx.fillText("Level:" + game.Lvl, 10, 70);
  ctx.fillText("Health:" + player.health, 10, 100);
}


// COLLIDE METHOD
function collides(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

// COLLISION HANDLER
function handleCollisions() {
  player.Bullets.forEach(function(bullet) {
    enemies.forEach(function(enemy) {
      if (collides(bullet, enemy)) {
        enemy.deactive();
        TheTrulyDead.push(enemy);
        enemy.snd.play();
        bullet.active = false;
      }
    });
  });
}
