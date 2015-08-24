//Global important stuff
var keyDown = {};                   // A map of all keys that are being pressed
var mouse   = [0, 0, 0]             // Mouse coordinates + pressed buttons
var prevTick = Date.now();          // The timestamp of last game loop tick
var canvas;                         // Canvas element
var ctx;                            // Canvas 2D context
var nextAnimationFrame = setupEndGameScreen; //First screen we'll see

//GUI objects
var bottomBar = null;
var texts     = null;
var buttons   = null;

//Game objects
var gameOver = false;
var bgm = null;
var level = null;
var entities = [];                  // Will contain all game entities
var player = null;                  // I'm not even going to explain this

var humansInGame = 0;
var humansSpawned = 0;              // Amount of humans spawned this round
var humansLeft = -1;                // Amount of humans that still have to be saved (or killed)
var humansDead = 0;                 // Amount of humans that died this round
var humansSaved = 0;                // Amount of humans that were saved this round
var spawnsLeft = 0;                 // Amount of humans that still need to spawn


/** Entrypoint **/
$(document).ready(function() {
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");

    //Update mouse stuff as the mouse moves / clicks
    canvas.addEventListener('mousemove', function(ev) {
      var rect = canvas.getBoundingClientRect();
      mouse[0] = ev.clientX - rect.left;
      mouse[1] = ev.clientY - rect.top;
    })
    document.onmousedown = function (ev) {mouse[2] = ev.buttons;}
    document.onmouseup = function (ev) {mouse[2] = 0;}

    resources.loadResources(function() {
      console.log("Resources loaded!");
      setupMainMenuScreen();
    });
});

function setUpLevel() {
    if(bgm != null) { bgm.pause(); }

    gameOver = false;
    entities = [];
    player = null;
    bottomBar = null;

    humansLeft = level.minimumSaved;
    humansSaved = 0;
    humansSpawned = 0;
    humansInGame = 0;
    humansDead = 0;
    spawnsLeft = 0;

    player = new Player([400, 300], new Sprite('images/sprites/player.png', [0,0], [32, 32], 0.7, [[0, 0], [1, 0]]));

    // Set up spawners
    for(var i = 0; i < level.humanSpawns.length; i++) {
      var spawnDesc = level.humanSpawns[i];
      var spawner = new HumanSpawner(spawnDesc.amount, spawnDesc.location, spawnDesc.frequency);
      spawnsLeft += spawnDesc.amount;
      entities.push(spawner);
    }

    entities.push(player);

    //Set up GUI
    bottomBar = new BottomBar('images/tiles/GUI.png');

    prevTick = Date.now();
    nextAnimationFrame = gameLoop;
    bgm = RS('sounds/gamebgm.wav');
    bgm.volume = 0.4;
    bgm.currentTime = 0;
    bgm.loop = true;
    bgm.play();
    window.requestAnimationFrame(nextAnimationFrame);
}

/** Main game loop **/
function gameLoop() {
    var curTick  = Date.now();
    var dt = (curTick  - prevTick) / 1000.0;


    updateState(dt);    //Update game state (move etc, check for tile collisions as well)

    draw(dt);             //Gee what would this do

    prevTick = curTick;

    window.requestAnimationFrame(nextAnimationFrame);
}

/** Update game state **/
function updateState(dt) {
    for(var i = 0; i < entities.length; i++) {
        entities[i].update(dt);
    }
}

/** Draw everything to the canvas **/
function draw(dt){
    //Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw level
    if(level != null) { level.draw(dt); }

    //Draw entities
    for(var i = 0; i < entities.length; i++) {
        entities[i].draw(dt);
    }

    //Draw GUI
    bottomBar.draw();

}

/** Menu Screens **/
function setupEndGameScreen() {
  var font = "bold 48px monospace"
  ctx.font = font; //Make sure the font is right so we can calculate the centered position of the text

  if(bgm != null) { bgm.pause(); }

  texts = [];
  buttons = [];

  if(humansLeft > 0) {
    //Lost the game
    var s1 = "Game Over";
    var s2 = "You lost";
    var s3 = "Too many humans died.";
    texts.push({"text": s1,
                "fillStyle": "white",
                "font": font,
                "x": (canvas.width/2) - (ctx.measureText(s1).width / 2) ,
                "y": 200});
    texts.push({"text": s2,
                "fillStyle": "white",
                "font": font,
                "x": (canvas.width/2) - (ctx.measureText(s2).width / 2) ,
                "y": 300});
    texts.push({"text": s3,
                "fillStyle": "white",
                "font": font,
                "x": (canvas.width/2) - (ctx.measureText(s3).width / 2) ,
                "y": 400});
    bgm = RS('sounds/failed.wav');
  } else {
    var s1 = "Good job!";
    var s2 = "You saved enough humans!";
    texts.push({"text": s1,
                "fillStyle": "white",
                "font": font,
                "x": (canvas.width/2) - (ctx.measureText(s1).width / 2) ,
                "y": 200});
    texts.push({"text": s2,
                "fillStyle": "white",
                "font": font,
                "x": (canvas.width/2) - (ctx.measureText(s2).width / 2) ,
                "y": 300});
    bgm = RS('sounds/succeeded.wav');
  }

  var menuCallback = function() {nextAnimationFrame = setupMainMenuScreen}
  var menuButton = new Button([(canvas.width / 2 )- 50, 500], 100, "Menu", menuCallback);
  buttons.push(menuButton);

  bgm.volume = 0.4;
  bgm.currentTime = 0;
  bgm.loop = false;
  bgm.play();

  nextAnimationFrame = menuScreenLoop;
  window.requestAnimationFrame(nextAnimationFrame);
}

