// CamelGame constructor --------------------------------------------

var CamelGame = function () {
    this.canvas = document.getElementById('game-canvas'),
        this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d'),

        // HTML elements........................................................

        this.fpsElement = document.getElementById('fps'),
        this.toast = document.getElementById('toast'),
        this.scoreElement = document.getElementById('score'),
        this.healthProgressBar = new ProgressBar('#health'),
        this.waterProgressBar = new ProgressBar('#water'),

        // Constants............................................................

        this.LEFT = 1,
        this.RIGHT = 2,
        this.STATIONARY = 3,

        // Constants are listed in alphabetical order from here on out

        this.BACKGROUND_VELOCITY = 100,
        this.DEFAULT_TOAST_TIME = 1000,

        this.PAUSED_CHECK_INTERVAL = 200,

        this.CAMEL_CELLS_HEIGHT = 60,

        this.STARTING_BACKGROUND_VELOCITY = 0,

        this.STARTING_BACKGROUND_OFFSET = 0,
        this.INITIAL_BACKGROUND_OFFSET = 0,

        this.STARTING_RUNNER_LEFT = 50,
        this.STARTING_PAGEFLIP_INTERVAL = -1,
        this.STARTING_RUNNER_TRACK = 1,
        this.STARTING_RUNNER_VELOCITY = 0,

        this.GRAVITY_FORCE = 9.81,
        this.PIXELS_PER_METER = this.canvas.width / 10; // 10 meters, randomly selected width

    this.OASIS_CELLS_HEIGHT = 90,
        this.OASIS_CELLS_WIDTH = 90,

        this.TOURIST_CELLS_HEIGHT = 130,
        this.TOURIST_CELLS_WIDTH = 90,

        this.BUSH_CELLS_WIDTH = 160,
        this.BUSH_CELLS_HEIGHT = 102,

        this.PALM_CELLS_WIDTH = 143,
        this.PALM_CELLS_HEIGHT = 231,

        //
        this.OASIS_WIDTH = 100,
        this.OASIS_HEIGHT = 80,

        this.TOURIST_WIDTH = 80,
        this.TOURIST_HEIGHT = 100,

        this.PYRAMID_WIDTH = 90,
        this.PYRAMID_HEIGHT = 90,

        this.CAMEL_WIDTH = 80,
        this.CAMEL_HEIGHT = 60,

        this.BUSH_WIDTH = 90,
        this.BUSH_HEIGHT = 90,

        this.PALM_WIDTH = 80,
        this.PALM_HEIGHT = 130,

        this.SPIT_WIDTH=50,
        this.SPIT_HEIGHT=50,
        // Paused............................................................

        this.paused = false,
        this.pauseStartTime = 0,
        this.totalTimePaused = 0,

        this.windowHasFocus = true,

        // Track baselines...................................................

        this.TRACK_1_BASELINE = this.canvas.height,
        this.TRACK_2_BASELINE = this.canvas.height / 4 * 3,
        this.TRACK_3_BASELINE = this.canvas.height / 4 * 2,

        // Fps indicator.....................................................

        this.fpsToast = document.getElementById('fps'),

        // Images............................................................

        this.background = new Image(),
        this.runnerImage = new Image(),
        this.spritesheet = new Image(),
        // Time..............................................................

        this.lastAnimationFrameTime = 0,
        this.lastFpsUpdateTime = 0,
        this.fps = 60,

        // Runner track......................................................

        this.runnerTrack = this.STARTING_RUNNER_TRACK,

        // Pageflip timing for runner........................................

        this.runnerPageflipInterval = this.STARTING_PAGEFLIP_INTERVAL,

        // Scrolling direction...............................................

        this.scrollingDirection = this.STATIONARY,

        // Translation offsets...............................................

        this.backgroundOffset = this.STARTING_BACKGROUND_OFFSET,
        this.spriteOffset = this.INITIAL_BACKGROUND_OFFSET,

        // Velocities........................................................

        this.bgVelocity = this.STARTING_BACKGROUND_VELOCITY;

// Sprite artists...................................................

    this.camelCells = [
        {left: 0, top: 0, width: 117, height: 90},  //2
        {left: 235, top: 0, width: 125, height: 90},  //3
        {left: 365, top: 0, width: 123, height: 90},  //4
        {left: 494, top: 0, width: 130, height: 90},  //5
        {left: 627, top: 0, width: 138, height: 90},  //6
        {left: 766, top: 0, width: 137, height: 90},  //7
        {left: 902, top: 0, width: 135, height: 90},  //8
        {left: 1037, top: 0, width: 117, height: 90},  //8
        {left: 1162, top: 0, width: 115, height: 90},  //8
        {left: 1280, top: 0, width: 117, height: 90},  //8
    ],

        this.spitCells = [
            {left:950, top:298, width: 170, height:100}
        ],

        this.oasisCells = [
            {left: 192, top: 294, width: 148, height: 90},
        ],

        this.touristCells = [
            {left: 813, top: 171, width: 153, height: 209},
        ],

        this.pyramidCells = [
            {left: 582, top: 190, width: 197, height: 195},
        ],

        this.bushCells = [
            {left: 0, top: 298, width: 160, height: 102},
        ],

        this.palmCells = [
            {left: 414, top: 153, width: this.PALM_CELLS_WIDTH, height: this.PALM_CELLS_HEIGHT},
        ],

        //

        this.oasisData = [
            {left: 600, top: this.TRACK_1_BASELINE - this.OASIS_HEIGHT},
            {left: 1200, top: this.TRACK_2_BASELINE - this.OASIS_HEIGHT},
            {left: 2450, top: this.TRACK_3_BASELINE - this.OASIS_HEIGHT},
        ],

        this.touristData = [
            {left: 600, top: this.TRACK_1_BASELINE - this.TOURIST_HEIGHT},
            {left: 1600, top: this.TRACK_2_BASELINE - this.TOURIST_HEIGHT},
            {left: 2600, top: this.TRACK_3_BASELINE - this.TOURIST_HEIGHT},
        ],

        this.pyramidData = [
            {left: 1400, top: this.TRACK_1_BASELINE - this.OASIS_HEIGHT},
            {left: 2200, top: this.TRACK_1_BASELINE - this.OASIS_HEIGHT},
        ],

        this.bushData = [
            {left: 954, top: this.TRACK_1_BASELINE - this.BUSH_HEIGHT},
            {left: 1754, top: this.TRACK_3_BASELINE - this.BUSH_HEIGHT},
            {left: 3100, top: this.TRACK_2_BASELINE - this.BUSH_HEIGHT},
        ],

        this.palmData = [
            {left: 1340, top: this.TRACK_3_BASELINE - this.PALM_HEIGHT},
            {left: 2301, top: this.TRACK_2_BASELINE - this.PALM_HEIGHT},
            {left: 3304, top: this.TRACK_3_BASELINE - this.PALM_HEIGHT},
        ],

        this.runnerArtist = new SpriteSheetArtist(this.spritesheet, this.camelCells);

    // Sprite behaviors.................................................

    this.runBehavior = {
        // Every runAnimationRate milliseconds, this behavior advances the
        // runner's artist to the next frame of the spritesheet, provided the
        // runner is not jumping or falling.
        //
        // This behavior is similar to the more general Cycle behavior in
        // js/behaviors. The difference is that this behavior does not advance
        // the sprite's artist if the sprite is jumping, falling, or the
        // runner's runAnimationRate is 0.

        lastAdvanceTime: 0,

        execute: function (sprite, time, fps) {
            // Realize that this is a method in an object (runBehavior), that resides
            // in another object (snailBait), so the 'this' reference in this method
            // refers to runBehavior, not snailBait.

            if (sprite.runAnimationRate === 0) {
                return;
            }

            if (this.lastAdvanceTime === 0) {  // skip first time
                this.lastAdvanceTime = time;
            }
            else if (time - this.lastAdvanceTime > 1000 / sprite.runAnimationRate) {
                sprite.artist.advance();
                this.lastAdvanceTime = time;
            }
        }
    },

        this.upBehavior = {
            execute: function (sprite, time, fps) {
                if (sprite.changing_track) {
                    if (sprite.track !== 3) {
                        sprite.track++;
                    }
                    sprite.top = CamelGame.calculatePlatformTop(sprite.track) - CamelGame.CAMEL_CELLS_HEIGHT;

                    sprite.changing_track = false; // immediately done jumping for now
                }
            }
        },

        this.downBehavior = {
            execute: function (sprite, time, fps) {
                if (sprite.changing_track_down) {
                    if (sprite.track !== 1) {
                        sprite.track--;
                    }
                    sprite.top = CamelGame.calculatePlatformTop(sprite.track) - CamelGame.CAMEL_CELLS_HEIGHT;

                    sprite.changing_track_down = false; // immediately done falling for now
                }
            }
        },

        this.paceBehavior = {
            checkDirection: function (sprite) {
                var sRight = sprite.left + sprite.width,
                    pRight = sprite.platform.left + sprite.platform.width;

                if (sRight > pRight && sprite.direction === this.RIGHT) {
                    sprite.direction = this.LEFT;
                }
                else if (sprite.left < sprite.platform.left &&
                    sprite.direction === this.LEFT) {
                    sprite.direction = this.RIGHT;
                }
            },

            moveSprite: function (sprite, fps) {
                var pixelsToMove = sprite.velocityX / fps;

                if (sprite.direction === this.RIGHT) {
                    sprite.left += pixelsToMove;
                }
                else {
                    sprite.left -= pixelsToMove;
                }
            },

            execute: function (sprite, time, fps) {
                this.checkDirection(sprite);
                this.moveSprite(sprite, fps);
            }
        },

        this.snailShootBehavior = { // sprite is the snail
            execute: function (sprite, time, fps) {
                var bomb = sprite.bomb;

                if (!bomb.visible && sprite.artist.cellIndex === 2) {
                    bomb.left = sprite.left;
                    bomb.visible = true;
                }
            }
        },

        //jumping

        this.jumpBehavior = {
            pause: function (sprite) {
                if (sprite.ascendAnimationTimer.isRunning()) {
                    sprite.ascendAnimationTimer.pause();
                }
                else if (!sprite.descendAnimationTimer.isRunning()) {
                    sprite.descendAnimationTimer.pause();
                }
            },

            unpause: function (sprite) {
                if (sprite.ascendAnimationTimer.isRunning()) {
                    sprite.ascendAnimationTimer.unpause();
                }
                else if (sprite.descendAnimationTimer.isRunning()) {
                    sprite.descendAnimationTimer.unpause();
                }
            },

            jumpIsOver: function (sprite) {
                return !sprite.ascendAnimationTimer.isRunning() && !sprite.descendAnimationTimer.isRunning();
            },

            // Ascent...............................................................

            isAscending: function (sprite) {
                return sprite.ascendAnimationTimer.isRunning();
            },

            ascend: function (sprite) {
                var elapsed = sprite.ascendAnimationTimer.getElapsedTime(),
                    deltaH = elapsed / (sprite.JUMP_DURATION / 2) * sprite.JUMP_HEIGHT;
                sprite.top = sprite.verticalLaunchPosition - deltaH;
            },

            isDoneAscending: function (sprite) {
                return sprite.ascendAnimationTimer.getElapsedTime() > sprite.JUMP_DURATION / 2;
            },

            finishAscent: function (sprite) {
                sprite.jumpApex = sprite.top;
                sprite.ascendAnimationTimer.stop();
                sprite.descendAnimationTimer.start();
            },

            // Descents.............................................................

            isDescending: function (sprite) {
                return sprite.descendAnimationTimer.isRunning();
            },

            descend: function (sprite, verticalVelocity, fps) {
                var elapsed = sprite.descendAnimationTimer.getElapsedTime(),
                    deltaH = elapsed / (sprite.JUMP_DURATION / 2) * sprite.JUMP_HEIGHT;

                sprite.top = sprite.jumpApex + deltaH;
            },

            isDoneDescending: function (sprite) {
                return sprite.descendAnimationTimer.getElapsedTime() > sprite.JUMP_DURATION / 2;
            },

            finishDescent: function (sprite) {
                sprite.stopJumping();

            },

            // Execute..............................................................

            execute: function (sprite, time, fps) {
                if (!sprite.jumping || sprite.exploding) {
                    return;
                }

                if (this.jumpIsOver(sprite)) {
                    sprite.jumping = false;
                    return;
                }

                if (this.isAscending(sprite)) {
                    if (!this.isDoneAscending(sprite)) {
                        this.ascend(sprite);
                    }
                    else {
                        this.finishAscent(sprite);
                    }
                }
                else if (this.isDescending(sprite)) {
                    if (!this.isDoneDescending(sprite)) {
                        this.descend(sprite);
                    }
                    else {
                        this.finishDescent(sprite);
                    }
                }
            }
        },

        // Runner's fall behavior..................................................

        this.fallBehavior = {
            isOutOfPlay: function (sprite) {
                return sprite.top > CamelGame.TRACK_1_BASELINE;
            },

            willFallBelowCurrentTrack: function (sprite, deltaY) {
                return sprite.top + sprite.height + deltaY >
                    CamelGame.calculatePlatformTop(sprite.track);
            },

            fallOnPlatform: function (sprite) {
                sprite.top = CamelGame.calculatePlatformTop(sprite.track) - sprite.height;
                sprite.stopFalling();

            },

            setSpriteVelocity: function (sprite) {
                var fallingElapsedTime;

                sprite.velocityY = sprite.initialVelocityY + CamelGame.GRAVITY_FORCE *
                (sprite.fallAnimationTimer.getElapsedTime() / 1000) *
                CamelGame.PIXELS_PER_METER;
            },

            calculateVerticalDrop: function (sprite, fps) {
                return sprite.velocityY / fps;
            },

            isPlatformUnderneath: function (sprite) {
                return CamelGame.isOverPlatform(sprite) !== -1;
            },

            execute: function (sprite, time, fps) {
                var deltaY;

                if (sprite.jumping) {
                    return;
                }

                if (this.isOutOfPlay(sprite) || sprite.exploding) {
                    if (sprite.falling) {
                        sprite.stopFalling();
                    }
                    return;
                }

                if (!sprite.falling) {
                    if (!sprite.exploding && !this.isPlatformUnderneath(sprite)) {
                        sprite.fall();
                    }
                    return;
                }

                this.setSpriteVelocity(sprite);
                deltaY = this.calculateVerticalDrop(sprite, fps);

                if (!this.willFallBelowCurrentTrack(sprite, deltaY)) {
                    sprite.top += deltaY;
                }
                else { // will fall below current track

                    if (this.isPlatformUnderneath(sprite)) {
                        this.fallOnPlatform(sprite);
                        sprite.stopFalling();
                    }
                    else {
                        sprite.track--;

                        sprite.top += deltaY;

                        if (sprite.track === 0) {
                            CamelGame.playSound(snailBait.fallingWhistleSound);
                            CamelGame.loseLife();
                            sprite.stopFalling();
                            CamelGame.reset();
                            CamelGame.fadeAndRestoreCanvas();
                        }
                    }
                }
            }
        },
        //collisions
        this.collideBehavior = {
            execute: function (sprite, time, fps, context) {
                var otherSprite;

                for (var i = 0; i < CamelGame.sprites.length; ++i) {
                    otherSprite = CamelGame.sprites[i];
                    if (CamelGame.runner.jumping == true)
                        return;
                    if (this.isCandidateForCollision(sprite, otherSprite)) {
                        if (this.didCollide(sprite, otherSprite, context)) {
                            this.processCollision(sprite, otherSprite);
                        }
                    }
                }
            },

            isCandidateForCollision: function (sprite, otherSprite) {
                return sprite !== otherSprite &&
                    sprite.visible && otherSprite.visible && !sprite.exploding && !otherSprite.exploding &&
                    otherSprite.left - otherSprite.offset < sprite.left - sprite.offset + sprite.width;
            },

            didRunnerCollideWithOtherSprite: function (left, top, right, bottom,
                                                       centerX, centerY,
                                                       otherSprite, context) {
                // Determine if either of the runner's four corners or its
                // center lie within the other sprite's bounding box.

                context.beginPath();
                context.rect(otherSprite.left - otherSprite.offset, otherSprite.top,
                    otherSprite.width, otherSprite.height);

                return context.isPointInPath(left, top) ||
                    context.isPointInPath(right, top) ||

                    context.isPointInPath(centerX, centerY) ||

                    context.isPointInPath(left, bottom) ||
                    context.isPointInPath(right, bottom);
            },

            didCollide: function (sprite, otherSprite, context) {
                var MARGIN_TOP = 10,
                    MARGIN_LEFT = 10,
                    MARGIN_RIGHT = 10,
                    MARGIN_BOTTOM = 0,
                    left = sprite.left + sprite.offset + MARGIN_LEFT,
                    right = sprite.left + sprite.offset + sprite.width - MARGIN_RIGHT,
                    top = sprite.top + MARGIN_TOP,
                    bottom = sprite.top + sprite.height - MARGIN_BOTTOM,
                    centerX = left + sprite.width / 2,
                    centerY = sprite.top + sprite.height / 2;

                return this.didRunnerCollideWithOtherSprite(left, top, right, bottom,
                    centerX, centerY,
                    otherSprite, context);
            },

            processCollision: function (sprite, sprite) {
                if (sprite.value) { // Modify Snail Bait sprites so they have values
                    // Keep score...
                }

                switch (sprite.type) {
                    case 'bush':
                        CamelGame.increaseHealth(sprite);
                        break;
                    case 'oasis':
                        CamelGame.increaseWater(sprite);
                        break;
                    case 'palm':
                        CamelGame.decreaseHealth(sprite);
                        break;
                    case 'pyramid':
                        CamelGame.decreaseHealth(sprite);
                        break;
                    case 'tourist':
                        sprite.visible = false;
                        CamelGame.splashToast('Попал в кадр!', 1000);
                        break;
                }
            }
        }

    // Sprites...........................................................

    this.oases = [],
        this.tourists = [],
        this.bushes = [],
        this.pyramids = [],
        this.palms = [],

        this.runner = new Sprite('runner',          // type
            this.runnerArtist, // artist
            [this.runBehavior, // behaviors
                this.upBehavior,
                this.downBehavior,
                this.jumpBehavior,
                this.collideBehavior
            ]);

    // All sprites.......................................................
    //
    // (addSpritesToSpriteArray() adds sprites from the preceding sprite
    // arrays to the sprites array)

    this.sprites = [this.runner];

    /* this.explosionAnimator = new SpriteAnimator(
     this.explosionCells,          // Animation cells
     this.EXPLOSION_DURATION,      // Duration of the explosion
     function (sprite, animator) { // Callback after animation
     sprite.exploding = false;
     }
     );*/
};


