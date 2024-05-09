import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

    constructor(key, config) {
        super(key);
        this.config = config;
        this.screenCenter = [config.width /2, config.height/2];
        this.fontSize = 54;
        this.lineHeight = 62;
        this.fontOptions = {fontSize: `${this.fontSize}px`, fill:'#FFF'}
    } 




    create() {
        this.createBG();

        if (this.config.canGoBack) {
            const backButton = this.add.image(this.config.width - 10, this.config.height -10, 'back')
              .setOrigin(1)
              .setScale(2)
              .setInteractive()
      
            backButton.on('pointerup', () => {
              this.scene.start('MenuScene');
            })
          }
    }

    createMenu(menu,setupMenuEvents){
        let lastMenuPositionY = 0;

        menu.forEach(menuItem => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
           menuItem.textGO = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5,1);
            lastMenuPositionY +=this.lineHeight;
            setupMenuEvents(menuItem);
        })
    }

    createBG() {
        let background = this.add.image(this.config.width / 2, this.config.height / 2, 'background');
        background.setDisplaySize(this.config.width, this.config.height);
    }
}

export default BaseScene;