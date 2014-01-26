function AIShip(game, sprite, bullets, player) {
	Ship.call(this, game, sprite, bullets);
	this.player = player;
	this.ship.body.immovable = false;
	this.ship.body.bounce.setTo(1, 1);
	this.ship.angle = game.rnd.angle();
    this.rotationSpeed = 0.1; // rad/update
    this.setSpeed(100);
	this.updateVelocity();
    this.target = player;
    var thisref = this;

    // Private variables
    var firingDistance = config.AIShip.firingDistance     || 800;   // The distance within which a target will be fired at
    var evasionDistance = config.AIShip.evasionDistance   || 200;   // The distance within which this ship will begin to evade its target
    var firingAngle = config.AIShip.firingAngle           || 0.1;   // The maximum angle of deviation outside of which we will not fire
    // Target prioritisation constants
    var shotNumberWeight = config.AIShip.shotNumberWeight || 1;     // The weighting applied to the number of shots an opponent has taken
    var proximityWeight = config.AIShip.proximityWeight   || 1000;  // The weighting given to the inverse of an opponent's proximity

    this.preloader = function(game) {
        game.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
    };

    this.update = function() 
    {
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
        if (this.target == null)
        {
            alert("FUCKING DILDOS!");
        }
        else if (this.distanceToTarget() < evasionDistance)
        {
            this.evadeTarget();
        }
        else
        {
            this.engageTarget();
        }
    };

    this.engageTarget = function() {
        // Turn toward and follow our target
        this.turn((this.getAngleToTarget() < 0) ? this.rotationSpeed : -this.rotationSpeed);
        this.updateVelocity();
    };

    this.evadeTarget = function()
    {
        // Turn away from and evade our target
        this.turn((this.getAngleToTarget() > 0) ? this.rotationSpeed : -this.rotationSpeed);
        this.updateVelocity();
    };

    this.checkAndFire = function()
    {
        // Check if we're within firing range and facing our target, if we are,
        // shoot.
        if ((this.target != null) &&
            (this.distanceToTarget() < firingDistance) && 
            (Math.abs(this.game.physics.angleBetween(this.ship, this.target.ship) - this.ship.rotation) < firingAngle))
        {
            this.fire();
        }
    };

    this.prioritiseTargets = function() {
        // Gets rid of any invalid opponents. We don't save this filtered array
        // because our logic for filtering will probably change later
        var filterFunc = function(el, index, arr)
        {
            return el.alive;
        };
        var filteredOpponents = this.opponents.filter(filterFunc);
        // Calculates the score for each possible opponent. The opponent with
        // the highest score will be selected as the target.
        var scoreFunc = function(el, index, arr)
        {
            return (proximityWeight / this.game.physics.distanceBetween(el.ship, thisref.ship)
                 + (shotNumberWeight * el.ship.numberOfShots));
        };
        if (filteredOpponents && filteredOpponents.length > 0)
        {
            var maxScoreIndex = this.opponents
                .map(scoreFunc)
                .reduce(function(prevVal, currVal, ind, arr)
                    { return (arr[currVal] > arr[prevVal]) ? currVal : prevVal; }
                , 0);
            this.target = this.opponents[maxScoreIndex];
        }
        else
        {
            alert("DILLLLLLDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOS");
            this.target = null;
        }
        // return minIndex;
        // 3) If there are friendly obstacles between this ship and the opponent,
        //   remove the opponent from the list of options
        // 4) Calculate time to rotate to facing
        //   - Consider the velocity of the opponent
        // 5) Consider opponent velocity in target acquisition(?)
    };

    this.getAngleToTarget = function() {
        var angleBetween = this.ship.rotation - this.game.physics.angleBetween(this.ship, this.target.ship);
        var angleBetween = ((angleBetween + Math.PI) % (2*Math.PI) - Math.PI);
        return angleBetween;
    };

};

