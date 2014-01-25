function FriendlyShip(index, game, x, y, bullets, player) {
	AIShip.call(this, index, game, game.add.sprite(x,y,'enemy','tank1'), bullets, player);
};

