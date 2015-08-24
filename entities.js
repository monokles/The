/** ENTITY SUPER CLASS **/
function Entity() {
    this.visible = true;
    this.x = 0;
    this.y = 0;
}

Entity.prototype.update = function(dt) {
    // global update code
}

Entity.prototype.onCollide = function (object) {
  //global collide code
}

Entity.prototype.draw = function(dt) {
    if(!this.visible) { return; }
    //Global drawcode
}

/** Show a blurry full caps text **/
Entity.prototype.shoutText = function(text, color) {
  ctx.save();
  ctx.font = "12px impact";
  ctx.fillStyle = color;
  ctx.lineWidth = 0.5;
  ctx.translate (this.x, this.y);
  ctx.rotate(Math.PI * (Math.random() - 0.5) * 0.02);
  ctx.fillText(text, -this.sprite.size[0], -this.sprite.size[1] / 2);
  ctx.restore();
}

/** Show normal text **/
Entity.prototype.talkText = function(text, color) {
  ctx.save();
  ctx.font = "12px Trebuchet MS";
  ctx.fillStyle = color;
  ctx.lineWidth = 0.5;
  ctx.translate (this.x, this.y);
  ctx.fillText(text, -this.sprite.size[0], -this.sprite.size[1] / 2);
  ctx.restore();
}

/** END OF ENTITY SUPER CLASS **/

/** PLAYER CLASS **/
function Player(pos,sprite) {
    //position and speed variables
    this.x = pos[0];
    this.y = pos[1];
    this.xVel = 0;
    this.yVel = 0;

    //graphics
    this.sprite = sprite;
}
Player.prototype = new Entity();
//Constants
Player.prototype.MAX_SPEED = 300;
Player.prototype.FRICTION = 0.8;
Player.prototype.ACCEL = 60;

Player.prototype.update = function(dt) {
    Entity.prototype.update.call(this, dt);

    if(keyDown[37]) {
        this.xVel <= -this.MAX_SPEED ? this.xVel = -this.MAX_SPEED : this.xVel -= this.ACCEL;
    } else if (keyDown[39]) {
        this.xVel >= this.MAX_SPEED ? this.xVel = this.MAX_SPEED : this.xVel += this.ACCEL;
    } else {
        this.xVel = this.xVel * this.FRICTION;
        if(Math.abs(this.xVel) < 0.1) { this.xVel = 0; }
    }
    if(keyDown[38]) {
        this.yVel <= -this.MAX_SPEED ? this.yVel = -this.MAX_SPEED : this.yVel -= this.ACCEL;
    } else if(keyDown[40]) {
        this.yVel >= this.MAX_SPEED ? this.yVel = this.MAX_SPEED : this.yVel += this.ACCEL;
    } else {
        this.yVel = this.yVel * this.FRICTION;
        if(Math.abs(this.yVel) < 0.1) { this.yVel = 0; }
    }

    var nextX = this.x + (this.xVel * dt);
    var nextY = this.y + (this.yVel * dt);
    this.processTileCollisions(nextX, nextY);

    //Recalculate the right hand side because processTileCollisions might have changed these properties
    this.x = this.x + (this.xVel * dt);
    this.y = this.y + (this.yVel * dt);
}

Player.prototype.draw = function(dt) {
    if(!this.visible) { return; }
    Entity.prototype.draw.call(this, dt);

    ctx.save();
    ctx.translate(this.x -16, this.y - 16);
    this.sprite.draw(dt);
    // ctx.beginPath();
    // ctx.arc(0, 0, 16, 0, 2 * Math.PI, false);
    // ctx.fillStyle = 'red';
    // ctx.fill();
    ctx.restore();
};

Player.prototype.processTileCollisions = function(nextX, nextY) {
    var nextXTile = level.getTile(nextX + ((this.xVel > 0)? 16 : -16), this.y);
    if(nextXTile) {
      this.xVel = this.xVel * (1 - nextXTile.solidness);
    } else {
      this.xVel = 0;
    }
    var nextYTile = level.getTile(this.x, nextY + ((this.yVel > 0)? 16 : -16));
    if(nextYTile) {
      this.yVel = this.yVel * (1 - nextYTile.solidness);
    } else {
      this.yVel = 0;
    }
};

Player.prototype.onCollide = function(object) {
  Entity.prototype.onCollide.call(this, object);

};
/** END OF PLAYER CLASS **/

