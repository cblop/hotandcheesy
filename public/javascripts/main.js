var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
    game.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
    game.load.image('bullet', 'assets/games/tanks/bullet.png');
    game.load.image('earth', 'assets/games/tanks/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/games/tanks/explosion.png', 64, 64, 23);
    
}

var land;

var player;

var enemies;
var enemyBullets;
var explosions;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;

function create () {

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0,0,800,600);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

	//Generate player
	player = 
    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.createMultiple(100, 'bullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);

    //  Create some baddies to waste :)
    enemies = [];

    for (var i = 0; i < 20; i++)
    {
        enemies.push(new EnemyShip(game, game.world.randomX, game.world.randomY, enemyBullets, tank));
    }

    //  Our bullet group
    bullets = game.add.group();
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

}

function update () {

    game.physics.collide(enemyBullets, tank, bulletHitPlayer, null, this);

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemies[i].update();
            game.physics.collide(tank, enemies[i].tank);
            game.physics.collide(bullets, enemies[i].tank, bulletHitEnemy, null, this);
        }
    }

    if (cursors.left.isDown)
    {
        player.turn(-4);
    }
    else if (cursors.right.isDown)
    {
        player.turn(4);
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        this.currentSpeed = 304;
    }

	player.update();

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        player.fire();
    }

}

function bulletHitPlayer (tank, bullet) {

    bullet.kill();

}

function bulletHitEnemy (tank, bullet) {

	bullet.kill();

    var destroyed = enemies[tank.name].damage();

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstDead();
        explosionAnimation.reset(tank.x, tank.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }

}

function render () {

    // game.debug.renderText('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);

}
