function Player () {
    var DFLT_WIDTH = 15,
        DFLT_HEIGHT = 25,
        DFLT_COLOR = '#' + Math.floor(Math.random() * 16777215).toString(16),
        DFLT_SPEED = 4;

    this.width = DFLT_WIDTH;
    this.height = DFLT_HEIGHT;
    this.color = DFLT_COLOR;
    this.x = 0;
    this.y = 0;
    this.speed = DFLT_SPEED;
    this.velX = 0;
    this.velY = 0;

    this.jumping = false;
    this.facing = false;

    this.cooldown = {};
    this.combo = {};
}

Player.prototype.init = function (canvWidth, canvHeight, width, height, color, speed) {
    this.width = width;
    this.height = height;
    this.x = canvWidth / 2;
    this.y = canvHeight - 5;
    this.color = color;
    this.speed = speed;
};

Player.prototype.tilt = function () {
    var velocity = this.velX / 10;

    if (velocity > 0.1)
        tilt = 0.1;
    else if (velocity < -0.1)
        tilt = -0.1;
    else
        tilt = velocity;

    return tilt;
};

Player.prototype.setcd = function (skillname) {
    this.cooldown[skillname] = new Date().getTime() / 1000;
};
Player.prototype.checkcdtime = function (skillname, length) {
    if ((this.cooldown[skillname]+ length) >= (new Date().getTime() / 1000)) {
        return false; // still on cooldown
    }
    else {
        return true;
    }
};

Player.prototype.setcombo = function (skillname, count) {
    this.combo[skillname] = count;
};
Player.prototype.checkcombo = function (skillname) {
    var combo = this.combo[skillname];

    if (typeof combo != 'undefined') {
        return combo;
    }
    else {
        return 0;
    }
};

Player.prototype.update = function () {

    if (document.activeElement == document.body) {
        this.keypressUP();
        this.keypressDOWN();
    }

    this.keypressLEFT();
    this.keypressRIGHT();

    this.keypressENTER();
    this.keypressESC();

    this.interactionMovement();
    this.interactionWalls();
    this.interactionFloor();
};

Player.prototype.render = function () {
    ctx.save();

    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.tilt());

    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore();
};

Player.prototype.keypressUP = function () {
    var JUMP_SPD = 1.6;
    var DASH_SPD_HORIZ = 9.5;
    var DASH_SPD_VERT = 4.5;

    if (keys.up.pressed && this.speed > 0) {
        if (!this.jumping) {
            this.jumping = true;
            this.velY = -this.speed * JUMP_SPD;
        }
        if (this.velY > -0.25) {
            if (this.checkcombo('dash') === 0 || typeof this.checkcombo('dash') == 'undefined') {
                this.velX = (this.facing) ? this.velX + DASH_SPD_HORIZ : this.velX - DASH_SPD_HORIZ;
                this.velY -= DASH_SPD_VERT;
                this.setcombo('dash', 1);
            }
        }
    }
};
Player.prototype.keypressLEFT = function () {
    var JUMP_MOD = 0.5;

    if (keys.left.pressed) {
        if (this.facing === true) this.facing = false;

        if (!this.forceControl()) return;

        if (this.speed > 0) {
            if (this.velX > -this.speed) {
                if (this.jumping) {
                    this.velX -= JUMP_MOD;
                }
                else {
                    this.velX--;
                }
            }
        }
    }
};
Player.prototype.keypressRIGHT = function () {
    var JUMP_MOD = 0.5;

    if (keys.right.pressed) {
        if (this.facing === false) this.facing = true;

        if (!this.forceControl()) return;

        if (this.speed > 0) {
            if (this.velX < this.speed) {
                if (this.jumping) {
                    this.velX += JUMP_MOD;
                }
                else {
                    this.velX++;
                }
            }
        }
    }
};
Player.prototype.keypressDOWN = function () {
    var SURGE_SPD = 22;
    var SURGE_FULL_CD = 0.8;
    var SURGE_DELAY_CD = 0.27;
    var SURGE_COMBO_CD = 0.40;

    if (keys.down.pressed) {
        if (!this.jumping) {
            if (this.checkcdtime('surgeDelay', SURGE_DELAY_CD)) {

                var bindtime = 250;
                var multi = 0.9;
                var combo = this.checkcombo('surge');

                if (combo == 4) {
                    if (!this.checkcdtime('surge', SURGE_FULL_CD)) return;
                }
                if (this.checkcdtime('surgeCombo', SURGE_COMBO_CD)) {
                    combo = 0;
                }

                switch (combo) {
                    case 0:
                        combo++;
                        break;
                    case 1:
                        combo++;
                        break;
                    case 2:
                        combo++;
                        break;
                    case 3:
                        bindtime += 200;
                        multi = 1.25;
                        combo++;
                        break;
                }

                this.velX = (this.facing) ? this.velX + SURGE_SPD * multi : this.velX - SURGE_SPD * multi;

                this.setcombo('surge', combo);
                this.setcd('surgeDelay');
                this.setcd('surgeCombo');
                this.setcd('surge');

                var oldspeed = this.speed;
                this.speed = 0;
                setTimeout(function () { this.speed = oldspeed; }.bind(this), bindtime);
            }
        }
    }
};

Player.prototype.keypressENTER = function () {
    var TALK_CD = 0.15;

    if (keys.enter.pressed) {
        if (this.checkcdtime('talk', TALK_CD)) {
            input = document.getElementById('talk');

            if (document.activeElement == input) {
                if (input.value.trim() != '') {

                    var chat = new Chat();
                    chat.init(input.value.trim(), this.x + (this.width / 2), this.y - 15, undefined, undefined, 0.005);
                    chatbubbles.push(chat);

                    input.value = '';
                }
                input.blur();
            }
            else {
                input.focus();
            }

            this.setcd('talk');
        }
    }
};
Player.prototype.keypressESC = function () {
    if (keys.esc.pressed) {
        input = document.getElementById('talk');

        if (document.activeElement == input) {
            input.blur();
        }
    }
};

Player.prototype.interactionMovement = function () {
    if (this.jumping) {
        this.velY += gravity;
        this.velX *= friction + 0.1;
    }
    else {
        this.velY = 0;
        this.velX *= friction;
    }

    this.x += this.velX;
    this.y += this.velY;
};
Player.prototype.interactionWalls = function () {
    if (this.x >= width - this.width) {
        this.x = width - this.width;
    }
    else if (this.x <= 0) {
        this.x = 0;
    }
};
Player.prototype.interactionFloor = function () {
    if (this.y >= height - this.height) {
        this.y = height - this.height;
        this.jumping = false;
        this.setcombo('dash', 0);
    }
};

Player.prototype.forceControl = function () {
    if (document.activeElement != document.body) {
        input = document.getElementById('talk');

        if (document.activeElement == input && input.value.trim() == '') {
            input.blur();
            return true;
        }
        else return false;
    }
    return true;
};