/** HUMAN CLASS **/ //This is not the HUMAN player, but the HUMAN idiot mob which you don't control
function Human(position, sprite) {
  this.x = position[0];
  this.y = position[1];
  this.sprite = sprite;
  this.xVel = 0;
  this.yVel = 0;
  this.xAccel = 0;
  this.yAccel = 0;
  this.isRunning = false;
  this.isAlive = true;
  this.size = 1;

  this.textCounter = -1;
  this.shoutTextContent = "";
  this.talkTextContent = "";
}
Human.prototype = new Entity();
//Constants
Human.prototype.MAX_SPEED_RUNNING = 200;
Human.prototype.MAX_SPEED         = 100;
Human.prototype.FRICTION          = 0.4;
Human.prototype.MAX_ACCEL         = 30;
Human.prototype.SCARE_DIST        = 64;

Human.prototype.draw = function(dt) {
  if(!this.visible) { return; }
  Entity.prototype.draw.call(this);

  if(this.textCounter > 0) {
    if(this.talkTextContent.length > 0 && this.talkTextContent.indexOf("FFF") > -1) {
      this.shoutText(this.talkTextContent, "#DDDDDD");
    } else if(this.talkTextContent.length > 0) {
      this.talkText(this.talkTextContent, "#DDDDDD");
    }
    this.textCounter -= dt;
  } else {
    this.talkTextContent = "";
    this.shoutTextContent = "";
  }

  if(!this.isAlive) {
    ctx.save();
    ctx.translate(this.x - 8, this.y - 8);
    ctx.scale(this.size, this.size);
    this.sprite.draw(dt);
    // ctx.beginPath();
    // ctx.fillStyle = 'blue';
    // ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
    // ctx.fill();
    ctx.restore();
    this.size *= 0.98;
    if(this.size < 0.2) {
      this.visible = false;
    }
    return;
  }

  ctx.save();
  ctx.translate(this.x - 8, this.y - 8);

  this.sprite.draw(dt);
  // ctx.beginPath();
  // ctx.fillStyle = 'blue';
  // ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
  // ctx.fill();
  ctx.restore();
}

Human.prototype.setRandomAcceleration = function() {
  //Human is not doing anything, find a direction to walk in!
  var rnd1 = Math.random();
  var rnd2 = Math.random();

  if(this.xAccel == 0) {
    if(rnd1 < 0.5) {
      this.xAccel = rnd2 * this.MAX_ACCEL;
    } else {
      this.xAccel = rnd2 * -this.MAX_ACCEL;
    }
  }
  if(this.yAccel == 0) {
    if(rnd2 < 0.5) {
      this.yAccel = rnd1 * this.MAX_ACCEL;
    } else {
      this.yAccel = rnd1 * -this.MAX_ACCEL;
    }
  }
}

Human.prototype.processTileCollisions = function(nextX, nextY) {
    var nextXTile = level.getTile(nextX + ((this.xVel > 0)? 8 : -8), this.y);
    if(nextXTile) {
      this.xVel = this.xVel * (1 - nextXTile.solidness);
      if(nextXTile.solidness >= 1) {this.xAccel *= -0.1; }
    } else {
      this.xVel = 0;
    }
    var nextYTile = level.getTile(this.x, nextY + ((this.yVel > 0)? 8 : -8));
    if(nextYTile) {
      this.yVel = this.yVel * (1 - nextYTile.solidness);
      if(nextYTile.solidness >= 1) {this.yAccel *= -0.1; }
    } else {
      this.yVel = 0;
      // this.yAccel = (Math.random() - 0.5) * this.MAX_ACCEL;
    }
};

/** React to being close to a player **/
Human.prototype.processPlayerProximity = function(nextX, nextY) {
  var distance = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
  if(distance < this.SCARE_DIST) {
    if(this.talkTextContent.length == 0) {this.talkTextContent = resources.getRandomPanicText()};
    this.textCounter = 2.0;
    var futureDx = player.x - nextX;
    var futureDy = player.y - nextY;

    var xHeadedToPlayer = this.xAccel < 0 == futureDx < 0;
    var yHeadedToPlayer = this.yAccel < 0 == futureDy < 0;
    if(xHeadedToPlayer ) {
      this.xAccel += (this.xAccel > 0)? -10 : 10;
    }
    if(yHeadedToPlayer) {
      this.yAccel += (this.yAccel > 0)? -10 : 10;
    }
  }
}

