function PlayerShip(game, x, y, bullets, cursors) {
	Ship.call(this,game,game.add.sprite(x,y,'player','tank1'),bullets);
	this.fireRate = 50;
	//  This will force it to decelerate and limit its speed
	this.ship.body.drag.setTo(200, 200);


//I want this to be static to load atlas before initialising the player
this.preloader = function(game) {
	this.game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
};

this.update = function(cursors) {

    if (cursors.left.isDown)
    {
        this.turn(-0.06);
    }
    else if (cursors.right.isDown)
    {
        this.turn(0.06);
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        //this.setSpeed(300);
        this.accelerate(200);
    }
    else
    {
            this.accelerate(-4);
    }

    if (this.currentSpeed > 0)
    {
        this.updateVelocity();
    }

    if (this.game.input.activePointer.isDown)
    {
        //  Boom!
        this.fire();
    }

};


}

