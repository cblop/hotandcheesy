function PlayerShip(game, x, y, bullets, cursors) {
//	this.prototype = new Ship(game, x, y, bullets);
	Ship.call(this,game,x,y,bullets);
	this.player = this;
	this.currentSpeed = 0;


	//  The base of our tank
	this.ship = game.add.sprite(0, 0, 'player', 'tank1');
	this.ship.anchor.setTo(0.5, 0.5);
	//this.ship.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
	// tank.play('move');
	//  This will force it to decelerate and limit its speed
	this.ship.body.drag.setTo(200, 200);
	this.ship.body.maxVelocity.setTo(400, 400);
	this.ship.body.collideWorldBounds = true;
	//  Finally the turret that we place on-top of the tank body
	//this.turret = game.add.sprite(0, 0, 'tank', 'turret');
	//this.turret.anchor.setTo(0.3, 0.5);
	
	//  A shadow below our tank
	//this.shadow = game.add.sprite(0, 0, 'tank', 'shadow');
	//this.shadow.anchor.setTo(0.5, 0.5);

	this.ship.bringToTop();
	//this.turret.bringToTop();


//I want this to be static to load atlas before initialising the player
this.preloader = function(game) {
	this.game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
};

this.turn = function(angle) {
	this.ship.angle += angle;
};

this.update = function() {

    if (cursors.left.isDown)
    {
        this.turn(-4);
    }
    else if (cursors.right.isDown)
    {
        this.turn(4);
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        this.currentSpeed = 300;
    }
    else
    {
        if (this.currentSpeed > 0)
        {
            this.currentSpeed -= 4;
        }
    }

    if (this.currentSpeed > 0)
    {
        game.physics.velocityFromRotation(this.ship.rotation, currentSpeed, this.ship.body.velocity);
    }
	this.game.physics.velocityFromRotation(this.ship.rotation, this.currentSpeed, this.ship.body.velocity);

    if (this.game.input.activePointer.isDown)
    {
        //  Boom!
        this.fire();
    }

	//  Position all the parts and align rotations
	//this.shadow.x = this.tank.x;
	//this.shadow.y = this.tank.y;
	//this.shadow.rotation = this.tank.rotation;
	
	//this.turret.x = this.tank.x;
	//this.turret.y = this.tank.y;
	
	//this.turret.rotation = this.game.physics.angleToPointer(this.turret);

};

this.fire = function fire (bullets) {

	if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
	{
	    this.nextFire = this.game.time.now + this.fireRate;
	    var bullet = this.bullets.getFirstDead();
	    bullet.reset(this.ship.x, this.ship.y);
	    bullet.rotation = game.physics.moveToPointer(bullet, 1000);
	}

};


}

