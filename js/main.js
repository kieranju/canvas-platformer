window.requestAnimFrame = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

var canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
width = 800;
height = 600;

canvas.width = width;
canvas.height = height;

setTimeout(function () {
    canvas.className += 'intro'; // just to be cool, okay?
}, 30);


friction = 0.87;
gravity = 0.4;

function init () {
    player = new Player();
    player.init(width, height, 17, 27, '#13BF83', 4);
}

function update () {
    player.update();

    var dot = new Dot();
    dot.init(player.x, player.y, '#13BF83', player.width, player.height, undefined, 0.5, 0.05, 4);
    particles.push(dot);
    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
    }
}
function render () {
    ctx.clearRect(0, 0, width, height);

    // ctx.font = '12px Verdana';
    // ctx.fillText('combo: ' + player.checkcombo('surge'), 10, 20, 300);

    for (var i = 0; i < particles.length; i++) {
        particles[i].render();
    }

    player.render();
}
function tick () {
    update();
    render();
    requestAnimationFrame(tick);
}

window.addEventListener('load', function () {
    init();
    tick();
});
