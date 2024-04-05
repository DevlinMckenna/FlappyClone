
import BaseScene from './BaseScene';
class MenuScene extends BaseScene {

    constructor(config){
        super('MenuScene',config);
       
        this.menu = [
            {scene: 'PlayScene',text:'Play'},
            {scene: 'ScoreScene',text:'Score'},
            {scene: null,text:'Exit'}
        ]
    }

   

    create() {
        super.create();
       // this.scene.start('PlayScene');
       this.createMenu(this.menu);
      
    }

    createBG(){
        let background = this.add.image(this.config.width / 2, this.config.height / 2, 'background');
        background.setDisplaySize(this.config.width, this.config.height);
    }
}

export default MenuScene;