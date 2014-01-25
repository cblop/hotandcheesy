function FriendlyShip(game, x, y, bullets, player) {
	this = new Ship(game, x, y, bullets);
	this.player = player;
}

FriendlyShip.prototype.preloader = function(game) {
	game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
}


FriendlyShip.prototype.update = function() {

	// Friendly AI goes here
	
}
