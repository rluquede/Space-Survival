var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 480,
    backgroundColor: "black",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }
        }
    },
    scene:[{
        create: create
        },
        SceneMainMenu,
        SceneMain,
        SceneGameOver
    ],
    pixelArt: true,
    roundPixels: true

};

var playerScore;
var score = 0;

var game = new Phaser.Game(config);

function create() {
    window.addEventListener('resize', resize);
    resize();
    this.scene.start("SceneMainMenu");
}

function resize(){
    var canvas = game.canvas, width= screen.width, height= screen.height;
    var wratio = width/height, ratio= canvas.width/canvas.height;

    if(wratio<ratio){
        canvas.style.width = width + "px";
        canvas.style.height = (width/ratio) + "px"; 
    }else{
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}