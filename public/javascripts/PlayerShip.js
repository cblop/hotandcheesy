function PlayerShip(game, x, y, bullets) {
//	this.prototype = new Ship(game, x, y, bullets);
	Ship.call(this,game,x,y,bullets);
	this.player = this;
	this.currentSpeed = 0;
	this.fireRate = 50;

	//  The base of our tank
	this.tank = game.add.sprite(0, 0, 'tank', 'tank1');
	this.tank.anchor.setTo(0.5, 0.5);
	this.tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
	//  This will force it to decelerate and limit its speed
	this.tank.body.drag.setTo(200, 200);
	this.tank.body.maxVelocity.setTo(400, 400);
	this.tank.body.collideWorldBounds = true;
	
	//  A shadow below our tank
	this.shadow = game.add.sprite(0, 0, 'tank', 'shadow');
	this.shadow.anchor.setTo(0.5, 0.5);

	this.tank.bringToTop();


//I want this to be static to load atlas before initialising the player
this.preloader = function(game) {
	this.game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
};

this.turn = function(angle) {
	this.tank.angle += angle;
};

this.update = function() {
	if(this.currentSpeed > 4){
		this.currentSpeed -= 4;
	}else{
		this.currentSpeed = 0;
	}
	this.game.physics.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity);

	//  Position all the parts and align rotations
	this.shadow.x = this.tank.x;
	this.shadow.y = this.tank.y;
	this.shadow.rotation = this.tank.rotation;

};

this.fire = function fire () {

	if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
	{
	    this.nextFire = this.game.time.now + this.fireRate;
	    var bullet = bullets.getFirstDead();
	    bullet.reset(this.tank.x, this.tank.y);
	    bullet.rotation = this.tank.rotation;
		this.game.physics.velocityFromRotation(this.tank.rotation, 1000, bullet.body.velocity);
	}

};


}

