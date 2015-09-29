// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //dt = dt * 100;
    this.x += this.speed * dt;

    if(this.x >= 505){
        this.x = 0;
    }
    checkCollision(this);
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

    Object.prototype.reset = function() {
        player.x = 200;
        player.y = 400;
    };

    var Player = function(x, y, speed){
       this.sprite = 'images/char-boy.png';
        this.x = x;
        this.y = y;
        this.speed = speed;
    };

    Player.prototype.update = function(){

        //if left key is pressed and player is not on edge of map, pressed decrement x
        if(this.ctlKey === 'left' && this.x > 0){
            this.x = this.x - 50;
            //if right key is pressed and player is not on edge of map increment x
        }else if(this.ctlKey === 'right' && this.x != 400){
            this.x = this.x + 50;
            //if up key is pressed increment y
        }else if(this.ctlKey === 'up'){
            this.y = this.y - 50;
            //if down key is pressed and player is not on edge of map decrement y
        }else if (this.ctlKey === 'down' && this.y != 400){
            this.y = this.y + 50;
        }
        this.ctlKey = null;

        checkPlayerBounds(this);

        checkIfPlayerMadeIt(this);

    };

    Player.prototype.render = function () {
        ctx.drawImage(resources.get(this.sprite), this.x, this.y);
    };

    Player.prototype.handleInput = function(keyPress) {
    if (keyPress == 'left') {
        player.x -= player.speed;
    }
    if (keyPress == 'up') {
        player.y -= player.speed - 10;
    }
    if (keyPress == 'right') {
        player.x += player.speed;
    }
    if (keyPress == 'down') {
        player.y += player.speed - 10;
    }
 };

 var checkCollision = function(enemy){
     if (player.y + 131 >= enemy.y + 90 && player.x + 25 <= enemy.x + 88 && player.y + 73 <= enemy.y + 135 && player.x + 76 >= enemy.x + 11) {
         player.x = 202.5;
         player.y = 383;

         playerScore = playerScore - 1;

         displayScore(playerScore);
     }
 };

var checkIfPlayerMadeIt = function(player){
    if(player.y < 25){
        this.reset();
        gameLevel += 1;
        playerScore += 10;
        levelUp(playerScore, gameLevel);
    }
};

var displayScore = function(playerScore){
   var cs = document.getElementsByTagName('canvas');
   var firstCsElement = cs[0];
    scoreDisplay.innerHTML = 'Score: ' + playerScore + ' ';
    document.body.insertBefore(scoreDisplay, firstCsElement[0]);
};

var displayLevel = function(gameLevel){
    var cs = document.getElementsByTagName('canvas');
    var firstCsElement = cs[0];
    levelDisplay.innerHTML = 'Level: ' + gameLevel+' ';
    document.body.insertBefore(levelDisplay, firstCsElement[0]);
};


var levelUp = function(playerScore, gameLevel){
      var newGameLevel = gameLevel - 1;
      allEnemies.splice(0, allEnemies.length);
      for (var i = 0; i <= newGameLevel - 1; i++) {
          var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);
          allEnemies.push(enemy);
      }

    displayScore(playerScore);
    displayLevel(newGameLevel);
  };

var checkPlayerBounds = function() {
    if (player.y > 383 ) {
        player.y = 383;
    }
    if (player.x > 402.5) {
        player.x = 402.5;
    }
    if (player.x < 2.5) {
        player.x = 2.5;
    }
};

var allEnemies = [];
allEnemies.push(new Enemy(0, Math.random() * 184 + 50, Math.random() * 256 ));

var player = new Player(202.5, 383, 50);

var playerScore = 0;

var gameLevel = 1;

var scoreDisplay = document.createElement('div');
var levelDisplay = document.createElement('div');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
