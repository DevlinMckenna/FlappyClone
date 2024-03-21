
import Phaser from 'phaser';

const pipesToRender = 4;


class PlayScene extends Phaser.Scene {

    const

    constructor(config) {
        super('PlayScene');
        this.config = config;

        this.bird = null;
        this.pipes = null;
        this.HorizontalinterPipeDist = 0;
        this.VerticalpipeGapPhase = [150, 250];
        this.HorizontalpipeGapPhase = [400, 500];
    }

    preload() {
        this.load.image('background', 'assets/FlappyCloud0.webp');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('laidPipe', 'assets/pipe.png');

    }

    create() {
        this.createBG();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.handleInputs();
    }

    update() {
        this.offScreenReset();
        this.recyclePipes();
    }

    createBG() {

        let background = this.add.image(this.config.width / 2, this.config.height / 2, 'background');
        background.setDisplaySize(this.config.width, this.config.height);
    }
    createBird() {
        this.bird = this.physics.add.sprite(this.config.width / 10, this.config.height / 2, 'bird').setOrigin(0);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);
    }
    createPipes() {
        this.pipes = this.physics.add.group();

        for (let i = 0; i < pipesToRender; i++) {

            const pipe0 = this.pipes.create(0, 0, 'laidPipe')
                .setImmovable(true)
                .setOrigin(0, 1);
            const pipe1 = this.pipes.create(0, 0, 'laidPipe')
                .setImmovable(true)
                .setOrigin(0, 0);

            this.placePipe(pipe0, pipe1)
        }

        this.pipes.setVelocityX(-200);
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    handleInputs() {
        this.input.on('pointerdown', this.flapAttack, this)
        this.input.keyboard.on('keydown-SPACE', this.flapAttack, this);
    }

    offScreenReset() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
          this.gameOver();
        }
      }



    placePipe(upperPipe, lowerPipe) {

        const rightMostX = this.getRightMostPipe();
        const pipeGap = Phaser.Math.Between(this.VerticalpipeGapPhase[0], this.VerticalpipeGapPhase[1]);
        const initialPipePosVert = Phaser.Math.Between(20, this.config.height - 20 - pipeGap);
        const HorizontalinterPipeDist = Phaser.Math.Between(this.HorizontalpipeGapPhase[0], this.HorizontalpipeGapPhase[1]);

        upperPipe.x = rightMostX + HorizontalinterPipeDist;
        upperPipe.y = initialPipePosVert;

        lowerPipe.x = upperPipe.x;
        lowerPipe.y = upperPipe.y + pipeGap;
    }

    recyclePipes() {
        const tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= 0) {
                tempPipes.push(pipe);
                if (tempPipes.length == 2) {
                    this.placePipe(tempPipes[0], tempPipes[1]);
                }

            }
        })
    }

    getRightMostPipe() {
        let rightMostX = 0;

        this.pipes.getChildren().forEach(function (pipe) {
            rightMostX = Math.max(pipe.x, rightMostX)
        })

        return rightMostX;
    }


    flapAttack() {
        this.bird.body.velocity.y = -300;


    }

    gameOver() {
        // debugger
        this.bird.x = this.config.startPosition.x;
        this.bird.y = this.config.startPosition.y;
        this.bird.body.velocity.y = 0;

        this.physics.pause();
        this.bird.setTint(0xEE4824);

        this.time.addEvent({
            delay:1000,
            callback:() => {
                this.scene.restart();
            },
            loop: false
        })
    }



}

export default PlayScene;