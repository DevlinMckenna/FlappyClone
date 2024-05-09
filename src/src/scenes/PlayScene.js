
//import Phaser from 'phaser';
import BaseScene from "./BaseScene";
import PauseScene from "./pauseScene";

const pipesToRender = 4;
const colorQueue = ['white', 'white', 'white', 'white'];
let applyColorFlag = true;


class PlayScene extends BaseScene {

    const

    constructor(config) {

        super('PlayScene', config);
        this.bird = null;
        this.pipes = null;
        this.isPaused = false;
        this.HorizontalinterPipeDist = 0;
        this.VerticalpipeGapPhase = [150, 250];
        this.HorizontalpipeGapPhase = [400, 500];
        this.PipeColorIndex = [1, 2, 3];
        this.pipeColor = 'white';
        this.birdColor = 'white';

        this.score = 0;
        this.bestScore;
        this.scoreText = '';
        this.bestScoreText = '';

        this.currentDifficutly = 'easy';
        this.difficulties = {
            'easy': {
                HorizontalpipeGapPhase: [300, 350],
                VerticalpipeGapPhase: [150, 200]
            },
            'normal': {
                HorizontalpipeGapPhase: [280, 320],
                VerticalpipeGapPhase: [140, 180]
            },
            'hard': {
                HorizontalpipeGapPhase: [250, 300],
                VerticalpipeGapPhase: [120, 200]
            }
        }
    }



    create() {
        this.currentDifficutly = 'easy';
        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.handleInputs();
        this.createScore();
        this.creatPause();
        this.listenToEvents();
    }

    update() {
        this.offScreenReset();
        this.recyclePipes();
        this.colorTest();
    }

