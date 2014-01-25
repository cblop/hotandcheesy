function AIShip(game, sprite, bullets, player) {
	Ship.call(this, game, sprite, bullets);
	this.player = player;
	this.ship.body.immovable = false;
	this.ship.body.bounce.setTo(1, 1);
	this.ship.angle = game.rnd.angle();
    this.rotationSpeed = 0.1; // rad/update
    this.setSpeed(100);
    this.opponents = [player];
	this.updateVelocity();
    this.target = player;

    // Private variables
    var firingDistance = 500; // Number.POSITIVE_INFINITY
    var evasionDistance = 150;
    var firingAngle = 0.1; // Radians

    this.preloader = function(game) {
        game.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
    };

    this.update = function() {

        this.prioritiseTargets();
        this.decideStrategy();
        this.checkAndFire();

    };

    this.distanceToTarget = function()
    {
        return this.game.physics.distanceBetween(this.ship, this.target.ship);
    };

    this.decideStrategy = function()
    {
        if (this.distanceToTarget() < evasionDistance)
        {
            this.evadeTarget();
        }
        else
        {
            this.engageTarget();
        }
    };

    this.evadeTarget = function()
    {
        var angleBetween = this.getAngleToTarget();
        if (angleBetween < 0) {
            this.turn(-this.rotationSpeed);
        }
        else
        {
            this.turn(this.rotationSpeed);
        }
//        this.turn(-0.05*angleBetween);
        this.updateVelocity();
    };

    this.checkAndFire = function()
    {
        // Check if we're within firing range and facing our target, if we are,
        // shoot.
        if ((this.distanceToTarget() < firingDistance) && 
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
    };

    this.getAngleToTarget = function() {
        var angleBetween = this.ship.rotation - this.game.physics.angleBetween(this.ship, this.player.ship);
        var angleBetween = ((angleBetween + Math.PI) % (2*Math.PI) - Math.PI);
        return angleBetween;
    };

    this.engageTarget = function() {
        // We adjust rotation in increments of 0.1rads each time this function is
        // called. The rotation is simply to point us at our target.
        var angleBetween = this.getAngleToTarget();
        if (angleBetween < 0) {
            this.turn(this.rotationSpeed);
        }
        else
        {
            this.turn(-this.rotationSpeed);
        }
        this.updateVelocity();
    };

};

