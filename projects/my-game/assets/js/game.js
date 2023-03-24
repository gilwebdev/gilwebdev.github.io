/* Game.js by https://gilwebdev.github.io/ */

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var player;
var playerSsj;
var stars;
var shields;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var playerProtected = false;
var scoreText;
var timeShield;
var flashs;
var playerFast = false;

var music_1;
var music_2;

var game = new Phaser.Game(config);

function preload (){
  this.load.image('sky', 'assets/imgs/sky.png');
  this.load.image('ground', 'assets/imgs/platform.png');
  this.load.image('ground-2', 'assets/imgs/platform-2.png');
  this.load.image('star', 'assets/imgs/star.png');
  this.load.image('bomb', 'assets/imgs/bomb.png');
  this.load.image('arrows', 'assets/imgs/arrows.png');
  this.load.image('shield', 'assets/imgs/shield.png');
  this.load.image('flash', 'assets/imgs/flash.png');
  this.load.image('shoe', 'assets/imgs/shoe.png');
  this.load.audio('sound-1', ['assets/audio/sound-1.mp3', 'assets/audio/sound-1.ogg']);
  this.load.audio('sound-2', ['assets/audio/sound-2.mp3', 'assets/audio/sound-2.ogg']);
  this.load.audio('shield-on', ['assets/audio/shield-on.mp3', 'assets/audio/shield-on.ogg']);
  this.load.spritesheet('dude', 'assets/imgs/dude-boy.png', { frameWidth: 32, frameHeight: 42 });
}

function create (){

  // A simple background for our game
  this.add.image(400, 300, 'sky');

  // The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  // Here we create the ground.
  // Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(400, 583, 'ground-2').setScale(1.1).refreshBody();

  // Now let's create some ledges
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
  
  // Arrows
  var arrows;
  var myTimer = setInterval(function(){
    arrows = this.platforms.create(720, 490, 'arrows');
    setTimeout(function(){ arrows.destroy(); },500);
  }, 1000);
  setTimeout(function(){ clearInterval(myTimer); }, 2000);

  // The player and its settings
  player = this.physics.add.sprite(100, 450, 'dude');
  var radius = player.width / 2;
  console.log(radius)
  player.body.setCircle(radius, 0, 10);

  // Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0);
  player.setCollideWorldBounds(true);

  // Our player animations, turning, walking left and walking right.
  this.anims.create({
  	key: 'left',
  	frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
  	frameRate: 10,
  	repeat: -1
  });

  this.anims.create({
  	key: 'turn',
  	frames: [ { key: 'dude', frame: 4 } ],
  	frameRate: 20
  });

  this.anims.create({
  	key: 'right',
  	frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
  	frameRate: 10,
  	repeat: -1
  });

  // Input Events
  cursors = this.input.keyboard.createCursorKeys();

  // Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  stars = this.physics.add.group({
  	key: 'star',
  	repeat: 11,
  	setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {
    // Give each star a slightly different bounce
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  bombs = this.physics.add.group();
  shields = this.physics.add.group();
  flashs = this.physics.add.group();

  // The score
  scoreText = this.add.text(16, 16, 'BUGS: 0', {
    fontSize: '20px',
    fontWeight:'bold',
    stroke: '#282828',
    strokeThickness: 5,
    fill: '#fff'
  });

  // The time shield
  timeShield = this.add.text(370, 16, '00:00', {
    fontSize: '20px',
    fontWeight:'bold',
    stroke: '#8e0000',
    strokeThickness: 5,
    fill: '#fff'
  });
  timeShield.setText("");

  // Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(shields, platforms);
  this.physics.add.collider(flashs, platforms);

  // Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.overlap(player, shields, collectShield, null, this);
  this.physics.add.overlap(player, flashs, collectFlash, null, this);

  this.physics.add.overlap(player, bombs, hitBomb, null, this);
}

function update (){
	if (gameOver){
		return;
	}

	if (cursors.left.isDown){

    if(playerFast){
		  player.setVelocityX(-400);
    }else{ player.setVelocityX(-280); }

		player.anims.play('left', true);
	}
	else if (cursors.right.isDown){

    if(playerFast){
      player.setVelocityX(400);
    }else{ player.setVelocityX(280); }

		player.anims.play('right', true);
	}
	else{
		player.setVelocityX(0);

		player.anims.play('turn');
	}

	if (cursors.up.isDown && player.body.touching.down){

    if(playerFast){
      player.setVelocityY(-450);
    }else{ player.setVelocityY(-333); }

	}

  if (cursors.down.isDown){
    player.setVelocityY(+400);
    player.anims.play('turn');
  }

}

function collectStar (player, star){

  this.sound.play('sound-1');

	star.disableBody(true, true);

  // Add and update the score
  score += 1;
  scoreText.setText('BUGS: ' + score);

  if (stars.countActive(true) === 0){
    // A new batch of stars to collect
    stars.children.iterate(function (child) {

    	child.enableBody(true, child.x, 0, true, true);

    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

    if(score%24 === 0){ addShield(); } if(score >= 96){ addFlash(); }

  }
}

function hitBomb (player, bomb){

  if(!playerProtected){

    this.sound.play('sound-2');

    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;

    registraScore(score);

    setTimeout(function(){
      location.reload();
    }, 2000);

  }

}

function addShield(){
  
  var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  var shield = shields.create(x, 0, 'shield');
  shield.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

}

function collectShield(player, shield){

  addTimeShield();

  playerProtected = true;
  console.log("Proteção Ativada.");

  this.sound.play('shield-on');
  shield.disableBody(true, true);

  player.alpha = 0.5;

  timeShield.setText('00:05');

  let self = this;
  setTimeout(function(){
    player.alpha = 1;
    playerProtected = false;
  }, 6000);

}

function addTimeShield(){

  var seg = 4;
  var interval = setInterval(function(){
    timeShield.setText('00:0'+seg);
    if(seg === 0){
      timeShield.setText('00:00');
    }else if(seg === -1){
      timeShield.setText("");
      clearInterval(interval);
    }
    seg--;
  }, 1000);

}

function addFlash(){
  var x = (player.x < 200) ? Phaser.Math.Between(200, 800) : Phaser.Math.Between(0, 200);
  var flash = flashs.create(x, 0, 'flash');
  flash.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
}

function collectFlash(player, flash){

  var shoe = this.add.image(755, 25, 'shoe');

  playerFast = true;
  console.log("Flash Ativado.");

  flash.disableBody(true, true);

  let self = this;
  setTimeout(function(){
    shoe.destroy();
    playerFast = false;
  }, 6000);

}
