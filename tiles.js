function Tile(sprite, solidness, isDeadly) {
  this.sprite = sprite;
  this.solidness = solidness; //Solidness, number between 1 and 0, 1 being full solid, 0.5 being a 0.5x velocity modifier and 0 being not solid
  this.isDeadly = isDeadly || false; //True if this tile kills humans
}
Tile.prototype.draw = function() {
    this.sprite.draw();
}
