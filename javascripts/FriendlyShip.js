function FriendlyShip(index, game, x, y, bullets, player) {
	AIShip.call(this, game, game.add.sprite(x,y,'friend','tank1'), bullets, player);
	this.ship.shipType = "friend";
	this.ship.index = index;
	this.ship.name = this.ship.type + "-" + index.toString();
};

