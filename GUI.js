function BottomBar(imagePath) {
  this.imagePath = imagePath;
  this.x = 8;
  this.y = 582;
  this.height = 112;
  this.width = 784;

  this.NW = new Sprite(imagePath, [0, 0], [16, 16]);
  this.N = new Sprite(imagePath, [1, 0], [16, 16]);
  this.NE = new Sprite(imagePath, [2, 0], [16, 16]);
  this.W = new Sprite(imagePath, [0 ,1], [16,16]);
  this.C = new Sprite(imagePath, [1, 1], [16, 16]);
  this.EE = new Sprite(imagePath, [2, 1], [16, 16]);
  this.SW = new Sprite(imagePath, [0, 2], [16, 16]);
  this.S = new Sprite(imagePath, [1, 2], [16, 16]);
  this.SE = new Sprite(imagePath, [2, 2], [16, 16]);
}
BottomBar.prototype.drawBackground = function () {
  ctx.save();
  ctx.translate(this.x, this.y)
  //Draw upper row
  ctx.save();
  this.NW.draw();
  for(var x = 16; x < this.width - 16; x += 16) {
    ctx.translate(16, 0);
    this.N.draw();
  }
  ctx.translate(16, 0);
  this.NE.draw();
  ctx.restore();

  //Draw middle rows:
  ctx.save();
  ctx.translate(0, 16);
  for(var y = 16; y < this.height - 16; y += 16) {
    ctx.save();

    //Draw middle row
    this.W.draw();
    for(var x = 16; x < this.width - 16; x += 16) {
      ctx.translate(16, 0);
      this.C.draw();
    }
    ctx.translate(16, 0);
    this.EE.draw();

    ctx.restore();
    ctx.translate(0, 16);
  }
  ctx.restore();

  //Draw bottom row
  ctx.save();
  ctx.translate(0, this.height -16);
  this.SW.draw();
  for(var x = 16; x < this.width - 16; x += 16) {
    ctx.translate(16, 0);
    this.S.draw();
  }
  ctx.translate(16, 0);
  this.SE.draw();
  ctx.restore();
  ctx.restore();
}
BottomBar.prototype.draw = function () {
  //Draw the tiels for the BG
  this.drawBackground();

  //Draw the text
  ctx.save();
  ctx.font = "16px Trebuchet MS";
  ctx.fillStyle = "#cFcFcF";
  ctx.translate(this.x + 10, this.y + 24);
  ctx.fillText("" + humansSaved + " humans saved"  , 0, 0);
  ctx.translate(0, 24);
  ctx.fillText("" + humansDead + " humans died"  , 0, 0);
  ctx.translate(0, 24);
  ctx.fillText("" + spawnsLeft + " spawns left"  , 0, 0);
  ctx.translate(0, 24);
  ctx.fillText("" + humansLeft + " more humans needed"  , 0, 0);

  ctx.restore();

}

function Button(position, width, text, onClick) {
  this.x = position[0];
  this.y = position[1];
  this.w = width;
  this.text = text;
  this.onClick = onClick;
  this.borderColor = "#ffffff";
  this.shadowColor = "#4444ff";
}
Button.prototype.h = 32; //ALL buttons are 32px high to allow for nice edge :D

Button.prototype.draw = function() {
  ctx.save();
  ctx.translate(this.x, this.y);

  ctx.font = "bold 24px monospace";
  ctx.fillStyle = "white";
  ctx.shadowColor = this.shadowColor;
  ctx.shadowBlur = 9;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;
  ctx.fillText(this.text, (this.w / 2) - (ctx.measureText(this.text).width / 2), 24);

  ctx.translate(0, this.h);
  ctx.beginPath();
  ctx.strokeStyle = this.borderColor;
  ctx.lineWidth = 3;
  ctx.moveTo(0,0)
  ctx.lineTo(this.w, 0);
  ctx.stroke();
  ctx.restore();
}

Button.prototype.update = function(dt) {
  if(mouse[0] >= this.x && mouse[0] <= this.x + this.w &&
    mouse[1] >= this.y && mouse[1] <= this.y + this.h) {
      //Mouseover
      this.shadowColor = "#ff4444";
      if(mouse[2] > 0) {
        this.onClick();
        //A button is being pressed
      }
    } else {
      this.shadowColor = "#4444ff";
    }

}
