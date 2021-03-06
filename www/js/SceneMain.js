class SceneMain extends Phaser.Scene {


    
    constructor() {
        super({ key: "SceneMain"});
        
        this.playerScore = 0;
        
    };


    
    

    preload(){

        

        this.load.image("sprBg0", "content/sprBg0.png");
        this.load.image("sprBg1", "content/sprBg1.png");
        this.load.spritesheet("sprExplosion", "content/sprExplosion.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("sprEnemy0", "content/sprEnemy0.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprEnemy1", "content/sprEnemy1.png");
        this.load.spritesheet("sprEnemy2", "content/sprEnemy2.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprLaserEnemy0", "content/sprLaserEnemy0.png");
        this.load.image("sprLaserPlayer", "content/sprLaserPlayer.png");
        this.load.spritesheet("sprPlayer", "content/sprPlayer.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.audio("sndExplosion0", "content/sndExplode0.wav");
        this.load.audio("sndExplosion1", "content/sndExplode1.wav");
        this.load.audio("sndLaser", "content/sndLaser.wav");
        

        
    };

    

    create() {

        

        

        game.scoreText = this.add.text(16,16 , 'Score: 0', {
            fontFamily: 'monospace',
            fontSize: 18,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });

        this.anims.create({
            key: "sprEnemy0",
            frames: this.anims.generateFrameNumbers("sprEnemy0"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "sprEnemy2",
            frames: this.anims.generateFrameNumbers("sprEnemy2"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "sprExplosion",
            frames: this.anims.generateFrameNumbers("sprExplosion"),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "sprPlayer",
            frames: this.anims.generateFrameNumbers("sprPlayer"),
            frameRate: 20,
            repeat: -1
        });

        this.sfx = {
            explosions: [
                this.sound.add("sndExplosion0"),
                this.sound.add("sndExplosion1")
            ],
            laser: this.sound.add("sndLaser")
        };

        this.backgrounds = [];
        for(var i = 0; i < 5; i++){
            var bg = new ScrollingBackground(this, "sprBg0", i * 10);
            this.backgrounds.push(bg);
        }

        this.player = new Player(
            this,
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprPlayer"
        )

        game.playerLives = this.player.getData("lives");
        console.log(game.playerLives);

        game.livesText = this.add.text( this.game.config.width - 150 ,16 , 'Lives: ' + game.playerLives, {
            fontFamily: 'monospace',
            fontSize: 18,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //this.pointer = this.input.activePointer;

        this.enemies = this.add.group();
        this.enemyLasers = this.add.group();
        this.playerLasers = this.add.group();

        this.time.addEvent({
            delay: 1000,
            callback: function() {
              var enemy = null;
              
              if(Phaser.Math.Between(0,10) >=3){
                  enemy = new GunShip(this, Phaser.Math.Between(0, this.game.config.width),0);
                  
              }
              else if (Phaser.Math.Between(0,10) >= 5){
                  if (this.getEnemiesByType("ChaserShip").length < 5){
                      enemy = new ChaserShip(this, Phaser.Math.Between(0, this.game.config.width),0);
                  }
              }
              else{
                  enemy = new CarrierShip(this, Phaser.Math.Between(0, this.game.config.width),0);
              }
              
              if(enemy !== null) {
                  enemy.setScale(Phaser.Math.Between(10,20) * 0.1);
                  this.enemies.add(enemy);
              }
            },
            callbackScope: this,
            loop: true
          });

          this.physics.add.collider(this.playerLasers, this.enemies, function(playerLaser, enemy){

            if(enemy){
                if(enemy.onDestroy !== undefined) {
                    enemy.onDestroy
                }
                /*if(this.playerScore == undefined)
                    this.playerScore = 0;*/

                if(game.score == undefined){
                    game.score = 0;
                }
                //this.playerScore = this.playerScore + parseInt(enemy.getData("points"));
                game.score = game.score + parseInt(enemy.getData("points"));
                //this.scoreText = this.scoreText.setText('Score: 1');
                game.scoreText.setText("Score: " + game.score);
                
                enemy.explode(true);
                playerLaser.destroy();
            }
          });

          this.physics.add.overlap(this.player, this.enemies, function(player, enemy){

            if(game.playerLives > 1){

                game.playerLives = game.playerLives - 1;
                game.livesText.setText("Lives: " + game.playerLives);
                enemy.explode(true);
                

            }else{
                if(!player.getData("isDead") && !enemy.getData("isDead")){
                    player.explode(false);
                    if(game.score == undefined){
                     game.score = 0;
                    }
                    player.onDestroy();
                    enemy.explode(true);
                }
            }

                
            });

          this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser){
            if(game.playerLives > 1){

                game.playerLives = game.playerLives - 1;
                game.livesText.setText("Lives: " + game.playerLives);
                laser.destroy();
                

            }else{

              if(!player.getData("isDead") && !laser.getData("isDead")){
                  player.explode(false);
                  if(game.score == undefined){
                    game.score = 0;
                   }
                  player.onDestroy();
                  laser.destroy();
              }
            }
          });



       
    }

    getEnemiesByType(type){
        var arr = [];
        for (var i = 0; i < this.enemies.getChildren().length; i++){
            var enemy = this.enemies.getChildren()[i];
            if (enemy.getData("type") == type) {
                arr.push(enemy);
            }
        }
        return arr;
    }

    update(){

        
        if(!this.player.getData("isDead")){
            
            
        
            this.player.update();

            if(this.keyW.isDown || this.keyS.isDown || this.keyA.isDown || this.keyD.isDown || this.keySpace.isDown){

                if(this.keyW.isDown){
                    this.player.moveUp();
                }
    
                if(this.keyS.isDown){
                    this.player.moveDown();
                }
    
                if(this.keyA.isDown){
                    this.player.moveLeft();
                }
    
                if(this.keyD.isDown){
                    this.player.moveRigth();
                }
    
    
               if(this.keySpace.isDown){
                    this.player.setData("isShooting", true);
                }
    
                else{
    
                    this.player.setData("timerShootTick", this.player.getData("timerShootDelay")-1);
                    this.player.setData("isShooting", false);
                }

            }else{
            
                this.input.on('pointermove', function (pointer) {

                    if (pointer.isDown)
                    {
                        this.player.x = pointer.x
                        this.player.y = pointer.y
    
                    }
                }, this);

                this.input.on('pointerdown', function(pointer){
                    this.player.setData("isShooting", true);
                }, this);

                this.input.on('pointerup', function(pointer){
                    this.player.setData("timerShootTick", this.player.getData("timerShootDelay")-1);
                    this.player.setData("isShooting", false);
                }, this);
                
            }
            
        }

        for(var i = 0; i < this.enemies.getChildren().length; i++) {
            var enemy = this.enemies.getChildren()[i];

            enemy.update();

            if(enemy.x < -enemy.displayWidth || 
                enemy.x > this.game.config.width + enemy.displayWidth ||
                enemy.y < - enemy.displayHeigth * 4 ||
                enemy.y > this.game.config.height + enemy.displayHeight){

                    if(enemy){
                        if(enemy.onDestroy !== undefined){
                            enemy.onDestroy();
                        }

                        enemy.destroy();
                    }
                }
        }

        for(var i = 0; i < this.enemyLasers.getChildren().length; i++){
            var laser = this.enemyLasers.getChildren()[i];
            laser.update();

            if(laser.x < -laser.displayWidth || laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < - laser.displayHeight * 4 || laser.y > this.game.config.height + laser.displayHeight){
                   if(laser){
                    laser.destroy();
                   } 
            }
        }

        for(var i = 0; i < this.playerLasers.getChildren().length; i++){
            var laser = this.playerLasers.getChildren()[i];
            laser.update();

            if(laser.x < -laser.displayWidth || laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < - laser.displayHeight * 4 || laser.y > this.game.config.height + laser.displayHeight){
                   if(laser){
                    laser.destroy();
                   } 
            }
        }


        for(var i = 0; i < this.backgrounds.length; i++){
            this.backgrounds[i].update();
        }

    }

    
}