var game = new Phaser.Game(config.map.width, config.map.height, Phaser.WEBGL, '', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.image('player', 'assets/ships/playerShip.png');//, 'assets/games/tanks/tanks.json');
    game.load.image('enemy', 'assets/ships/enemyShip.png');
    game.load.image('friend', 'assets/ships/friendlyShip.png');
    game.load.image('bullet', 'assets/games/tanks/bullet.png');
    game.load.image('earth', 'assets/games/tanks/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/games/tanks/explosion.png', 64, 64, 23);
    game.load.script('light', 'assets/filters/light.js');
    game.load.script('fire', 'assets/filters/Fire.js');
    
}

var land;

var player;

var enemies;
var enemyBullets;
var explosions;
var cursors;
var bullets;
var circle;

var healthbar;
var barback;

var lightFilter;
var fireFilter;
var background;

function dSpace(e){if((e.keyCode==32)&&(!e.shiftKey)){e.preventDefault();}}
window.addEventListener('keydown',dSpace,true);void 0;


function create () {

    //  Resize our game world to be a 2000 x 2000 square

    barback = game.add.graphics(0, 0);
    healthbar = game.add.graphics(0, 0);
    barback.lineStyle(2, 0xFFFFFF, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
    healthbar.lineStyle(2, 0x00FF00, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
    barback.beginFill(0x000000, 1);
    healthbar.beginFill(0x00FF00, 1);
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

    background = game.add.sprite(0, 0);
    background.width = config.map.width;
    background.height = config.map.width;
    fireFilter = game.add.filter('Fire', config.map.width, config.map.height);
    lightFilter = game.add.filter('Light', config.map.width, config.map.height);
    fireFilter.alpha = 0.0;
    lightFilter.alpha = 0.0;
    background.filters = [lightFilter];


}

function update () {

    var result = false;

    game.physics.collide(enemyBullets, player.ship, bulletHitPlayer, null, this);

    for (var i = 0; i < config.enemy.number; i++)
    {
        if (enemies[i].alive)
        {
            enemies[i].update();
            //result = game.physics.collide(player.ship, enemies[i].ship);
            game.physics.collide(player.ship, enemies[i].ship, shipsCollide, null, this);

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

    barback.drawRect(8, config.map.height - 8, 24, -104);
    healthbar.drawRect(10, config.map.height - 10, 20, -100 + (100 * (player.health / config.player.health)));

    /*
    for (var i = 0; i < config.bullet.playerNumber; i++) {


    }
    */

    //console.log(bullets.getAt(0).x);
    //lightFilter.update(bullets.getAt(0).x, bullets.getAt(0).y);
    lightFilter.xpos = bullets.getAt(0).x;
    lightFilter.ypos = config.map.height - bullets.getAt(0).y;
    lightFilter.update();


}

function shipsCollide (shipA, shipB) {
    console.log("collide");

    var destroyedA = player.damage(1);
    var destroyedB = enemies[shipB.name].damage(1);

    if (destroyedA)
    {
        var explosionAnimation = explosions.getFirstDead();
        explosionAnimation.reset(shipA.x, shipA.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }
    else if (destroyedB)
    {
        var explosionAnimation = explosions.getFirstDead();
        explosionAnimation.reset(shipB.x, shipB.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }
}

function bulletHitPlayer (ship, bullet) {

    bullet.kill();

    var destroyed = player.damage(2);
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

    var destroyed = enemies[enemy.name].damage(4);

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