// CamelGame.prototype ----------------------------------------------------

CamelGame.prototype = {
    // Drawing..............................................................

    draw: function (now) {
        this.setPlatformVelocity();
        this.setTranslationOffsets();

        this.drawBackground();
        //sprites
        this.updateSprites(now);
        this.drawSprites();
    },

    setPlatformVelocity: function () {
        this.platformVelocity = this.bgVelocity * 4.35;
    },

    setTranslationOffsets: function () {
        this.setBackgroundTranslationOffset();
        this.setSpriteTranslationOffsets();
    },

    setBackgroundTranslationOffset: function () {
        var offset = this.backgroundOffset + this.bgVelocity / this.fps;

        //if (offset > 0 && offset < this.background.width) {
        if (offset > 0 && offset < this.canvas.clientWidth) {
            this.backgroundOffset = offset;
        }
        else {
            this.backgroundOffset = 0;
        }
    },

    setSpriteTranslationOffsets: function () {
        var i, sprite;

        this.spriteOffset += this.platformVelocity / this.fps; // In step with platforms

        for (i = 0; i < this.sprites.length; ++i) {
            sprite = this.sprites[i];

            if ('runner' !== sprite.type) {
                sprite.offset = this.spriteOffset;
            }
        }
    },

    drawBackground: function () {
        this.context.save();

        this.context.globalAlpha = 1.0;
        this.context.translate(-this.backgroundOffset, 0);

        // Initially onscreen:
        //this.context.drawImage(this.background, 0, 0, this.background.width, this.background.height);
        this.context.drawImage(this.background, 0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        // Initially offscreen:
        //this.context.drawImage(this.background, this.background.width, 0, this.background.width+1, this.background.height);
        this.context.drawImage(this.background, this.canvas.clientWidth, 0, this.canvas.clientWidth + 1, this.canvas.clientHeight);

        this.context.restore();
    },

    calculateFps: function (now) {
        var fps;

        if (this.lastAnimationFrameTime === 0) {
            this.lastAnimationFrameTime = now;
            return 60;
        }

        fps = 1000 / (now - this.lastAnimationFrameTime);
        this.lastAnimationFrameTime = now;

        if (now - this.lastFpsUpdateTime > 1000) {
            this.lastFpsUpdateTime = now;
            this.fpsElement.innerHTML = fps.toFixed(0) + ' fps';
        }

        return fps;
    },

    calculatePlatformTop: function (track) {
        var top;

        if (track === 1) {
            top = this.TRACK_1_BASELINE;
        }
        else if (track === 2) {
            top = this.TRACK_2_BASELINE;
        }
        else if (track === 3) {
            top = this.TRACK_3_BASELINE;
        }

        return top;
    },

    turnRight: function () {
        this.bgVelocity = this.BACKGROUND_VELOCITY;
        this.runner.runAnimationRate = 10;
        this.runnerArtist.cells = this.camelCells;
        this.runner.direction = this.RIGHT;
    },

    // Sprites..............................................................

    increaseWater: function (sprite) {
        sprite.visible = false;
        this.waterProgressBar.adjustValue(sprite.value);
    },

    increaseHealth: function (sprite) {
        sprite.visible = false;
        this.healthProgressBar.adjustValue(sprite.value);
    },

    decreaseHealth: function (sprite) {
        sprite.visible = false;
        this.healthProgressBar.adjustValue(sprite.value);
    },

    explode: function (sprite, silent) {
        sprite.exploding = true;
        this.explosionAnimator.start(sprite, true);  // true means sprite reappears
    },

    equipRunner: function () {
        this.runner.runAnimationRate = 0,
            this.runner.track = 1;
        this.runner.direction = this.LEFT;
        this.runner.velocityX = 0;
        this.runner.width = this.CAMEL_WIDTH;
        this.runner.height = this.CAMEL_HEIGHT;
        this.runner.left = 50;
        this.runner.top = this.calculatePlatformTop(this.runner.track) - this.CAMEL_CELLS_HEIGHT;

        this.runner.artist.cells = this.camelCells;

        this.runner.changing_track = false;
        this.runner.changing_track_down = false;
        this.runner.jumping = false;
        this.runner.falling = false;

        this.runner.up = function () {
            // this method is essentially a switch that turns
            // on the runner's jumping behavior

            this.changing_track = !this.changing_track // 'this' is the runner
        };

        this.runner.down = function () {
            // this method is essentially a switch that turns
            // on the runner's falling behavior

            this.changing_track_down = !this.changing_track_down // 'this' is the runner
        };

        this.equipRunnerForJumping();
        this.equipRunnerForFalling();
    },

    equipRunnerForFalling: function () {
        this.runner.falling = false;
        this.runner.fallAnimationTimer = new AnimationTimer();

        this.runner.fall = function (initialVelocity) {
            this.velocityY = initialVelocity || 0;
            this.initialVelocityY = initialVelocity || 0;
            this.fallAnimationTimer.start();
            this.falling = true;
        }

        this.runner.stopFalling = function () {
            this.falling = false;
            this.velocityY = 0;
            this.fallAnimationTimer.stop();
        }
    },

    equipRunnerForJumping: function () {
        this.runner.JUMP_DURATION = 1000; // milliseconds
        this.runner.JUMP_HEIGHT = 150;

        this.runner.jumping = false;

        this.runner.ascendAnimationTimer =
            new AnimationTimer(this.runner.JUMP_DURATION / 2,
                AnimationTimer.makeEaseOutTransducer(1.1));

        this.runner.descendAnimationTimer =
            new AnimationTimer(this.runner.JUMP_DURATION / 2,
                AnimationTimer.makeEaseInTransducer(1.1));

        this.runner.stopJumping = function () {
            this.jumping = false;
            this.ascendAnimationTimer.stop();
            this.descendAnimationTimer.stop();
            this.runAnimationRate = 10;
        };

        this.runner.jump = function () {
            if (this.jumping) // 'this' is the runner
                return;

            this.runAnimationRate = 0;
            this.jumping = true;
            this.verticalLaunchPosition = this.top;
            this.ascendAnimationTimer.start();


        };
    },
    // Toast................................................................

    splashToast: function (text, howLong) {
        howLong = howLong || this.DEFAULT_TOAST_TIME;

        toast.style.display = 'block';
        toast.innerHTML = text;

        setTimeout(function (e) {
            if (CamelGame.windowHasFocus) {
                toast.style.opacity = 1.0; // After toast is displayed
            }
        }, 50);

        setTimeout(function (e) {
            if (CamelGame.windowHasFocus) {
                toast.style.opacity = 0; // Starts CSS3 transition
            }

            setTimeout(function (e) {
                if (CamelGame.windowHasFocus) {
                    toast.style.display = 'none';
                }
            }, 480);
        }, howLong);
    },

    // Pause................................................................

    togglePaused: function () {
        var now = +new Date();

        this.paused = !this.paused;

        if (this.paused) {
            this.pauseStartTime = now;
        }
        else {
            this.lastAnimationFrameTime += (now - this.pauseStartTime);
        }
    },

    // Animation............................................................

    animate: function (now) {
        if (CamelGame.paused) {
            setTimeout(function () {
                requestNextAnimationFrame(CamelGame.animate);
            }, CamelGame.PAUSED_CHECK_INTERVAL);
        }
        else {
            CamelGame.fps = CamelGame.calculateFps(now);
            CamelGame.draw(now);
            requestNextAnimationFrame(CamelGame.animate);
        }
    },

    // ------------------------- INITIALIZATION ----------------------------

    start: function () {
        this.createSprites();
        this.initializeImages();
        this.equipRunner();

        this.healthProgressBar.adjustValue();
        this.waterProgressBar.adjustValue();
        this.bgVelocity = this.BACKGROUND_VELOCITY;
        CamelGame.splashToast('Good Luck!', 2000);

        this.turnRight();
        //requestNextAnimationFrame(CamelGame.animate);
    },

    initializeImages: function () {
        this.background.src = 'images/background-l1.png';
        //this.spritesheet.src = 'images/sprite_camel_big.png';
        this.spritesheet.src = 'images/sprite-sheet.png';
        this.background.onload = function (e) {
            CamelGame.startGame();
        };
    },

    startGame: function () {
        requestNextAnimationFrame(this.animate);
    },

    positionSprites: function (sprites, spriteData) {
        var sprite;

        for (var i = 0; i < sprites.length; ++i) {
            sprite = sprites[i];

            sprite.top = spriteData[i].top;
            sprite.left = spriteData[i].left;
        }
    },

    updateSprites: function (now) {
        var sprite;

        for (var i = 0; i < this.sprites.length; ++i) {
            sprite = this.sprites[i];

            if (sprite.visible && this.spriteInView(sprite)) {
                sprite.update(now, this.fps, this.context);
            }
        }
    },

    drawSprites: function () {
        var sprite;

        for (var i = 0; i < this.sprites.length; ++i) {
            sprite = this.sprites[i];

            if (sprite.visible && this.spriteInView(sprite)) {
                this.context.translate(-sprite.offset, 0);

                sprite.draw(this.context);

                this.context.translate(sprite.offset, 0);
            }
        }
    },

    spriteInView: function (sprite) {
        return sprite === this.runner || // runner is always visible
            (sprite.left + sprite.width > this.spriteOffset &&
            sprite.left < this.spriteOffset + this.canvas.width);
    },

    createSprites: function () {
        this.createOasisSprites();
        this.createTouristSprites();
        this.createPyramidSprites();
        this.createBushSprites();
        this.createPalmSprites();

        this.addSpritesToSpriteArray();
        this.initializeSprites();
    },

    initializeSprites: function () {
        for (var i = 0; i < CamelGame.sprites.length; ++i) {
            CamelGame.sprites[i].offset = 0;
        }
        this.positionSprites(this.oases, this.oasisData);
        this.positionSprites(this.tourists, this.touristData);
        this.positionSprites(this.pyramids, this.pyramidData);
        this.positionSprites(this.bushes, this.bushData);
        this.positionSprites(this.palms, this.palmData);
        //this.armSnails();
    },

    addSpritesToSpriteArray: function () {
        for (var i = 0; i < this.oases.length; ++i) {
            this.sprites.push(this.oases[i]);
        }
        for (var i = 0; i < this.tourists.length; ++i) {
            this.sprites.push(this.tourists[i]);
        }
        ;
        for (var i = 0; i < this.pyramids.length; ++i) {
            this.sprites.push(this.pyramids[i]);
        }
        ;
        for (var i = 0; i < this.bushes.length; ++i) {
            this.sprites.push(this.bushes[i]);
        }
        ;
        for (var i = 0; i < this.palms.length; ++i) {
            this.sprites.push(this.palms[i]);
        }
        ;
    },

    createTouristSprites: function () {
        var tourist,
            touristArtist = new SpriteSheetArtist(this.spritesheet, this.touristCells);

        for (var i = 0; i < this.touristData.length; ++i) {
            tourist = new Sprite('tourist', touristArtist);

            tourist.width = this.TOURIST_WIDTH;
            tourist.height = this.TOURIST_HEIGHT;

            this.tourists.push(tourist);
        }
    },

    createOasisSprites: function () {
        var oasis,
            oasisArtist = new SpriteSheetArtist(this.spritesheet, this.oasisCells);

        for (var i = 0; i < this.oasisData.length; ++i) {
            oasis = new Sprite('oasis', oasisArtist);

            oasis.width = this.OASIS_WIDTH;
            oasis.height = this.OASIS_HEIGHT;

            oasis.value = 10;

            this.oases.push(oasis);
        }
    },

    createPyramidSprites: function () {
        var pyramid,
            pyramidArtist = new SpriteSheetArtist(this.spritesheet, this.pyramidCells);

        for (var i = 0; i < this.pyramidData.length; ++i) {
            pyramid = new Sprite('pyramid', pyramidArtist);

            pyramid.width = this.PYRAMID_WIDTH;
            pyramid.height = this.PYRAMID_HEIGHT;

            pyramid.value = -20;

            this.pyramids.push(pyramid);
        }
    },

    createBushSprites: function () {
        var bush,
            bushArtist = new SpriteSheetArtist(this.spritesheet, this.bushCells);

        for (var i = 0; i < this.bushData.length; ++i) {
            bush = new Sprite('bush', bushArtist);

            bush.width = this.BUSH_WIDTH;
            bush.height = this.BUSH_HEIGHT;

            bush.value = 10;

            this.bushes.push(bush);
        }
    },

    createPalmSprites: function () {
        var palm,
            palmArtist = new SpriteSheetArtist(this.spritesheet, this.palmCells);

        for (var i = 0; i < this.palmData.length; ++i) {
            palm = new Sprite('palm', palmArtist);

            palm.width = this.PALM_WIDTH;
            palm.height = this.PALM_HEIGHT;

            palm.value = -10;

            this.palms.push(palm);
        }
    }
};

// Event handlers.......................................................

//touch on canvas - camel must change track
document.getElementById('game-canvas').addEventListener("touchstart", function (e) {
    var touch = e.touches[0];
    var trackHeight = CamelGame.canvas.height / 4;
    var trackNum = 4 - parseInt(touch.pageY / trackHeight);
    if (trackNum > CamelGame.runnerTrack) {
        CamelGame.runner.up();
        CamelGame.runnerTrack++;
    }
    else if (trackNum < CamelGame.runnerTrack) {
        CamelGame.runner.down();
        CamelGame.runnerTrack--;
    }
}, false);

//touch on jump
document.getElementById('jumpButton').addEventListener("touchstart", function (e) {
    var touch = e.touches[0];
   CamelGame.runner.jump();
}, false);

window.onkeydown = function (e) {
    var key = e.keyCode;

    if (key === 80 || (CamelGame.paused && key !== 80)) {  // 'p'
        CamelGame.togglePaused();
    }

    else if (key === 74) { // 'j'
        if (CamelGame.runnerTrack === 3) {
            return;
        }
        CamelGame.runner.up();
        CamelGame.runnerTrack++;
    }
    else if (key === 70) { // 'f'
        if (CamelGame.runnerTrack === 1) {
            return;
        }
        CamelGame.runner.down();
        CamelGame.runnerTrack--;
    }
    else if (key === 32) { // 'space'
        if (!CamelGame.runner.jumping && !CamelGame.runner.falling) {
            CamelGame.runner.jump();
        }
    }
}

window.onresize = function (e) { // change canvas size when window resize
    CamelGame.canvas.width = window.innerWidth;
    CamelGame.canvas.height = window.innerHeight;
}

window.onblur = function (e) {  // pause if unpaused
    CamelGame.windowHasFocus = false;

    if (!CamelGame.paused) {
        CamelGame.togglePaused();
    }
};

window.onfocus = function (e) {  // unpause if paused
    var originalFont = CamelGame.toast.style.fontSize;

    CamelGame.windowHasFocus = true;

    if (CamelGame.paused) {
        CamelGame.toast.style.font = '128px fantasy';

        CamelGame.splashToast('3', 500); // Display 3 for one half second

        setTimeout(function (e) {
            CamelGame.splashToast('2', 500); // Display 2 for one half second

            setTimeout(function (e) {
                CamelGame.splashToast('1', 500); // Display 1 for one half second

                setTimeout(function (e) {
                    if (CamelGame.windowHasFocus) {
                        CamelGame.togglePaused();
                    }

                    setTimeout(function (e) { // Wait for '1' to disappear
                        CamelGame.toast.style.fontSize = originalFont;
                    }, 2000);
                }, 1000);
            }, 1000);
        }, 1000);
    }
};

// Launch game.........................................................

var CamelGame = new CamelGame();
CamelGame.start();
