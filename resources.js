function Resources() {
    this.imagePaths = [];
    this.soundPaths = [];
    this.images = {};
    this.sounds = {};
    this.panicTexts = [];
    this.loadQueue = [];
    this.loadCallback = null;
}

Resources.prototype.loadResources = function (callback) {
  this.loadCallback = callback;

  for(var i =0; i < this.soundPaths.length; i++) {
    // this.loadQueue.push(true);
    this.sounds[this.soundPaths[i]] = new Audio(this.soundPaths[i]);
    // this.sounds[this.soundPaths[i]].onload = function() { resources.remFromLoadQueue(); };
  }

  for(var i = 0; i < this.imagePaths.length; i++) {
      this.images[this.imagePaths[i]] = new Image();
      this.images[this.imagePaths[i]].src = this.imagePaths[i];
      this.loadQueue.push(true);
      this.images[this.imagePaths[i]].onload = function() { resources.remFromLoadQueue(); };
  }
};

Resources.prototype.remFromLoadQueue = function() {
    console.log("LoadQueue has " + this.loadQueue.length + " items remaining.");
    this.loadQueue.pop(); //Pop last element from array, check if everything is loaded now
    if(this.loadQueue.length == 0 && typeof this.loadCallback !== "undefined") {
        this.loadCallback();
    }
};

Resources.prototype.getRandomPanicText = function() {
  var index = Math.floor(Math.random() * this.panicTexts.length);
  return this.panicTexts[index];
}

var resources = new Resources();

//Get an image based on name
function R(image) {
    return resources.images[image];
}

function RS(sound) {
  return resources.sounds[sound];
}

resources.imagePaths = [
    'images/tiles/tiles.png',
    'images/sprites/player.png',
    'images/sprites/human.png',
    'images/tiles/GUI.png'
];

resources.soundPaths = [
  'sounds/died.wav',
  'sounds/escaped.wav',
  'sounds/gamebgm.wav',
  'sounds/menubgm.wav',
  'sounds/failed.wav',
  'sounds/succeeded.wav'
];

resources.panicTexts = [
  "AARRGH!!!",
  "M-M-MONSTER!",
  "MY GRANDMOTHER!!",
  "PANIC!!!",
  "RUN!",
  "I Don't want to die!",
  "NOPE",
  "G'day chap!",
  "FFFFFFFFFFFFFFFFFFFFUUUUUUUUUUUU-",
  "I'm going this way!",
  "Mommy!",
  "CHAAAAAAAAAAARGE!",
  "Oh boy, you look deadly.",
  "Run run run!",
  "This park is really clean and tidy!",
  "I want to go home."
];
