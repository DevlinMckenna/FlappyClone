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
        this.load.image('back', 'assets/back.png');
        this.load.image('redPipe', 'assets/redPipe0.png');
        this.load.image('WhitePipeBase', 'assets/output-onlinepngtools.png');
        this.load.image('WhiteShiftedBird', 'assets/whiteShiftedBird.png.png');
    }

    create() {
        this.scene.start('MenuScene');
    }

   
}

export default preloadScene;