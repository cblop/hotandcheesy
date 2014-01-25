function EnemyShip(game, x, y, bullets, player) {
	Ship.call(this, game, x, y, bullets);
	this.player = player;

    this.update = function() {

        // Enemy AI goes here

        if (this.game.physics.distanceBetween(this.ship, this.player) < 300)
        {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
            {
                this.nextFire = this.game.time.now + this.fireRate;

                var bullet = this.bullets.getFirstDead();

                //bullet.reset(this.turret.x, this.turret.y);

                bullet.rotation = this.game.physics.moveToObject(bullet, this.player, 500);
            }
        }

    }

    this.acquireTargets = function(newOpponents) {
        this.opponents = opponents; 
    }

    this.prioritiseTargets = function() {
        // 1) Check proximity
        //   - This is an analog for how threatening the opponent is
        var minIndex = -1;
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

    this.adjustMovement = function() {
        // We adjust rotation in increments of 0.1rads each time this function is
        // called. The rotation is simply to point us at our target.
        var rotationSpeed = 0.1; // rad/update
        var forwardSpeed = 100;
        var diffAngle = this.ship.rotation - game.physics.angleBetween(this.ship, target.ship);
        if (diffAngle < Math.PI)
        {
            this.ship.rotation -= rotationSpeed;
        }
        else
        {
            this.ship.rotation += rotationSpeed;
        }
        game.physics.velocityFromRotation(this.ship.rotation, forwardSpeed, this.ship.body.velocity);
    }
}

