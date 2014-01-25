Ship = function(game, sprite, bullets) {
//Initialese a ship with movement, firing and death
	//Stores necessary information about the ship
	this.game = game;
	this.bullets = bullets;
	this.fireRate = config.ship.fireRate;
	this.nextFire = 0;
	this.currentSpeed = 0;
	this.alive = true;
	this.health = config.ship.health;
	this.allies = [];
	this.opponents = [];
	
	//Applies the sprite to the ship
	this.ship = sprite;
        this.ship.anchor.setTo(0.5, 0.5);
        this.ship.bringToTop();
	//  This will force it to decelerate and limit its speed
        //this.ship.body.drag.setTo(200, 200);
        this.ship.body.maxVelocity.setTo(config.ship.maxVelX, config.ship.maxVelY);
	//introduces collision with world
        this.ship.body.collideWorldBounds = true;


	
	this.setAllies = function(allies) {
		this.allies = allies;}
	this.setOpponents = function(opponents) {
		this.opponents = opponents;}


	this.turn = function(delRot) {
		this.ship.rotation += delRot;
	}

	this.accelerate = function(delSpeed) {
		this.currentSpeed += delSpeed;
	}

	this.setSpeed = function(speed) {
		this.currentSpeed = speed;	
	}

	this.updateVelocity = function() {
		this.game.physics.velocityFromRotation(this.ship.rotation, this.currentSpeed, this.ship.body.velocity);
	}

	this.fire = function() {
		if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
		{
		    this.nextFire = this.game.time.now + this.fireRate;
		    var bullet = bullets.getFirstDead();
		    bullet.reset(this.ship.x, this.ship.y);
		    bullet.rotation = this.ship.rotation;
	      	    this.game.physics.velocityFromRotation(this.ship.rotation, config.bullet.speed, bullet.body.velocity);
		}

	}

	this.damage = function(amount) {
	    this.health -= amount;
	    if (this.health <= 0)
	    {
	        this.alive = false;
	        this.ship.kill();
		return true;
	    }
	    return false;
	};

};
