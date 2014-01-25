function FriendlyShip(game, x, y, bullets, player) {
	Ship.call(this, game, x, y, bullets);
	this.player = player;
}

FriendlyShip.prototype = new Ship;

FriendlyShip.prototype.update = function() {

	// Friendly AI goes here
	
}