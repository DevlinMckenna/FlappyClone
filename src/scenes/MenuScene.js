import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {

    constructor(config){
        super('MenuScene');
        this.config = config;
    }

   

    create() {
        this.createBG();
        this.scene.start('PlayScene');
      
    }

    createBG(){
        let background = this.add.image(this.config.width / 2, this.config.height / 2, 'background');
        background.setDisplaySize(this.config.width, this.config.height);
    }
}

export default MenuScene;