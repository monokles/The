function Sprite(image, position, size, speed, frames) {
    this.image = image;
    this.position = position;
    this.size = size;
    this.speed = speed || -1;
    this.frames = frames || [];
    this.counter = 0;
    this.frameIndex = 0;
}

Sprite.prototype.draw = function(dt) {
    if(this.speed != -1) {
      this.counter += dt;
      if(this.counter >= this.speed) {
        this.counter = 0;
        this.frameIndex = (this.frameIndex + 1 ) % this.frames.length;
        this.position = this.frames[this.frameIndex];
      }
    }
    var w = this.size[0];
    var h = this.size[1];
    var x = this.position[0] * w;
    var y = this.position[1] * h;
    ctx.drawImage(R(this.image), x, y, w, h, 0, 0, w, h);
}