function setupHowToScreen() {
  texts = [];
  buttons = [];


  //Generate text
  var font = "bold 48px monospace";
  var s0 = "How to play";
  texts.push({"text": s0,
              "fillStyle": "white",
              "font": font,
              "x": (canvas.width/2) - (ctx.measureText(s0).width / 2),
              "y": 100});

  var font = "20px monospace";
  var s1 = "Stupid humans are trapped in your lair.";
  var s2 = "You need to show them the way out!";
  var s3 = "Unfortunately, humans run away from you, so you can't just";
  var s4 = "show them..."
  var s5 = "Maybe there is another way to get them out?";
  var s6 = "It is dark in your lair and humans can't see anything, make sure";
  var s7 = "they don't fall in one of those nasty pits!";

  var s8 = "Arrow keys to move, get close to humans to scare them and make ";
  var s9 = "them run away from you.";
  texts.push({"text": s1,
              "fillStyle": "white",
              "font": font,
              "x": 20,
              "y": 150});
  texts.push({"text": s2,
              "fillStyle": "white",
              "font": font,
              "x": 20 ,
              "y": 170});
  texts.push({"text": s3,
              "fillStyle": "white",
              "font": font,
              "x": 20 ,
              "y": 190});
  texts.push({"text": s4,
              "fillStyle": "white",
              "font": font,
              "x": 20 ,
              "y": 210});
  texts.push({"text": s6,
              "fillStyle": "white",
              "font": font,
              "x": 20 ,
              "y": 230});
  texts.push({"text": s7,
              "fillStyle": "white",
              "font": font,
              "x": 20,
              "y": 250});
  texts.push({"text": s8,
              "fillStyle": "white",
              "font": font,
              "x": 20 ,
              "y": 330});
  texts.push({"text": s9,
              "fillStyle": "white",
              "font": font,
              "x": 20 ,
              "y": 350});
  font = "bold 30px monospace";
  var s10 = "Controls";
  texts.push({"text": s10,
              "fillStyle": "white",
              "font": font,
              "x": 20 ,
              "y": 310});

  var menuCallback = function() {nextAnimationFrame = setupMainMenuScreen}
  var menuButton = new Button([(canvas.width / 2 )- 50, 500], 100, "Menu", menuCallback);
  buttons.push(menuButton);
  nextAnimationFrame = menuScreenLoop;
  window.requestAnimationFrame(nextAnimationFrame);
}

function setupLevelSelectScreen() {
  texts = [];
  buttons = [];

  var font = "bold 48px monospace";
  ctx.font = font; //Make sure the font is right so we can calculate the centered position of the text
  var s1 = "Level Select";
  texts.push({"text": s1,
              "fillStyle": "white",
              "font": font,
              "x": (canvas.width/2) - (ctx.measureText(s1).width / 2) ,
              "y": 100});

  var x = 0;
  var y = 0;
  for(var i =0; i < levels.length; i++) {
      var b = new Button([x + 40, y + 140], 150, "Level " + i, function() {
        level = levels[parseInt(this.text.split(" ")[1])];
        nextAnimationFrame = setUpLevel;
        });
      y += 80;
      if(y > 500) {
        y = 0;
        x += 200
      }
      buttons.push(b);
  }

  nextAnimationFrame = menuScreenLoop;
  window.requestAnimationFrame(nextAnimationFrame);
}

function setupMainMenuScreen() {
  if(bgm != null) { bgm.pause(); }
  texts = [];
  buttons = [];

  var font = "bold 48px monospace";
  ctx.font = font; //Make sure the font is right so we can calculate the centered position of the text
  var s1 = "The Big Bad Monster";
  texts.push({"text": s1,
              "fillStyle": "white",
              "font": font,
              "x": (canvas.width/2) - (ctx.measureText(s1).width / 2) ,
              "y": 100});
  var font = "24px monospace";
  ctx.font = font; //Make sure the font is right so we can calculate the centered position of the text
  var s2 = "Ludum Dare #33 game by Monokles"
  texts.push({"text": s2,
              "fillStyle": "white",
              "font": font,
              "x": (canvas.width/2) - (ctx.measureText(s2).width / 2) ,
              "y": 600});

var levelSelectButton = new Button([(canvas.width / 2 )- 100, 200], 200, "Select level",
    function() {nextAnimationFrame = setupLevelSelectScreen;});
var howToButton = new Button([(canvas.width / 2 )- 100, 280], 200, "How to play",
        function() {nextAnimationFrame = setupHowToScreen;});
buttons.push(levelSelectButton);
buttons.push(howToButton);

  bgm = RS('sounds/menubgm.wav');
  bgm.volume = 0.4;
  bgm.currentTime = 0;
  bgm.loop = true;
  bgm.play();

  nextAnimationFrame = menuScreenLoop;
  window.requestAnimationFrame(nextAnimationFrame);
}

function menuScreenLoop() {
    //Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = "48px Trebuchet MS";

    //Update stuff
    for(var i = 0; i < buttons.length; i++) {
      buttons[i].update();
    }

    //Draw part
    ctx.save();
    for(var i = 0; i < buttons.length; i++) {
      buttons[i].draw();
    }
    for(var i = 0; i < texts.length; i++) {
      ctx.fillStyle = texts[i].fillStyle;
      ctx.font = texts[i].font;
      ctx.fillText(texts[i].text, texts[i].x, texts[i].y)
    }
    ctx.restore();

    window.requestAnimationFrame(nextAnimationFrame);
}


/** Keyboard event listeners, these update the keyDown map**/
$(document).keydown(function(ev) {
    ev.preventDefault();
    keyDown[ev.keyCode] = true;
});
$(document).keyup(function(ev) {
    ev.preventDefault();
    keyDown[ev.keyCode] = false;
});
