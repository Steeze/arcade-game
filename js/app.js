"use strict";
/**
 * Credit Due: 
 * Making Sprite-based Games with Canvas: http://jlongster.com/Making-Sprite-based-Games-with-Canvas
 * How to make a simple HTML5 Canvas game: http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
 */

/**
 * @description Represents a Enemy in the game.
 * @constructor
 * @param {int} x - The x coordinate position on the canvas
 * @param {int} y - The y coordinate position on the canvas
 * @param height - The height of the enemy sprite
 * @param width - The width of the enemy sprite
 * @param {int} speed - The speed of the enemy in the game
  */
var Enemy = function(x, y, height, width, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.speed = speed;
};

/**
 * @description update - position method for a enemy in the game. When the enemy reaches the right boarder of the canvas, its set back to the beginning.
 * @param dt - delta time - Used for smooth animation in the game.
 */
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    if(this.x >= 505){
        this.x = 0;
    }
    player.checkCollision(this);
};

/**
 * @description render - Draws the enemy on the canvas
 */
Enemy.prototype.render = function() {
    ctx.drawImage(resources.get(this.sprite), this.x, this.y);
};

/**
 * @description Represents a Player in the game.
 * @constructor
 * @param x - The x coordinate position on the canvas
 * @param y - The y coordinate position on the canvas
 * @param height - The height of the player sprite
 * @param width - The width of the player sprite
 * @param speed - The speed of the player in the game
 */
var Player = function(x, y, height, width, speed, score, level){
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.score = score;
    this.level = level;
};

/**
 * @description reset - Returns the player to the start position on the canvas after a collision with an enemy or a successful trip to the other side.
 */
Player.prototype.reset = function(){
  this.x = 200;
  this.y = 400;  
};

/**
 * @description update - Update is called from the engine and currenty checks if the player is within its bounds and if the player has made it safely across.
 */
Player.prototype.update = function(){
    
    if (this.y > 400 ) {
        this.y = 400;
    }
    if (this.x > 418) {
        this.x = 418;
    }
    if (this.x < -15) {
        this.x = -15;
    }
};

/**
 * @description checkIfPlayerMadeIt - Checks if the player made it to the end goal.
 */
Player.prototype.checkIfPlayerMadeIt = function(){
    if(this.y < -20){
        this.reset();
        this.level += 1;
        this.determineScore('madeIt');

        levelUp(this.score, this.level);
    }
};

/**
 * @description determineScore - Determines the players current score based on scoring type.
 * If no scoring type is passed in, the score will be returned. The score can not go below 0.
 * @param scoreType {string} - This is the type of score that occurred, either madeIt or collided
 */
Player.prototype.determineScore = function(scoreType){

   if(scoreType === 'madeIt'){
       this.score += 10;
   }

   if(scoreType === 'collided'){
       this.score -= 1;
   }

    if(this.score <= 0){
        this.score = 0;
    }
};

/**
 * @description render - Draws the player on the canvas
 */
Player.prototype.render = function () {
    ctx.drawImage(resources.get(this.sprite), this.x, this.y);
};

/**
 * @description handleInput -  Responses to the key up event captured in the key up event listener.
 * @param keyPress {string} - The key up event converted to a string in the event listener.
 */
Player.prototype.handleInput = function(keyPress) {
    if (keyPress == 'left') {
        this.x -= this.speed;
    }
    if (keyPress == 'up') {
        this.y -= this.speed - 5;
    }
    if (keyPress == 'right') {
        this.x += this.speed;
    }
    if (keyPress == 'down') {
        this.y += this.speed - 5;
    }
 };

/**
 * @description checkCollision - Checks the position of the enemy in response to the player.
 * If a collision occurs the score is decreased by a point, the score is updated and the player reset
 * @param enemy
 */
Player.prototype.checkCollision = function(enemy){

    if (this.y + this.height > enemy.y + 90 &&
        this.x < enemy.x + enemy.width &&
        this.y + 73 < enemy.y + enemy.height &&
        this.x + this.width > enemy.x + 11) {
        player.reset();
        player.determineScore('collided');
        displayScore(player.score);
    }
};

/**
 * @description getCanvas - Returns the canvas tag on the DOM to append the level and score to.
 * @returns {*}
 */
var getCanvas = function(){
   var cs = document.getElementsByTagName('canvas');
   return cs[0];
};

/**
 * @description displayScore - Updates the DOM with the current score.
 * @param playerScore {int} - The current player score
 */
var displayScore = function(playerScore){
   var canvasElement =  getCanvas();    
    scoreDisplay.innerHTML = 'Score: ' + playerScore;
    document.body.insertBefore(scoreDisplay, canvasElement);
};

/**
 * @description displayLevel - Updates the DOM with the current level.
 * @param gameLevel
 */
var displayLevel = function(gameLevel){
    var firstCsElement = getCanvas(); 
    levelDisplay.innerHTML = 'Level: ' + gameLevel +' ';
    document.body.insertBefore(levelDisplay, firstCsElement);
};

/**
 * @description levelUp -  Resets the current enemies and adds new enemies based on the level of the game.
 * The speed and position of the enemies are random. The score and level are also updated.
 * @param playerScore {int} - The players current score.
 * @param gameLevel {int} - The players current game level.
 */
var levelUp = function(playerScore, gameLevel){

      allEnemies.splice(0, allEnemies.length);
      
      for (var i = 0; i <= gameLevel - 1; i++) {
          var enemy = new Enemy(0, Math.random() * 184 + 50, 135, 88, Math.random() * 256);
          allEnemies.push(enemy);
      }
      
    displayScore(playerScore);
    displayLevel(gameLevel);
  };

/**
 * @description Initialization of the game. The game starts with one enemy and one player.
 */
var allEnemies = [];
allEnemies.push(new Enemy(0, Math.random() * 184 + 50, 135, 88, Math.random() * 256 ));

var player = new Player(202.5, 383, 131, 76, 50, 0, 1);

var scoreDisplay = document.createElement('div');
var levelDisplay = document.createElement('div');

displayScore(0);
displayLevel(1);

/**
 * @description event listener for the keyup DOM event.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
