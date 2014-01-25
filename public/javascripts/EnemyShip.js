function EnemyShip(game, x, y, bullets, player) {
	Ship.call(this, game, x, y, bullets);
	this.player = player;
}

EnemyShip.prototype = new Ship;

EnemyShip.prototype.update = function() {

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

}