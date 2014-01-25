function PlayerShip(game, x, y, bullets, cursors) {
//	this.prototype = new Ship(game, x, y, bullets);
	Ship.call(this,game,x,y,bullets);
	this.player = this;
	this.currentSpeed = 0;
	this.fireRate = 50;

	//  The base of our tank
	this.ship = game.add.sprite(0, 0, 'player', 'tank1');
	this.ship.anchor.setTo(0.5, 0.5);
	//this.ship.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
	// tank.play('move');
	//  This will force it to decelerate and limit its speed
	this.ship.body.drag.setTo(200, 200);
	this.ship.body.maxVelocity.setTo(400, 400);
	this.ship.body.collideWorldBounds = true;

	this.ship.bringToTop();


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
        game.physics.velocityFromRotation(this.ship.rotation, this.currentSpeed, this.ship.body.velocity);
    }
	this.game.physics.velocityFromRotation(this.ship.rotation, this.currentSpeed, this.ship.body.velocity);

    if (this.game.input.activePointer.isDown)
    {
        //  Boom!
        this.fire();
    }

};

this.fire = function fire () {

	if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
	{
	    this.nextFire = this.game.time.now + this.fireRate;
	    var bullet = bullets.getFirstDead();
	    bullet.reset(this.ship.x, this.ship.y);
	    bullet.rotation = this.ship.rotation;
		this.game.physics.velocityFromRotation(this.ship.rotation, 1000, bullet.body.velocity);
	}

};


}

