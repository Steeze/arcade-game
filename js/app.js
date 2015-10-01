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
    checkCollision(this);
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
var Player = function(x, y, height, width, speed){
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.speed = speed;
};

/**
 * @description reset - Returns the player to the start position on the canvas after a collision with an enemy or a successful trip to the other side.
 */
Player.prototype.reset = function(){
  this.x = 200;
  this.y = 400;  
};

/**
 * @description update - Update is called from the engine and currenty checks if the player is within its bounds and if the player has made it safely accross.
 */
Player.prototype.update = function(){
    
    checkPlayerBounds(this);

    checkIfPlayerMadeIt(this);
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
        player.x -= player.speed;
    }
    if (keyPress == 'up') {
        player.y -= player.speed - 5;
    }
    if (keyPress == 'right') {
        player.x += player.speed;
    }
    if (keyPress == 'down') {
        player.y += player.speed - 5;
    }
 };

/**
 * @description checkCollision - Checks the position of the enemy in response to the player. If a collision occurs the score is decreased by a point, the score is updated and the player reset.
 * @param enemy {object} - This represents the enemy in the game.
 */
 var checkCollision = function(enemy){

     if (player.y + player.height > enemy.y + 90 &&
         player.x < enemy.x + enemy.width &&
         player.y + 73 < enemy.y + enemy.height &&
         player.x + player.width > enemy.x + 11) {
         
         player.reset();
         playerScore =  determinePlayerScore(playerScore, 'collided');
         displayScore(playerScore);
     }

 };

/**
 * @description checkIfPlayerMadeIt - Checks if the player made it to the end goal.
 * @param player {object} - This represents the player in the game.
 */
var checkIfPlayerMadeIt = function(player){
    if(player.y < -20){
        player.reset();
        gameLevel += 1;
        playerScore = determinePlayerScore(playerScore, 'madeIt');
        levelUp(playerScore, gameLevel);
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
    playerScore = determinePlayerScore(playerScore);
    scoreDisplay.innerHTML = 'Score: ' + playerScore;
    document.body.insertBefore(scoreDisplay, canvasElement);
};

/**
 * @description displayLevel - Updates the DOM with the current level.
 * @param gameLevel
 */
var displayLevel = function(gameLevel){
    var firstCsElement = getCanvas(); 
    levelDisplay.innerHTML = 'Level: ' + gameLevel+' ';
    document.body.insertBefore(levelDisplay, firstCsElement);
};

/**
 * @description determinePlayerScore - Determines the players current score based on scoring type. If no scoring type is passed in, the score will be returned. The score can not go below 0.
 * @param score {int} - The current score it the game.
 * @param scoreType {string} - The scope type, either madeIt or collided
 * @returns the current score.
 */
var determinePlayerScore = function(score, scoreType){

   if(score <= 0){
       score = 0;
   }

   if(scoreType === 'madeIt'){
       score += 10;
   }

   if(scoreType === 'collided'){
       score -= 1;
   }

   return score;
};

/**
 * @description levelUp -  Resets the current enemies and adds new enemies based on the level of the game. The speed and position of the enemies are random. The score and level are also updated.
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
 * @description checkPlayerBounds - Checks to make sure the player will not navigate off of the canvas.
 * @param player {object} - This represents the player in the game.
 */
var checkPlayerBounds = function(player) {
    if (player.y > 400 ) {
        player.y = 400;
    }
    if (player.x > 418) {
        player.x = 418;
    }
    if (player.x < -15) {
        player.x = -15;
    }
};

/**
 * @description Initialization of the game. The game starts with one enemy and one player.
 */
var allEnemies = [];
allEnemies.push(new Enemy(0, Math.random() * 184 + 50, 135, 88, Math.random() * 256 ));

var player = new Player(202.5, 383, 131, 76, 50);
var playerScore = 0;
var gameLevel = 1;

var scoreDisplay = document.createElement('div');
var levelDisplay = document.createElement('div');

displayScore(playerScore);
displayLevel(gameLevel);

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
