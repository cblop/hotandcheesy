function EnemyShip(index, game, x, y, bullets, player) {
	AIShip.call(this, game, game.add.sprite(x,y,'enemy','tank1'), bullets, player);
	this.ship.shipType = "enemy";
	this.ship.index = index;
	this.ship.name = this.ship.type + "-" + index.toString();
};