    listenToEvents() {
        if (this.pauseEvent) { return; }
        this.pauseEvent = this.events.on('resume', () => {
            this.initialTime = 3;
            this.countDownText = this.add.text(...this.screenCenter,
                'resume in: ' + this.initialTime, this.fontOptions).setOrigin(0.5);

            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: true
            })
        })
    }

    countDown() {
        this.initialTime = this.initialTime - 1;
        this.countDownText.setText('resume in:' + this.initialTime);
        if (this.initialTime <= 0) {
            this.isPaused = false;
            this.countDownText.setText('');
            this.physics.resume();
            this.timedEvent.remove();
        }
    }

    createBG() {

        let background = this.add.image(this.config.width / 2, this.config.height / 2, 'background');
        background.setDisplaySize(this.config.width, this.config.height);
    }
    createBird() {
        this.bird = this.physics.add.sprite(this.config.width / 10, this.config.height / 2, 'WhiteShiftedBird').setOrigin(0);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);

    }
    createPipes() {
        this.pipes = this.physics.add.group();

        for (let i = 0; i < pipesToRender; i++) {

            const pipe0 = this.pipes.create(0, 0, 'WhitePipeBase')
                .setImmovable(true)
                .setOrigin(0, 1);
            const pipe1 = this.pipes.create(0, 0, 'WhitePipeBase')
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
        this.input.keyboard.on('keydown-A', this.turnBirdRed, this);
        this.input.keyboard.on('keydown-S', this.turnBirdGreen, this);
        this.input.keyboard.on('keydown-D', this.turnBirdBlue, this);
    }

    turnBirdRed() {
        this.bird.setTint(0xFF0000);
        this.birdColor = 'red';
    }

    turnBirdGreen() {
        this.bird.setTint(0x00FF00);
        this.birdColor = 'green';
    }

    turnBirdBlue() {
        this.bird.setTint(0x0000FF);
        this.birdColor = 'blue';
    }

    offScreenReset() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
            this.gameOver();
        }
    }



    placePipe(upperPipe, lowerPipe) {
        const difficulty = this.difficulties[this.currentDifficutly];

        const rightMostX = this.getRightMostPipe();
        const pipeGap = Phaser.Math.Between(difficulty.VerticalpipeGapPhase[0], difficulty.VerticalpipeGapPhase[1]);
        const initialPipePosVert = Phaser.Math.Between(20, this.config.height - 20 - pipeGap);
        const HorizontalinterPipeDist = Phaser.Math.Between(difficulty.HorizontalpipeGapPhase[0], difficulty.HorizontalpipeGapPhase[1]);

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
                    this.randomizePipeColor(tempPipes[0], tempPipes[1]);

                    this.incrementScore();
                    this.saveBestScore();
                    this.increaseDifficulty();

                }

            }
        })
    }




    colorTest() {

       // let currentColor = 'white';
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= this.bird.getBounds().right && pipe.getBounds().right >= this.bird.getBounds().right - 5) {
                //  colorQueue.forEach(element => {
                //   console.log(this.getLastPushedElementAdjusted(colorQueue));
                // console.log(colorQueue);
                //    });


              //  currentColor = this.getLastPushedElementAdjusted(colorQueue);



                if (this.getLastPushedElementAdjusted(colorQueue) == this.birdColor) {
                    console.log("colors match: ");
                    return;
                }

                else {
                    console.log("colors DONT match: ");
                    // console.log(this.birdColor + "  " + currentColor);
                    this.gameOver();
                }



            }
        })
    }

    getLastPushedElement(queue) {
        if (queue.length === 0) {
            return "Queue is empty";
        }

        let i = queue.length - 1;
        const lastpushedElement = queue[i];
        //queue.shift(); 
        // console.log(queue);
        return lastpushedElement;
    }

    getLastPushedElementAdjusted(queue) {
        if (queue.length === 0) {
            return "Queue is empty";
        }

        let i = queue.length - 4;
        const lastpushedElement = queue[i];
        //queue.shift(); 
        // console.log(queue);
        return lastpushedElement;
    }


    randomizePipeColor(upperPipe, lowerPipe) {
        let pick = Phaser.Math.Between(this.PipeColorIndex[0], this.PipeColorIndex[2]);
        if (pick == 1) {
            upperPipe.setTint(0xFF0000);
            lowerPipe.setTint(0xFF0000);
            this.pipeColor = 'red';
            colorQueue.push(this.pipeColor);
            //  console.log(this.getLastPushedElement(colorQueue));

        };
        if (pick == 2) {
            upperPipe.setTint(0x00FF00);
            lowerPipe.setTint(0x00FF00);
            this.pipeColor = 'green';
            colorQueue.push(this.pipeColor);
            //  console.log(this.getLastPushedElement(colorQueue));
        };
        if (pick == 3) {
            upperPipe.setTint(0x0000FF);
            lowerPipe.setTint(0x0000FF);
            this.pipeColor = 'blue';
            colorQueue.push(this.pipeColor);
            //   console.log(this.getLastPushedElement(colorQueue));
        };

        // console.log(this.pipeColor);


    }

    increaseDifficulty() {
        if (this.score === 5) {
            //  console.log("normal difficulty set");
            this.currentDifficutly = 'normal';
        }
        if (this.score === 10) {
            //  console.log("hard difficulty set");
            this.currentDifficutly = 'hard';
        }
    }

    getRightMostPipe() {
        let rightMostX = 0;

        this.pipes.getChildren().forEach(function (pipe) {
            rightMostX = Math.max(pipe.x, rightMostX)
        })

        return rightMostX;
    }


    flapAttack() {
        if (this.isPaused) { return; }
        this.bird.body.velocity.y = -300;

    }

    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem('bestScore');
        this.scoreText = this.add.text(16, 16, `Score: ${0}`, { fontSize: '40px', fill: '#000' })
        this.bestScoreText = this.add.text(10, 56, ` Best Score: ${bestScore || 0}`, { fontSize: '20px', fill: '#000' })
    }

    creatPause() {
        this.isPaused = false;
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pauseMenu')
            .setScale(3)
            .setOrigin(1)
            .setInteractive();

        pauseButton.on('pointerdown', () => {
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        }
        )
    }

    incrementScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);


    }

    saveBestScore() {
        this.bestScoreText = localStorage.getItem('bestScore')
        this.bestScore = this.bestScoreText && parseInt(this.bestScoreText, 10);


        if (!this.bestScore || this.score > this.bestScore) {
            localStorage.setItem('bestScore', this.score);
        }

    }

    resetColorQueue(queue) {
        while (queue.length > 4) {
            queue.pop(); 
        }
        console.log(colorQueue);
    }

    gameOver() {

        // this.bird.x = this.config.startPosition.x;
        // this.bird.y = this.config.startPosition.y;
        this.resetColorQueue(colorQueue);

        this.bird.body.velocity.y = 0;

        this.physics.pause();
        this.bird.setTint(0x000000);
        this.birdColor = 'white';
        

        this.saveBestScore();



        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        })
    }



}

export default PlayScene;