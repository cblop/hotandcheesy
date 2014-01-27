function AIShip(game, sprite, bullets, player) {
	Ship.call(this, game, sprite, bullets);
	this.player = player;
	this.ship.body.immovable = false;
	this.ship.body.bounce.setTo(1, 1);
	this.ship.angle = game.rnd.angle();
    this.target = player;
    var thisref = this;

    // Public config variables
    this.rotationSpeed = config.AIShip.rotationSpeed      || 0.1;   // The rotation speed of an AI ship in radians per frame
    this.setSpeed( config.AIShip.rotationSpeed            || 100);  // The ship forward speed

    // Private config variables
    var firingDistance = config.AIShip.firingDistance     || 800;   // The distance within which a target will be fired at
    var evasionDistance = config.AIShip.evasionDistance   || 200;   // The distance within which this ship will begin to evade its target
    var minWallProximity = config.AIShip.minWallProximity ||        // |
                           config.AIShip.evasionDistance  ||        // | The closest we'll get to a wall before getting scared
                           200;                                     // |
    var firingAngle = config.AIShip.firingAngle           || 0.1;   // The maximum angle of deviation outside of which we will not fire
    // Target prioritisation constants
    var shotNumberWeight = config.AIShip.shotNumberWeight || 0.4;   // The weighting applied to the number of shots an opponent has taken
    var proximityWeight = config.AIShip.proximityWeight   || 10000; // The weighting given to the inverse of an opponent's proximity

    // Initialise our velocity
	this.updateVelocity();

    var modRotation = function(rot)
    {
        // Transform the rotation to be between -pi and pi
        return ((rot + Math.PI) % (2 * Math.PI) - Math.PI);
    };

    this.preloader = function(game) 
    {
        game.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
    };

    this.update = function() 
    {
        this.selectTarget();
        this.decideStrategy();
        this.checkAndFire();
	this.shield.x = this.ship.x;
	this.shield.y = this.ship.y;
    };

    this.distanceToTarget = function()
    {
        return this.game.physics.distanceBetween(this.ship, this.target.ship);
    };

    this.decideStrategy = function()
    {
        if (this.target == null)
        {
            // No targets acquired.. Random movement?
        }
        else if (this.tooCloseToWall())
        {
            this.turnAwayFromWall();
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

    this.facingWall = function()
    {
        
    };

    this.tooCloseToWall = function()
    {
        return ((this.ship.x > config.map.width - minWallProximity)
             || (this.ship.x < minWallProximity)
             || (this.ship.y < minWallProximity)
             || (this.ship.y > config.map.height - minWallProximity));
    };

    // The distance to the wall we're facing
    this.distanceToWall = function()
    {
        if (modRotation(this.ship.rotation) < 0)
        {
            // If we're facing below horizontal
        }
        else
        {
            // If we're facing above horizontal

        }
    };

    this.rotateCounterClockwise = function()
    {
        this.turn(-this.rotationSpeed);
        this.updateVelocity();
    };

    this.rotateClockwise = function()
    {
        this.turn(this.rotationSpeed);
        this.updateVelocity();
    };

    this.turnAwayFromWall = function()
    {
        if (this.ship.x > config.map.width - minWallProximity)
        {
            (modRotation(this.ship.rotation) < 0) ?
                this.rotateCounterClockwise() :
                this.rotateClockwise();
        }
        else if (this.ship.x < minWallProximity)
        {
            (modRotation(this.ship.rotation) > 0) ?
                this.rotateCounterClockwise() :
                this.rotateClockwise();
        }
        else if (this.ship.y < minWallProximity)
        {
            (Math.abs(modRotation(this.ship.rotation)) > Math.PI / 2) ?
                this.rotateCounterClockwise() :
                this.rotateClockwise();
        }
        else if (this.ship.y > config.map.height - minWallProximity)
        {
            (Math.abs(modRotation(this.ship.rotation)) < Math.PI / 2) ?
                this.rotateCounterClockwise() :
                this.rotateClockwise();
        }
    };

    this.engageTarget = function() 
    {
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

    this.selectTarget = function() 
    {
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
            return ((proximityWeight / this.game.physics.distanceBetween(el.ship, thisref.ship))
                 +  (shotNumberWeight * el.numberOfShots));
        };
        if (filteredOpponents && filteredOpponents.length > 0)
        {
            var maxScoreIndex = filteredOpponents
                .map(scoreFunc)
                .reduce(function(prevVal, currVal, ind, arr)
                    { return (arr[ind] > arr[prevVal]) ? ind : prevVal; }
                , 0);
            this.target = filteredOpponents[maxScoreIndex];
        }
        else
        {
            this.target = null;
        }
        // return minIndex;
        // 3) If there are friendly obstacles between this ship and the opponent,
        //   remove the opponent from the list of options
        // 4) Calculate time to rotate to facing
        //   - Consider the velocity of the opponent
        // 5) Consider opponent velocity in target acquisition(?)
    };

    this.getAngleToTarget = function() 
    {
        return modRotation(this.ship.rotation - this.game.physics.angleBetween(this.ship, this.target.ship));
    };

};

