/* Resources.js
 * This is simple an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    function _load(url) {
        if(resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
            return resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            var img = new Image();
            img.onload = function() {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the images src attribute to the passed in URL.
             */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developer's to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been completed loaded.
     */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    window.resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

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


/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        player.checkIfPlayerMadeIt();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(resources.get(rowImages[row]), col * 101, row * 83);
            }
        }


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
