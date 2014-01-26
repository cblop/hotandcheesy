var game = new Phaser.Game(config.map.width, config.map.height, Phaser.WEBGL, '', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.image('player', 'assets/ships/playerShip.png');//, 'assets/games/tanks/tanks.json');
    game.load.image('enemy', 'assets/ships/enemyShip.png');
    game.load.image('friend', 'assets/ships/friendlyShip.png');
    game.load.image('bullet', 'assets/games/tanks/bullet.png');
    game.load.image('earth', 'assets/games/tanks/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/games/tanks/explosion.png', 64, 64, 23);
//    game.load.script('light', 'assets/filters/light.js');
//    game.load.script('fire', 'assets/filters/Fire.js');
    
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
var healthBarHeight = 100;
var healthBarRect;

var lightFilter;
//var fireFilter;
var background;

function dSpace(e){if((e.keyCode==32)&&(!e.shiftKey)){e.preventDefault();}}
window.addEventListener('keydown',dSpace,true);void 0;


function create () {

    // TODO: Health bar is terrible hack. There MUST be a better mechanism for
    // this. (See also the health bar code in the update function).
    barback = game.add.graphics(0, 0);
    healthbar = game.add.graphics(10, config.map.height - healthBarHeight - 10);
    barback.lineStyle(2, 0xFFFFFF, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
    healthbar.lineStyle(2, 0x00FF00, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
    barback.beginFill(0x000000, 1);
    healthbar.beginFill(0x00FF00, 1);
    game.world.setBounds(0,0,config.map.width,config.map.height);
    barback.drawRect(8, config.map.height - 8, 24, -104);
    healthBarRect = healthbar.drawRect(0, 0, 20, healthBarHeight);

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
	
    // Create some friends to help :)
    friendBullets = game.add.group();
    friendBullets.createMultiple(config.bullet.friendNumber, 'bullet');
    friendBullets.setAll('anchor.x', 0.5);
    friendBullets.setAll('anchor.y', 0.5);
    friendBullets.setAll('outOfBoundsKill', true);

    friends = [];
    for (var i = 0; i < config.friend.number; i++){
	friends.push(new FriendlyShip(i, game, game.world.randomX, game.worldrandomY, friendBullets, player));
    }


    for(var i=0; i<config.enemy.number; i++){
	enemies[i].setOpponents(friends);
	enemies[i].setAllies(enemies);
    }
    for(var i=0; i<config.friend.number; i++){
	friends[i].setOpponents(enemies);
	friends[i].setAllies(friends);
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
//    fireFilter = game.add.filter('Fire', config.map.width, config.map.height);
//    fireFilter.alpha = 0.0;
//    background.filters = [fireFilter];


}

function update () {

    var result = false;

    game.physics.collide(enemyBullets, player.ship, bulletHitShip, null, this);

    for (var i = 0; i < config.enemy.number; i++)
    {
        if (enemies[i].alive)
        {
            enemies[i].update();
            //result = game.physics.collide(player.ship, enemies[i].ship);
            game.physics.collide(player.ship, enemies[i].ship, shipsCollide, null, this);

            //game.physics.collide(player.ship, enemies[i].ship, shipsCollide, null, this);
            //game.physics.collide(player.ship, enemies[i].ship, shipsCollide);
            game.physics.collide(bullets, enemies[i].ship, bulletHitShip, null, this);
        }
    }
    for (var i=0; i<config.friend.number; i++){
	if(friends[i].alive){
		friends[i].update();
		game.physics.collide(player.ship, friends[i].ship, shipsCollide, null, this);
		game.physics.collide(bullets, friends[i].ship, bulletHitShip, null, this);
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

    healthbar.y = config.map.height - healthBarHeight - 10 + 100 * (1 - (player.health / config.player.health));
    healthbar.scale.y = (player.health / config.player.health);
    // This was extant after a merge. Resolving conflict by commenting. This is
    // because I *think* this code is old and incorrect. (Matt K).
    //barback.drawRect(8, config.map.height - 8, 24, -104);
    //healthbar.drawRect(10, config.map.height - 10, 20, -100 + (100 * (player.health / config.player.health)));

//    fireFilter.update();

}

function shipsCollide (shipA, shipB) {
    console.log("collide");

    var shipA = identifyShip(shipA.shipType, shipA.index);
    var shipB = identifyShip(shipB.shipType, shipB.index);
	var destroyedA = shipA.damage(1);
	var destroyedB = shipB.damage(1);

    if (destroyedA)
    {
        var explosionAnimation = explosions.getFirstDead();
        explosionAnimation.reset(shipA.ship.x, shipA.ship.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }
    else if (destroyedB)
    {
        var explosionAnimation = explosions.getFirstDead();
        explosionAnimation.reset(shipB.ship.x, shipB.ship.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }
}

function identifyShip(shipType, index) {
	if (shipType === "player") {
		return player;
	}else if (shipType === "friend") {
		return friends[index];
	}else if (shipType === "enemy") {
		return enemies[index];
	}else{
		console.error('spelling mistake');
	}
}

function bulletHitShip (ship, bullet) {
	bullet.kill();
	ship = identifyShip(ship.shipType, ship.index);
	var dam;
         if (ship.ship.shipType === "player") {
                 dam = 1;
         }else if (ship.ship.shipType === "friend") {
                 dam = 1;
         }else if (ship.ship.shipType === "enemy") {
                 dam = 1;
         }else{
                 console.error('spelling mistake');
         }
	var destroyed = ship.damage(dam);
	console.log(destroyed);
	if(destroyed){
		var explosionAnimation = explosions.getFirstDead();
		explosionAnimation.reset(ship.ship.x, ship.ship.y);
		explosionAnimation.play('kaboom', 30, false, true);
	}
}


function render () {

    //game.debug.renderText('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);

}
