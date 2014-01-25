function EnemyShip(game, x, y, bullets, player) {
	Ship.call(this,game, x,y, bullets);
	this.player = player;
	this.ship = game.add.sprite(x, y, 'enemy', 'tank1');

	this.ship.anchor.setTo(0.5, 0.5);
	//this.ship.name = index.toString();
	this.ship.body.immovable = true;
	this.ship.body.collideWorldBounds = true;
	this.ship.body.bounce.setTo(1, 1);
	this.ship.angle = game.rnd.angle();

	game.physics.velocityFromRotation(this.ship.rotation, 100, this.ship.body.velocity);


this.preloader = function(game) {
	game.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
};

this.update = function() {

	// Enemy AI goes here

    if (this.game.physics.distanceBetween(this.ship, this.player) < 300)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            //bullet.reset(this.turret.x, this.turret.y);

            bullet.rotation = this.game.physics.moveToObject(bullet, this.player, 500);
        }
    }

};

}
