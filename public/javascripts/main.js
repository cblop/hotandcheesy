var game = new Phaser.Game(config.map.width, config.map.height, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.image('player', 'assets/ships/playerShip.png');//, 'assets/games/tanks/tanks.json');
    game.load.image('enemy', 'assets/ships/enemyShip.png');
    game.load.image('friend', 'assets/ships/friendlyShip.png');
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
var circle;

function dSpace(e){if((e.keyCode==32)&&(!e.shiftKey)){e.preventDefault();}}
window.addEventListener('keydown',dSpace,true);void 0;

function create () {

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0,0,config.map.width,config.map.height);


    //  Our tiled scrolling background
    //land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    //land.fixedToCamera = true;


     //  Our bullet group
     bullets = game.add.group();
     bullets.createMultiple(config.bullet.playerNumber, 'bullet');
     bullets.setAll('anchor.x', 0.5);
     bullets.setAll('anchor.y', 0.5);
     bullets.setAll('outOfBoundsKill', true);

    cursors = game.input.keyboard.createCursorKeys();
	//Generate player
	player = new PlayerShip(game, config.player.startX, config.player.startY, bullets, cursors); 

    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.createMultiple(config.bullet.enemyNumber, 'bullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);

    //  Create some baddies to waste :)
    enemies = [];

    for (var i = 0; i < config.enemy.number; i++)
    {
        enemies.push(new EnemyShip(i, game, game.world.randomX, game.world.randomY, enemyBullets, player));
    }

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < config.bullet.explosionNumber; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    circle = new Phaser.Circle(game.world.centerX, 100,64);

}

function update () {

    var result = false;

    game.physics.collide(enemyBullets, player.ship, bulletHitPlayer, null, this);

    for (var i = 0; i < config.enemy.number; i++)
    {
        if (enemies[i].alive)
        {
            enemies[i].update();
            result = game.physics.collide(player.ship, enemies[i].ship);

            //game.physics.collide(player.ship, enemies[i].ship, shipsCollide, null, this);
            //game.physics.collide(player.ship, enemies[i].ship, shipsCollide);
            game.physics.collide(bullets, enemies[i].ship, bulletHitEnemy, null, this);
        }
    }

	player.update(cursors);

    //land.tilePosition.x = -game.camera.x;
    //land.tilePosition.y = -game.camera.y;

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && player.alive)
    {
        //  Boom!
        player.fire();
    }
    if (result) {
        player.setSpeed(0);
        player.updateVelocity();
    }

}

function bulletHitPlayer (ship, bullet) {

    bullet.kill();

    var destroyed = player.damage();
    console.log(destroyed);

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstDead();
        explosionAnimation.reset(ship.x, ship.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }

}

function bulletHitEnemy (enemy, bullet) {

	bullet.kill();

    var destroyed = enemies[enemy.name].damage();

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstDead();
        explosionAnimation.reset(enemy.x, enemy.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }

}

function render () {

    //game.debug.renderText('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);

}
