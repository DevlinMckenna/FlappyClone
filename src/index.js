import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene'; 

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH/10, y: HEIGHT/2}

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const config = {
type: Phaser.AUTO,
 ...SHARED_CONFIG,
  physics:{
    default:'arcade',
  
},

scene: [new PlayScene(SHARED_CONFIG)]
}









function create(){


}

function update(time, delta){


}




new Phaser.Game(config);
