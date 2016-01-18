var particles = [];
var particleStore = [];

var chatbubbles = [];

// TODO: create particle generator class to handle intervals to create new particles and pooling

function Dot () {
    var DFLT_WIDTH = 2;
    var DFLT_HEIGHT = 2;
    var DFLT_COLOR = '#' + Math.floor(Math.random() * 16777215).toString(16);
    var DFLT_SPEED = 2;
    var DFLT_ALPHA = 1;
    var DFLT_DECAY = 0.1;
    var DFLT_INTERVAL = 1;

    this.width = DFLT_WIDTH;
    this.height = DFLT_HEIGHT;
    this.color = DFLT_COLOR;
    this.x = 0;
    this.y = 0;
    this.speed = DFLT_SPEED;
    this.velX = 0;
    this.velY = 0;

    this.alpha = DFLT_ALPHA;
    this.decay = DFLT_DECAY;

    this.counter = 0;
    this.interval = DFLT_INTERVAL;
}

Dot.prototype.init = function (x, y, color, width, height, speed, alpha, decay, interval) {
    this.x = x;
    this.y = y;
    this.color = (typeof color != 'undefined') ? color : this.color;
    this.width = (typeof width != 'undefined') ? width : this.width;
    this.height = (typeof height != 'undefined') ? height : this.height;
    this.speed = (typeof speed != 'undefined') ? speed : this.speed;
    this.alpha = (typeof alpha != 'undefined') ? alpha : this.alpha;
    this.decay = (typeof decay != 'undefined') ? decay : this.decay;
    this.interval = (typeof interval != 'undefined') ? interval : this.interval;
};

Dot.prototype.update = function () {
    this.alpha = (this.alpha < 0.1) ? 0 : this.alpha - this.decay;
    this.counter++;
};

Dot.prototype.render = function () {
    if (this.counter % this.interval === 0) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
    }
};

function Chat() {
    var DFLT_ALPHA = 1;
    var DFLT_DECAY = 0.1;

    this.text = '';

    this.color = '#000';
    this.x = 0;
    this.y = 0;
    this.displace = 0;

    this.alpha = DFLT_ALPHA;
    this.decay = DFLT_DECAY;
}

Chat.prototype.init = function (text, x, y, color, alpha, decay) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = (typeof color != 'undefined') ? color : this.color;
    this.alpha = (typeof alpha != 'undefined') ? alpha : this.alpha;
    this.decay = (typeof decay != 'undefined') ? decay : this.decay;
};

Chat.prototype.update = function (x, y) {
    this.alpha = (this.alpha < 0.1) ? 0 : this.alpha - this.decay;
    this.x = x;
    this.y = y;
};

Chat.prototype.render = function () {

    ctx.globalAlpha = this.alpha;
    var text = this.text;
    ctx.font = '12px Verdana';
    ctx.fillText(text, this.x - (ctx.measureText(text).width / 2), this.y + 2 + this.displace);
    ctx.globalAlpha = 1;

};
