import Phaser from 'phaser';

const config = {
type: Phaser.AUTO,
  width:800,
  height:600,
  physics:{
    default:'arcade',
  //  arcade:{ gravity:{y:200}}
},

scene: {
  preload: preload,
  create: create,
  update
  }
}

const pipesToRender = 4;

let bird = null;
let pipes = null;

let HorizontalinterPipeDist =0;
const pipeGapPhase= [150,250];


let sumDeltaT = null;

function preload(){
this.load.image('background','assets/FlappyCloud0.webp');
this.load.image('bird', 'assets/bird.png');
this.load.image('laidPipe', 'assets/pipe.png');
}



function create(){

let background = this.add.image(config.width / 2, config.height / 2, 'background');
background.setDisplaySize(config.width, config.height);

bird = this.physics.add.sprite(config.width /10 , config.height /2,'bird').setOrigin(0);
bird.body.gravity.y = 600;

pipes = this.physics.add.group();

  for(let i = 0; i<pipesToRender; i++){
    
   const pipe0 = pipes.create(0 , 0,'laidPipe').setOrigin(0,1);
   const pipe1 = pipes.create(0 ,0,'laidPipe').setOrigin(0,0);

    placePipe(pipe0, pipe1)
  }

  pipes.setVelocityX(-200);






this.input.on('pointerdown', flapAttack)

this.input.keyboard.on('keydown-SPACE', flapAttack);

}

function update(time, delta){

if (bird.body.y >=800 || bird.body.y <0){
  restartPlayerPosition();
  }

sumDeltaT = sumDeltaT + delta; 
if (sumDeltaT < 1000){return;}
console.log(bird.body.y)  ;
sumDeltaT= 0;
}


function placePipe(upperPipe, lowerPipe){
  HorizontalinterPipeDist += 400;
 // HorizontalinterPipeDist = getRightMostPipe();
    let pipeGap = Phaser.Math.Between(pipeGapPhase[0],pipeGapPhase[1]);
    let initialPipePosVert = Phaser.Math.Between(20, config.height - 20 -pipeGap );

    upperPipe.x = HorizontalinterPipeDist;
    upperPipe.y = initialPipePosVert;

    lowerPipe.x = upperPipe.x;
    lowerPipe.y = upperPipe.y+ pipeGap;

    
}

function getRightMostPipe(){}




function restartPlayerPosition(){
  bird.body.y = config.height/2;
  bird.body.velocity.y = 0;
}

function flapAttack(){
bird.body.velocity.y = -300;

}; 

new Phaser.Game(config);
