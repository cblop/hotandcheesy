Ship = function(game, x, y, bullets) {
    this.game = game;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;
    this.ship = game.add.sprite(x, y, 'enemy', 'tank1');

    this.ship.anchor.setTo(0.5, 0.5);

    //this.ship.name = index.toString();
    this.ship.body.immovable = true;
    this.ship.body.collideWorldBounds = true;
    this.ship.body.bounce.setTo(1, 1);

    this.ship.angle = game.rnd.angle();

    game.physics.velocityFromRotation(this.ship.rotation, 100, this.ship.body.velocity);

};

Ship.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;

        this.ship.kill();

        return true;
    }

    return false;

}

Ship.prototype.update = function() {
    // Player and enemy tanks do totally different things

};