Human.prototype.update = function(dt) {
    if(!this.isAlive) {
      return;
    }
    Entity.prototype.update.call(this, dt);

    //Check if this human is about to die
    var tile =level.getTile(this.x, this.y);
    if(tile.isDeadly) {
      humansDead++;
      humansInGame--;

      this.x = this.x + (this.xVel * dt);
      this.y = this.y + (this.yVel * dt);

      if(humansLeft > spawnsLeft + humansInGame) {
        gameOver = true;
        nextAnimationFrame = setupEndGameScreen;
      }

      this.isAlive = false;
      RS('sounds/died.wav').play();

    } else if(level.isGoalCoords(this.x, this.y)) {

      this.x = this.x + (this.xVel * dt);
      this.y = this.y + (this.yVel * dt);

      this.isAlive = false;
      RS('sounds/escaped.wav').play();

      humansSaved++;
      humansLeft--;
      humansInGame--;

      if(humansLeft == 0) {
        gameOver = true;
        nextAnimationFrame = setupEndGameScreen;
      }
    }

    // Set random acceleration on each axis
    if(this.xAccel == 0 || this.yAccel == 0) {
      this.setRandomAcceleration();
    }

    var MAX_SPEED = this.MAX_SPEED;
    if(this.isRunning) {
      MAX_SPEED = this.MAX_SPEED_RUNNING;
    }

    this.xAccel *= 1.05;
    this.yAccel *= 1.05;
    //Accelerate faster
    if(Math.abs(this.xAccel) >= this.MAX_ACCEL) {
      this.xAccel = (this.xAccel < 0)? -this.MAX_ACCEL : this.MAX_ACCEL;
    }
    if(Math.abs(this.yAccel) >= this.MAX_ACCEL) {
      this.yAccel = (this.yAccel < 0)? -this.MAX_ACCEL : this.MAX_ACCEL;;
    }

    if(this.xVel < 0) {
      this.xVel + this.xAccel <= -MAX_SPEED ? this.xVel = -MAX_SPEED : this.xVel += this.xAccel;
    } else {
      this.xVel + this.xAccel >= MAX_SPEED ? this.xVel = MAX_SPEED : this.xVel += this.xAccel;
    }

    if(this.yVel < 0) {
      this.yVel + this.yAccel <= -MAX_SPEED ? this.yVel = -MAX_SPEED : this.yVel += this.yAccel;
    } else {
      this.yVel + this.yAccel >= MAX_SPEED ? this.yVel = MAX_SPEED : this.yVel += this.yAccel;
    }



    this.processPlayerProximity(this.x + (this.xVel * dt), this.y + (this.yVel * dt));
    this.processTileCollisions(this.x + (this.xVel * dt), this.y + (this.yVel * dt));

    //Recalculate the right hand side because processTileCollisions might have changed these properties
    this.x = this.x + (this.xVel * dt);
    this.y = this.y + (this.yVel * dt);
}

/**END OF HUMAN CLASS **/

/** HUMANSPAWNER CLASS **/
HumanSpawner = function(amount, location, frequency) {
  this.amount = amount;
  this.amountSpawned = 0;
  this.frequency = frequency;
  this.counter = 0;
  this.x = location[0];
  this.y = location[1];
}

HumanSpawner.prototype.draw = function(dt) {
  ctx.save();
  var coords = level.toPixelCoords([this.x, this.y]);
  ctx.translate(coords[0] - 10, coords[1] - 5);
  ctx.font = "10px rebuchet MS";
  ctx.fillStyle = "rgba(255,255,255,1)";
  if(this.amountSpawned < this.amount) {
    ctx.fillText((this.frequency - this.counter).toFixed(1), 0, 0);
  }
  ctx.restore();
}

HumanSpawner.prototype.update = function(dt) {
  if(this.amountSpawned < this.amount && this.counter >= this.frequency) {
    var coords = level.toPixelCoords([this.x, this.y]);
    var human = new Human([coords[0], coords[1]], new Sprite('images/sprites/human.png', [0, 0], [16, 16], 0.4, [[0, 0], [1, 0]]));

    this.amountSpawned++;
    spawnsLeft--;
    humansSpawned++;
    humansInGame++;
    this.counter = 0;

    entities.push(human);
  }
  this.counter += dt;
}
/** END OF HUMANSPAWNER CLASS **/
