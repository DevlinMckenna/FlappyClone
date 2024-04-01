import Phaser from 'phaser';
import MenuScene from './MenuScene';

class preloadScene extends Phaser.Scene {

    constructor(){
        super('preloadScene');
        
    }

    preload() {
        this.load.image('background', 'assets/FlappyCloud0.webp');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('laidPipe', 'assets/pipe.png');
        this.load.image('pauseMenu', 'assets/pause.png');
    }

    create() {
        this.scene.start('MenuScene');
    }

   
}

export default preloadScene;