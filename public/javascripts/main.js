var game = new Phaser.Game(config.map.width, config.map.height, Phaser.WEBGL, '', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {
    game.load.image('player', 'assets/ships/playerShip.png');//, 'assets/games/tanks/tanks.json');
    game.load.image('enemy', 'assets/ships/enemyShip.png');
    game.load.image('friend', 'assets/ships/friendlyShip.png');
    game.load.image('bullet', 'assets/ships/bullet20.png');
    game.load.spritesheet('kaboom', 'assets/ships/explosion.png', 100, 100, 25);
   game.load.script('light', 'assets/filters/light.js');
	game.load.image('shield','assets/ships/shield.png');
<<<<<<< HEAD
	game.load.image('stars','assets/ships/stars.png');
    
=======
>>>>>>> 84d399ad0556fe02b92e62022e4dc2d96f320b76
}

var stars;

var player;

var enemies = [];
var friends = [];
var enemyBullets;
var friendBullets;
var explosions;
var cursors;
var bullets;
var circle;
var levelNumber;
var healthbar;
var barback;
var healthBarHeight = 100;
var healthBarRect;

var lightFilter;
//var fireFilter;
var background;
var renderGroup;

var playerCover;
var playerLights = [];
var enemyLights = [];

function dSpace(e){if((e.keyCode==32)&&(!e.shiftKey)){e.preventDefault();}}
window.addEventListener('keydown',dSpace,true);void 0;


function create () {
    // TODO: Health bar is terrible hack. There MUST be a better mechanism for
    // this. (See also the health bar code in the update function).
	levelNumber = 1;
   

	
    game.world.setBounds(0,0,config.map.width,config.map.height);
    stars = game.add.tileSprite(0,0,config.map.width, config.map.height, 'stars');
    stars.fixedToCamera = true;
	cursors = game.input.keyboard.createCursorKeys();

	bullets = [];
    bullets = game.add.group();
	bullets.shipType = "player";
    bullets.createMultiple(config.bullet.playerNumber, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('x', -300);
    bullets.setAll('y', -300);
    bullets.setAll('outOfBoundsKill', true);
	
	enemyBullets = [];
    enemyBullets = game.add.group();
	enemyBullets.shipType = "enemy";
    enemyBullets.createMultiple(config.bullet.enemyNumber, 'bullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('x', -300);
    enemyBullets.setAll('y', -300);
    enemyBullets.setAll('outOfBoundsKill', true);
	
	friendBullets = game.add.group();
	friendBullets.shipType = "friend";
    friendBullets.createMultiple(config.bullet.friendNumber, 'bullet');
    friendBullets.setAll('anchor.x', 0.5);
    friendBullets.setAll('anchor.y', 0.5);
    friendBullets.setAll('x', -300);
    friendBullets.setAll('y', -300);
    friendBullets.setAll('outOfBoundsKill', true);
	player = new PlayerShip(game, config.player.startX, config.player.startY, bullets, cursors); 

    for (var i = 0; i < config.enemy.number; i++)
    {
        //enemies in random positions
		//enemies.push(new EnemyShip(i, game, game.world.randomX, game.world.randomY, enemyBullets, player));
		//Enemies down right hand side
		enemies.push(new EnemyShip(i, game, game.world.width - 50, game.world.randomY, enemyBullets, player));
		
        //enemies[i].ship.filters = [lightFilter];
    }
	
    for (var i = 0; i < config.friend.number; i++) {
       //Friens in random positions
	   //friends.push(new FriendlyShip(i, game, game.world.randomX, game.worldrandomY, friendBullets, player));
       //friends down left hand side
	   friends.push(new FriendlyShip(i, game, 50, game.world.randomY, friendBullets, player));


    }

    for(var i=0; i < config.enemy.number; i++) {
        enemies[i].setOpponents(friends);
        enemies[i].setAllies(enemies);
        enemies[i].pushOpponent(player);
    }
    for(var i=0; i<config.friend.number; i++) {
        friends[i].setOpponents(enemies);
        friends[i].setAllies(friends);
    }
	beginNewGame(levelNumber);

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < config.bullet.explosionNumber; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    explosions.setAll('x', -300);
    explosions.setAll('y', -300);

    game.camera.focusOnXY(0, 0);
	background = game.add.sprite(0, 0);
    background.width = config.map.width;
    background.height = config.map.width;

    if(config.map.lightEffectsOn == "1")
	{
	lightFilter = game.add.filter('Light', config.map.width, config.map.height);
    background.filters = [lightFilter];
	}
	barback = game.add.graphics(0, 0);
    healthbar = game.add.graphics(10, config.map.height - healthBarHeight - 10);
    barback.lineStyle(2, 0xFFFFFF, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
    healthbar.lineStyle(2, 0x00FF00, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
    barback.beginFill(0x000000, 1);
    healthbar.beginFill(0x00FF00, 1);
    barback.drawRect(8, config.map.height - 8, 24, -104);
    healthBarRect = healthbar.drawRect(0, 0, 20, healthBarHeight);
}

function beginNewGame(ln)
{


	for(var k = 0; k < enemies.length; k++)
	{
		if(enemies[k].alive){
		enemies[k].ship.kill();
		enemies[k].alive = false;
		}
	}

    for (var i = 0; i < ln; i++)
    {
	enemies[i].ship.reset(game.world.width - 50, game.world.randomY, config.ship.health);
	enemies[i].alive = true;
	enemies[i].health = config.ship.health;
    }
	   
	for(var k = 0; k < friends.length; k++)
	{
		if(friends[k].alive){
		friends[k].ship.kill();
		friends[k].alive = false;
		}
	}
	
    for (var i = 0; i < config.friend.number; i++) {
	
       //Friens in random positions
	   //friends.push(new FriendlyShip(i, game, game.world.randomX, game.worldrandomY, friendBullets, player));
       //friends down left hand side
	   friends[i].ship.reset(50, game.world.randomY, config.ship.health);
	   friends[i].alive = true;
	   friends[i].health = config.ship.health;
    }
	
	player.ship.reset(config.player.startX, config.player.startY, config.player.health);
	player.alive = true;
	player.health = config.player.health;
}

function update () {
//game over
	if(player.alive == false)
	{
		//alert("You be dead!");
		levelNumber = 1;
		beginNewGame(levelNumber);
	}
	var allEnemiesDead = true;
	for (var i = 0; i < enemies.length; i++)
	{
		if(enemies[i].alive) 
		{
			allEnemiesDead = false;
			break;
		}
	}
	if(allEnemiesDead)
	{
		//alert("WINNAH!");
		beginNewGame(levelNumber*=2);
	}

    var result = false;

    game.physics.collide(enemyBullets, player.ship, bulletHitShip, null, this);
	game.physics.collide(friendBullets, player.ship, bulletHitShip, null, this);
	game.physics.collide(bullets, player.ship, bulletHitShip, null, this);

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemies[i].update();
            //result = game.physics.collide(player.ship, enemies[i].ship);
            game.physics.collide(player.ship, enemies[i].ship, shipsCollide, null, this);
		for(var j=0; j<config.friend.number;j++){
			game.physics.collide(friends[j].ship, enemies[i].ship, shipsCollide, null, this);
		}
		for(var j=0; j<i; j++){
			game.physics.collide(enemies[j].ship, enemies[i].ship, shipsCollide, null, this);
		}
            //game.physics.collide(player.ship, enemies[i].ship, shipsCollide, null, this);
            //game.physics.collide(player.ship, enemies[i].ship, shipsCollide);
            game.physics.collide(bullets, enemies[i].ship, bulletHitShip, null, this);
		game.physics.collide(friendBullets, enemies[i].ship, bulletHitShip, null, this);
		game.physics.collide(enemyBullets, enemies[i].ship, bulletHitShip, null, this);
        }
    }
    for (var i=0; i<config.friend.number; i++){
	if(friends[i].alive){
		friends[i].update();
		for(var j=0; j<i; j++){
			game.physics.collide(friends[j].ship, friends[i].ship, shipsCollide, null, this);
		}
		game.physics.collide(player.ship, friends[i].ship, shipsCollide, null, this);
		game.physics.collide(bullets, friends[i].ship, bulletHitShip, null, this);
		game.physics.collide(friendBullets, friends[i].ship, bulletHitShip, null, this);
		game.physics.collide(enemyBullets, friends[i].ship, bulletHitShip, null, this);
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

/*
    barback.drawRect(8, config.map.height - 8, 24, -104);
    healthbar.drawRect(10, config.map.height - 10, 20, -100 + (100 * (player.health / config.player.health)));
*/

    //console.log(bullets.getAt(0).x);
    //lightFilter.update(bullets.getAt(0).x, bullets.getAt(0).y);

	if(config.map.lightEffectsOn == "1")
	{
		lightFilter.eshot0 = {x: enemyBullets.getAt(0).x, y: config.map.height - enemyBullets.getAt(0).y };
        lightFilter.eshot1 = {x: enemyBullets.getAt(1).x, y: config.map.height - bullets.getAt(1).y };
        lightFilter.eshot2 = {x: enemyBullets.getAt(2).x, y: config.map.height - enemyBullets.getAt(2).y };
        lightFilter.eshot3 = {x: enemyBullets.getAt(3).x, y: config.map.height - enemyBullets.getAt(3).y };

        lightFilter.fshot0 = {x: friendBullets.getAt(0).x, y: config.map.height - friendBullets.getAt(0).y };
        lightFilter.fshot1 = {x: friendBullets.getAt(1).x, y: config.map.height - friendBullets.getAt(1).y };
        lightFilter.fshot2 = {x: friendBullets.getAt(2).x, y: config.map.height - friendBullets.getAt(2).y };
        lightFilter.fshot3 = {x: friendBullets.getAt(3).x, y: config.map.height - friendBullets.getAt(3).y };

 		lightFilter.expl0 = {x: explosions.getAt(0).x, y: config.map.height - explosions.getAt(0).y };
        lightFilter.expl1 = {x: explosions.getAt(1).x, y: config.map.height - explosions.getAt(1).y };
        lightFilter.expl2 = {x: explosions.getAt(2).x, y: config.map.height - explosions.getAt(2).y };
        lightFilter.expl3 = {x: explosions.getAt(3).x, y: config.map.height - explosions.getAt(3).y };
        lightFilter.pshot0 = {x: bullets.getAt(0).x, y: config.map.height - bullets.getAt(0).y };
        lightFilter.pshot1 = {x: bullets.getAt(1).x, y: config.map.height - bullets.getAt(1).y };

 for (var i = 0;i < 4; i++) {
            explosionAnimation = explosions.getAt(i);
            if (explosionAnimation.animations.getAnimation('kaboom').isFinished) {
                explosionAnimation.x = -300;
                explosionAnimation.y = -300;
                //explosionAnimation.y = config.map.height;
            }
        }

        lightFilter.diameter = config.shader.diameter;
		lightFilter.update();
	}

    healthbar.y = config.map.height - healthBarHeight - 10 + 100 * (1 - (player.health / config.player.health));
    healthbar.scale.y = (player.health / config.player.health);

    // This was extant after a merge. Resolving conflict by commenting. This is
    // because I *think* this code is old and incorrect. (Matt K).
    //barback.drawRect(8, config.map.height - 8, 24, -104);
    //healthbar.drawRect(10, config.map.height - 10, 20, -100 + (100 * (player.health / config.player.health)));

//    fireFilter.update();
    stars.tilePosition.x = -game.camera.x;
    stars.tilePosition.y = -game.camera.y;

}

function shipsCollide (shipA, shipB) {
    //console.log("collide");

    var shipA = identifyShip(shipA.shipType, shipA.index);
    var shipB = identifyShip(shipB.shipType, shipB.index);
	var destroyedA = shipA.damage(collideDamage(shipA.ship.shipType, shipB.ship.shipType), game.physics.angleBetween(shipA.ship, shipB.ship));
	var destroyedB = shipB.damage(collideDamage(shipB.ship.shipType, shipA.ship.shipType), game.physics.angleBetween(shipB.ship, shipA.ship));

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
	bullet.x = -300;
    //bullet.y = config.map.height;
    bullet.y = -300;
	bullet.kill();
	ship = identifyShip(ship.shipType, ship.index);
	var dam = bulletDamage(ship.ship.shipType, bullet.group.shipType);
	var destroyed = ship.damage(dam, game.physics.angleBetween(ship.ship, bullet));
	//console.log(destroyed);
	if(destroyed){
		var explosionAnimation = explosions.getFirstDead();
		explosionAnimation.reset(ship.ship.x, ship.ship.y);
		explosionAnimation.play('kaboom', 30, false, true);
	}
}


function render () {

    //game.debug.renderText('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);

}

function bulletDamage(damaged, damager){
	if(damaged === "player"){
		if(damager === "player"){
			return config.fire.playerShootsPlayer;
		}else if(damager === "friend"){
			return config.fire.friendShootsPlayer;
		}else if(damager === "enemy"){
			return config.fire.enemyShootsPlayer;
		}else{
			console.error('spelling mistake');
		}
	}else if(damaged === "friend"){
                if(damager === "player"){
                        return config.fire.playerShootsFriend;
                }else if(damager === "friend"){
                        return config.fire.friendShootsFriend;
                }else if(damager === "enemy"){
                        return config.fire.enemyShootsFriend;
                }else{
                        console.error('spelling mistake');
                }

	}else if(damaged === "enemy"){
                if(damager === "player"){
                        return config.fire.playerShootsEnemy;
                }else if(damager === "friend"){
                        return config.fire.friendShootsEnemy;
                }else if(damager === "enemy"){
                        return config.fire.enemyShootsEnemy;
                }else{
                        console.error('spelling mistake');
                }

	}else{
		console.error("Spelling mistake");
	}	
}

function collideDamage(damaged, damager){
        if(damaged === "player"){
                if(damager === "player"){
                        return config.collide.playerHitsPlayer;
                }else if(damager === "friend"){
                        return config.collide.friendHitsPlayer;
                }else if(damager === "enemy"){
                        return config.collide.enemyHitsPlayer;
                }else{
                        console.error('spelling mistake');
                }
        }else if(damaged === "friend"){
                if(damager === "player"){
                        return config.collide.playerHitsFriend;
                }else if(damager === "friend"){
                        return config.collide.friendHitsFriend;
                }else if(damager === "enemy"){
                        return config.collide.enemyHitsFriend;
                }else{
                        console.error('spelling mistake');
                }

        }else if(damaged === "enemy"){
                if(damager === "player"){
                        return config.collide.playerHitsEnemy;
                }else if(damager === "friend"){
                        return config.collide.friendHitsEnemy;
                }else if(damager === "enemy"){
                        return config.collide.enemyHitsEnemy;
                }else{
                        console.error('spelling mistake');
                }

        }else{
                console.error("Spelling mistake");
        }
}
