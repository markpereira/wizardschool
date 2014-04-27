var wizGame = {
    imgPath: 'images/'
};

$(document).ready(function() {
    var game = new Phaser.Game(900, 600, Phaser.AUTO, 'game_canvas', { preload: preload, create: create, update: update });
    var lastName;

    function preload() {
    
        
      // here we run an if statement to choose which sprite to load
        
        game.load.spritesheet('dude', wizGame.imgPath + 'eriksprite.png', 32, 60);
        var playerName = 'Erik';
        lastName = 'froese';
       

        game.add.text(200, 280, 'Loading...', { font: '20px "Press Start 2P"', fill: '#fff' });
        game.add.text(200, 360, 'Collect the seven butterflies', { font: '20px "Press Start 2P"', fill: '#fff' });
        game.add.text(200, 380, 'and take them to the house', { font: '20px "Press Start 2P"', fill: '#fff' });
        game.add.text(200, 400, 'to learn more about ' + playerName, { font: '20px "Press Start 2P"', fill: '#fff' });
       
    // Now we start to create the other assets
        game.load.image('forest', wizGame.imgPath + 'forestbg.png');
        game.load.image('treetall', wizGame.imgPath + 'tree2.png', 900, 1462);                    
        game.load.image('treestem', wizGame.imgPath + 'tree-stem.png');

        game.load.spritesheet('powerup', wizGame.imgPath + 'powerup.png', 80, 74);


        //here we load two more assets for the other 'stars'
        game.load.image('ground', wizGame.imgPath + 'platform.png');
        game.load.image('tree_tile', wizGame.imgPath + 'tree_tile.png');
        
        game.load.image('shortledge', wizGame.imgPath + 'shortledge.png');
        game.load.image('invshortledge', wizGame.imgPath + 'inv_shortledge.png');
        game.load.image('invplat', wizGame.imgPath + 'inv_plat.png');
        game.load.image('longledge', wizGame.imgPath + 'longledge.png');
        game.load.image('toadstool', wizGame.imgPath + 'toadstool.png');
        game.load.image('grass', wizGame.imgPath + 'grass_ground.png');
        // Button images
        game.load.image('reset-button', wizGame.imgPath + 'reset-button.png');
        game.load.image('contact-button', wizGame.imgPath + 'contact-button.png');
        game.load.image('house', wizGame.imgPath + 'house.png');
        game.load.image('door', wizGame.imgPath + 'door.png');

        game.load.image('trunk', wizGame.imgPath + 'invisibletrunk.png');
        
        game.load.spritesheet('baddie', wizGame.imgPath + 'baddie.png', 32, 32);
        game.load.spritesheet('explosion', wizGame.imgPath + 'explode.png', 128, 128);
        game.load.spritesheet('butterfly', wizGame.imgPath + 'butterfly2.png', 70, 65);
        game.load.spritesheet('butterflyJoel', wizGame.imgPath + 'butterfly.png', 80, 80);
    }

    var trees;
    var player;
    var platforms;
    var cursors;
    var powerup;
    var stars;
    var button;
    var music;
    var jumping;
    var grass;
    var door;
    var butterflies;
    var enemies;
    var ledge;
    var butterflyJoel;
    var explode_sound;
    var roof;
            
    //here we set two more vars
    var score = 0;
    var scoreText;

    function create() {
        game.world.setBounds(0, 0, 4800, 1200);
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        game.add.sprite(0, 0, 'forest');
        
        // this keeps track of the last time an NPC 'spoke'
        this.LAST_SPOKE = 0;

        // Play background music
        music: Phaser.Sound;
        this.music = this.add.audio('music', 1, true);
        this.music.play();
        // Put audio fx into variables to be called on an action
        butterflyCollect = game.add.audio('butterflyCollect');
        jumping = game.add.audio('jumping');
        victory = game.add.audio('victory');
        notice = game.add.audio('notice');
        explode_sound = game.add.audio('explode_sound');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;


        //  Now let's create the ledges
        //the first number says how many pixels from the left border it is
        //a negative number puts the ledge off the screen to the left
        //ledges have a fixed width, so to shorten them you have to put them off the screen
        //the second number says how far from the top of the page it is.    

        // These are the coordinates for the short ledges
        var shortledge_coords = {
           250: 800,
           550: 650,
           1450: 500,
           1750: 300,
           2050: 500,
           2300: 650,
           2700: 650,
           2700: 950,
           2800: 600,
           3000: 800,
           3500: 750,
           3500: 950,
           3800: 450,
           3900: 750,
           4250: 150,
           4250: 550,
           4600: 350
        }
        // The following iterates through the coordinates and creates the ledges
        for (var key in shortledge_coords) {
            var ledge = platforms.create( parseInt(key), shortledge_coords[key], 'shortledge');
            ledge.body.immovable = true;  
        }
   
        // Here we create the long ledges
        var longledge_coords = {
            1500: 970,
            1800: 970,
            2100: 970
        }
        for (var key in longledge_coords) {
            var ledge = platforms.create( parseInt(key), longledge_coords[key], 'longledge');
            ledge.body.immovable = true;  
        }


        // Here are some tree/trunk/top pairings. Trees have no 'body', trunks and tops are invislbe, but do.
        
        trees = game.add.group();

        var tree = trees.create(800, 480 , 'treetall');
        
        ledge = platforms.create(1000, 600 , 'trunk');
        ledge.body.immovable = true;

        ledge = platforms.create(10, 945, 'treestem');
        ledge.body.immovable = true;

        ledge = platforms.create(840, 580 , 'invplat');
        ledge.body.immovable = true;

        tree = trees.create(3100, 480 , 'treetall');
        
        ledge = platforms.create(3300, 600 , 'trunk');
        ledge.body.immovable = true;

        ledge = platforms.create(3140, 580 , 'invplat');
        ledge.body.immovable = true;
        
               
        // This it he bonsai tree
        ledge = platforms.create(1900, 730, 'tree_tile');
        ledge.body.immovable = true;

        //secret ledge for an easter egg to go on.
        ledge = platforms.create(1400, 150, 'invshortledge');
        ledge.body.immovable = true;

         // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(12, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        // GRASS. Create 12 grass, each moving 400 to the right to form a continuous layer
        grasses = game.add.group();
        var x_pos = 0
        for (var i = 0; i < 12; i++)
        {
            grass = grasses.create(x_pos, game.world.height - 81, 'grass'); 
            x_pos = x_pos + 400 

        }
        // HOUSE 
        var house = game.add.sprite(4000, 925, "house");
        door = game.add.sprite(4170, game.world.height - 139, "door");   
        game.physics.arcade.enable(door);
        door.body.immovable = true;
        
        // WILL ADD ROOF TO HOUSE LATER
        // var roof = game.add.sprite(200, game.world.height - 139, "shortledge");
        // game.physics.arcade.enable(roof);
        // roof.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(200, game.world.height - 150, 'dude');

        //  enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties.
        player.body.bounce.y = 0.2;
        // player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        game.camera.follow(player);
            
        // Butterflies create
        // The object below contains the butterfly coordinates
        
        var butterfly_coords = {
            250: 650,
            2800: 350,
            800: 950,
            4300: 700,
            1900: 1000,
            2105: 90,
            4000: 200
        }
        butterflies = game.add.group();
        butterflies.enableBody = true;
        
        // The bIdCounter allows us to give the butterflies a unique id as they're created so we can use them to manipulate the DOM as they're collected.
        // Now we can updated the sidebar CSS as they're collected.
        var bIdCounter = 0;
        
        // This loop creates the butterflies
        for (var key in butterfly_coords) {
            var butterfly = butterflies.create( parseInt(key), butterfly_coords[key], 'butterfly');
            butterfly.id = "resumeItem" + bIdCounter;
            bIdCounter += 1;  
        }
        butterflies.callAll('animations.add', 'animations', 'fly', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true)
        butterflies.callAll('animations.play', 'animations', 'fly');

        // create special easter egg butterfly
        butterflyJoel = game.add.sprite(250, 1050, 'butterflyJoel');
        game.physics.arcade.enable(butterflyJoel);
        butterflyJoel.enableBody = true;
        butterflyJoel.body.immovable = true;
        // Full opacity so it's invisible
        // butterflyJoel.alpha = 0.01;
       
        butterflyJoel.animations.add('flutter', [0, 1, 2, 3], 10, true);
        butterflyJoel.animations.play('flutter');
        
        //CREATE ENEMIES BELOW
        enemies = game.add.group();
        enemies.enableBody = true;
        for (var i = 0; i < 9; i++)
        {
            var enemy = enemies.create( 540 + (i * 700), 400, 'baddie');
            enemy.body.gravity.y = 300;
            enemy.body.bounce.y = 0.1 + Math.random() * 0.2;
            enemies.callAll('animations.add', 'animations', 'left', [0, 1], 10, true);        
            enemies.callAll('animations.add', 'animations', 'right', [2, 3], 10, true);   

        }
        //add a second group of enemies with different movement styles. these baddies have short distance animations. good for platforms. 
        baddies = game.add.group();
        baddies.enableBody = true;
        for (var i = 0; i < 4; i++)
        {
            var baddy = baddies.create( 400 + (i * 900), 400, 'baddie');
            baddy.body.gravity.y = 300;
            baddy.body.bounce.y = 0.1 + Math.random() * 0.2;
            baddies.callAll('animations.add', 'animations', 'left', [0, 1], 10, true);        
            baddies.callAll('animations.add', 'animations', 'right', [2, 3], 10, true);   

        }

        // These functions animate the enemies
       enemiesRight();
    
        function enemiesRight(){
            var tween = game.add.tween(enemies).to( { x: 40 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);

            // enemies.x += 100;
            enemies.callAll('animations.play', 'animations', 'left');
            setTimeout(enemiesLeft, 2000);
        }
       
        function enemiesLeft(){
            var tween = game.add.tween(enemies).to( { x: 130 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
            // enemies.x += -100;
            enemies.callAll('animations.play', 'animations', 'right');
            setTimeout(enemiesRight, 2000);
        }

        baddiesRight();
    
        function baddiesRight(){
            var tween = game.add.tween(baddies).to( { x: 50 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);

            // baddies.x += 100;
            baddies.callAll('animations.play', 'animations', 'left');
            setTimeout(baddiesLeft, 2000);
        }
       
        function baddiesLeft(){
            var tween = game.add.tween(baddies).to( { x: 350 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
            // baddies.x += -100;
            baddies.callAll('animations.play', 'animations', 'right');
            setTimeout(baddiesRight, 2000);
        }

        
        
        //  The score
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
        
    }
    

    function update() {
         // WILL GET ROOF OF HOUSE WORKING LATER (ERIK)
        // if (player.body.velocity.y >= 0){
        //  game.physics.arcade.collide(player, roof);
        // }

        //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(butterflies, platforms);

        // ENEMY ADDED HERE====================
        game.physics.arcade.collide(enemies, platforms);
        game.physics.arcade.collide(baddies, platforms);
        
        // This lets the user win if they run into the door.
        game.physics.arcade.overlap(player, door, winChecker, null, this);

         //  Checks to see if the player overlaps with any of the butterflies, if he does call the collectStar function
        game.physics.arcade.overlap(player, butterflies, collectButterfly, null, this);

        //  Checks to see if the player overlaps with the butterflyJoel, if he does call the easterEgg function
        game.physics.arcade.overlap(player, butterflyJoel, easterEgg, lastSpoke, this);

        // KILL PLAYER IF HE BUMPS INTO BAD GUY
        game.physics.arcade.overlap(player, enemies, killPlayer, null, this);
        game.physics.arcade.overlap(player, baddies, killPlayer, null, this);
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -200;

            player.animations.play('left');
            
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 200;

            player.animations.play('right');

        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown)
        {
            player.body.velocity.y = -200;
            jumping.play('');
        } else if (cursors.down.isDown) {
            player.body.velocity.y = 200;
        }
    }
    
    // This function checks when the players last spoke, to avoid printing text overtop of text already on the canvas
    function lastSpoke () {
        if (this.game.time.now > this.LAST_SPOKE + 1500){
            this.LAST_SPOKE = this.game.time.now;
            return true;
        } else {
            return false;
        }
    }

    function easterEgg (player, butterflyJoel) {
    
        // Samples an array of Joel's best comments
        joelStyle = { font: "30px Arial", fill: "#fff", align: "center" };
        var joelisms = ["\"Have the best time... seriously.\"", "\"Turn up the autism for that one.\""]
        var joelText = game.add.text(300, 960, _.sample(joelisms), joelStyle);
        // var joelText = game.add.text(300, 960, "\"Have the best time... seriously.\"", joelStyle);   
       
        // Call removeText function after a couple seconds
        setTimeout(removeText, 1500);

        function removeText () {
            game.world.remove(joelText);   
        }

    }

    function collectButterfly (player, butterfly) {
        
        // Removes the star from the screen
        butterfly.kill();

        //this line fades in resume content when a star is collected
        $('#'+butterfly.id).children('li').hide().css('visibility','visible').fadeIn(2000);
        //slides the accordian up or down to show resume content as stars are collected
        var $section = $('#'+butterfly.id).closest('ul');
        if (! $section.is(':visible')) {
            $section.prev('h3').trigger('click');
        }  
        
        //highlight sidebar tabs when something is selected
        function highlight() {
            $section.prev('h3').css('background', 'linear-gradient(#226758, #32957B)').fadeOut(1000, function() {
                $section.prev('h3').css('background', 'linear-gradient(#272822, #3B3A32)').fadeIn(400);
            });
        }

        powerup = game.add.sprite(player.body.x -32, player.body.y, 'powerup');
        powerup.animations.add('collect', [0, 1, 2, 3, 4, 5], 50, true);
        powerup.animations.play('collect');
        setTimeout(powerup_collect, 300);

        function powerup_collect() {
          powerup.kill();  
        }
        

        highlight();
        
        // updates the score so we can check in the winChecker function if player has collected all the stars.
        score += 1;
        game.world.remove(scoreText);
        score_style = { font: "20px Arial", fill: "#fff", align: "center" };
        scoreText = game.add.text(20, 20, "No. Butterflies: " + score, score_style);
        scoreText.fixedToCamera = true;

        // This simply plays a sound effect each time an item is collected.
        butterflyCollect.play('');

    }

     // Here we check if the user has collected all the collectables when they enter the door
     function winChecker () {
        if (score > 6) { 
            win();
            this.music.pause();
            player.kill();
        } 
        // Displays how many butterflies are still left to catch
        else {
            wincheck_style = { font: "50px Arial", fill: "#fff", align: "center" };
            butterfliesText = game.add.text(3950, 620, "You've collected \n" + score + " butterflies.\n\n You have " + (7 - score) + "\n more to catch.", wincheck_style);
            // Audio effect
            notice.play('');
            // Call removeText function after a couple seconds
            setTimeout(removeText, 1500);

            function removeText () {
                game.world.remove(butterfliesText);   
            }
            
        }
     }

    // Win function: f the right score is reached then pause music, remove player from screen and call win function 
    function win () {                
        style = { font: "65px Arial", fill: "#fff", align: "center" };
        game.add.text(game.camera.x+325, game.camera.y+150, "You Win!", style);
        button = game.add.button(game.camera.x+275, game.camera.y+250, 'reset-button', actionOnResetClick, this);
        button = game.add.button(game.camera.x+475, game.camera.y+250, 'contact-button', actionOnContactClick, this);  
        // The following lines kill the players movement before disabling keyboard inputs
        player.body.velocity.x = 0;
        setTimeout(game.input.keyboard.disabled = true, 1000); 
        // Plays the victory song    
        victory.play('');
        // When the Reset button is clicked, it calls this function, which in turn calls the game to be reloaded.
        // Here we display the contact and replay button options, calling either respective function
        function actionOnResetClick () {
            gameRestart();
        }

        // When the contact button is clicked it redirects through to contact form
        function actionOnContactClick () {

            window.location = ("/contacts/" + lastName)
            
        } 
    } 

    function killPlayer (player, enemy) {
        explosion = game.add.sprite(player.body.x - 32, player.body.y - 32,  'explosion');
        explosion.animations.add('run_explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        explosion.animations.play('run_explode');
        setTimeout(explode, 1500);
        setTimeout(gameOverText, 1500);
        setTimeout(gameRestart, 3000);
        this.music.pause();
        explode_sound.play(''); 
        function explode() {
          explosion.kill();

        }

        // Show text to say you died, then reload the game.
        function gameOverText () {
            style = { font: "65px Arial", fill: "#fff", align: "center" };
            var text = game.add.text(game.camera.x+450, game.camera.y+250, "You Lose! Try Again...", style);
            text.anchor.set(0.5);
        }
        // Removes the player from the screen
        player.kill();     
    }

    // This function gets called when restarting the game via the reset button after winning, or when you die and start over.
    function gameRestart () {
        location.reload();
    }


});