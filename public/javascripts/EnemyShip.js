function EnemyShip(index, game, x, y, bullets, player) {
	Ship.call(this, game, game.add.sprite(x,y,'enemy'), bullets);
	this.player = player;
	this.ship.body.immovable = false;
	this.ship.body.bounce.setTo(1, 1);
	this.ship.angle = game.rnd.angle();
    this.ship.name = index.toString();
    this.rotationSpeed = 0.1; // rad/update
    this.setSpeed = 100;
    this.opponents = [player];
	this.updateVelocity();

    // Private variables
    var firingDistance = 300; // Number.POSITIVE_INFINITY
    var firingAngle = 0.1; // Radians

    this.preloader = function(game) {
        game.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
    };

    this.update = function() {

        // Enemy AI goes here

        this.prioritiseTargets();
        this.checkAndFire();
        //this.engageTarget();

        this.turn(this.rotationSpeed);

    };

    this.checkAndFire = function()
    {
        // Check if we're within firing range and facing our target, if we are,
        // shoot.
        if ((this.game.physics.distanceBetween(this.ship, this.target.ship) < firingDistance) && 
            (Math.abs(this.game.physics.angleBetween(this.ship, this.target.ship) - this.ship.rotation) < firingAngle))
        {
            this.fire();
        }
    };

    this.prioritiseTargets = function() {
        // 1) Check proximity
        //   - This is an analog for how threatening the opponent is
        var minIndex = -1;
        this.target = this.opponents[0];
        return;
        this.opponents.reduce(
                function(prevVal, currentVal, index, array) {
                    res = distanceBetween(el.ship, this.ship);
                    if (res < prevVal)
                    {
                        minIndex = index;
                        return res;
                    }
                } , Number.POSITIVE_INFINITY);

        this.target = this.opponents[minIndex];
        // return minIndex;
        // 2) Check whether we're facing an enemy. If we are, shoot.
        // 3) If there are friendly obstacles between this ship and the opponent,
        //   remove the opponent from the list of options
        // 4) Calculate time to rotate to facing
        //   - Consider the velocity of the opponent
        // 5) Consider opponent velocity in target acquisition(?)
    }

    this.shouldShoot = function() {
        return true;
    }

    this.engageTarget = function() {
        // We adjust rotation in increments of 0.1rads each time this function is
        // called. The rotation is simply to point us at our target.
        var diffAngle = this.ship.rotation - game.physics.angleBetween(this.ship, target.ship);
        if (diffAngle < Math.PI)
        {
            this.turn(-rotationSpeed);
        }
        else
        {
            this.turn(rotationSpeed);
        }
        this.updateVelocity();
    }

};

