function EnemyShip(game, x, y, bullets, player) {
	this.prototype = new Ship(game, x,y, bullets);
	this.player = player;


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
