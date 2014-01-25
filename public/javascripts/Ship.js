Ship = function(game, x, y, bullets) {
	this.game = game;
	this.bullets = bullets;
	this.fireRate = 1000;
	this.nextFire = 0;
	this.currentSpeed = 0;
	this.alive = true;
	this.health = 1;

	this.damage = function() {
	    this.health -= 1;
	    if (this.health <= 0)
	    {
	        this.alive = false;
	        return true;
	    }
	    return false;
	};
};
