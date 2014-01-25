function PlayerShip(game, x, y, bullets) {
	this = new Ship(game, x, y, bullets);
	this.player = player;
	this.currentSpeed = 0;


	//  The base of our tank
	this.tank = game.add.sprite(0, 0, 'tank', 'tank1');
	this.tank.anchor.setTo(0.5, 0.5);
	this.tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
	// tank.play('move');
	//  This will force it to decelerate and limit its speed
	this.tank.body.drag.setTo(200, 200);
	this.tank.body.maxVelocity.setTo(400, 400);
	this.tank.body.collideWorldBounds = true;
	//  Finally the turret that we place on-top of the tank body
	this.turret = game.add.sprite(0, 0, 'tank', 'turret');
	this.turret.anchor.setTo(0.3, 0.5);
	
	//  A shadow below our tank
	this.shadow = game.add.sprite(0, 0, 'tank', 'shadow');
	this.shadow.anchor.setTo(0.5, 0.5);

	this.tank.bringToTop();
	this.turret.bringToTop();

}

//I want this to be static to load atlas before initialising the player
PlayerShip.prototype.preloader = function(game) {
	this.game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
}

PlayerShip.prototype.turn = function(angle) {
	this.tank.angle += angle;
}

PlayerShip.prototype.update = function() {
	if(this.currentSpeed > 4){
		this.currentSpeed -= 4;
	}else{
		this.currentSpeed = 0;
	}
	this.game.physics.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);

	//  Position all the parts and align rotations
	shadow.x = tank.x;
	shadow.y = tank.y;
	shadow.rotation = tank.rotation;
	
	turret.x = tank.x;
	turret.y = tank.y;
	
	turret.rotation = game.physics.angleToPointer(turret);

}

PlayerShip.prototype.fire = 143 function fire (bullets) {

	if (game.time.now > this.nextFire && bullets.countDead() > 0)
	{
	    this.nextFire = game.time.now + this.fireRate;
	    var bullet = bullets.getFirstDead();
	    bullet.reset(turret.x, turret.y);
	    bullet.rotation = game.physics.moveToPointer(bullet, 1000);
	}

}

