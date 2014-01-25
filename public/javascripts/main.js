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
var cursors;
var bullets;

function create () {

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0,0,800,600);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;


     //  Our bullet group
     bullets = game.add.group();
     bullets.createMultiple(30, 'bullet');
     bullets.setAll('anchor.x', 0.5);
     bullets.setAll('anchor.y', 0.5);
     bullets.setAll('outOfBoundsKill', true);

	//Generate player
	player = new PlayerShip(game, 400,300, bullets); 
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
        enemies.push(new EnemyShip(game, game.world.randomX, game.world.randomY, enemyBullets, player));
    }

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    game.camera.follow(player);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

}

function update () {

    game.physics.collide(enemyBullets, player, bulletHitPlayer, null, this);

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemies[i].update();
            game.physics.collide(player, enemies[i].player);
            game.physics.collide(bullets, enemies[i].player, bulletHitEnemy, null, this);
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
        	player.currentSpeed = 304;
	}
    //  Our bullet group
	player.update();

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        player.fire(bullets);
    }

}

function bulletHitPlayer (player, bullet) {

    bullet.kill();

}

function bulletHitEnemy (player, bullet) {

	bullet.kill();

    var destroyed = enemies[player.name].damage();

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstDead();
        explosionAnimation.reset(player.x, player.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }

}

function render () {

    // game.debug.renderText('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);

}
