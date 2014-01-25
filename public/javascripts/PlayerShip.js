function PlayerShip(game, x, y, bullets, cursors) {
	Ship.call(this,game,game.add.sprite(x,y,'player'),bullets);
	this.fireRate = config.player.fireRate;
	    this.health = config.player.health;
	//  This will force it to decelerate and limit its speed
	this.ship.body.drag.setTo(config.player.dragX, config.player.dragY);


//I want this to be static to load atlas before initialising the player
this.preloader = function(game) {
	this.game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
};

this.update = function(cursors) {

    if (cursors.left.isDown)
    {
        this.turn(-config.player.turnRate);
    }
    else if (cursors.right.isDown)
    {
        this.turn(config.player.turnRate);
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        //this.setSpeed(300);
        this.accelerate(config.player.acceleration);
    }
    else
    {
            this.accelerate(config.player.decleration);
    }

    if (this.currentSpeed > 0)
    {
        this.updateVelocity();
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && player.alive)
    {
        //  Boom!
        this.fire();
    }

};


}

