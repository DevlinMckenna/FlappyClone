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

function preload(){
this.load.image('background','assets/FlappyCloud0.webp');
this.load.image('bird', 'assets/bird.png');
}

let bird = null;
let sumDeltaT = null;

function create(){


let background = this.add.image(config.width / 2, config.height / 2, 'background');
background.setDisplaySize(config.width, config.height);
bird = this.physics.add.sprite(config.width /10 , config.height /2,'bird').setOrigin(0);
//bird.body.gravity.y = 200;
bird.body.velocity.x = 200;

}

function update(time, delta){

if (bird.body.x >=800){bird.body.x = 0}


sumDeltaT = sumDeltaT + delta; 
if (sumDeltaT < 1000){return;}
console.log(bird.body.x);
sumDeltaT= 0;
}

new Phaser.Game(config);