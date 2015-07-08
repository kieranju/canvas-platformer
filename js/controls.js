var keys = [];

keys.w = keys[87] = {
    pressed: false
};
keys.a = keys[65] = {
    pressed: false
};
keys.s = keys[83] = {
    pressed: false
};
keys.d = keys[68] = {
    pressed: false
};
keys.up = keys[38] = {
    pressed: false
};
keys.down = keys[40] = {
    pressed: false
};
keys.left = keys[37] = {
    pressed: false
};
keys.right = keys[39] = {
    pressed: false
};
keys.space = keys[32] = {
    pressed: false
};
keys.enter = keys[13] = {
    pressed: false
};
keys.shift = keys[16] = {
    pressed: false
};
keys.ctrl = keys[17] = {
    pressed: false
};
keys.esc = keys[27] = {
    pressed: false
};

keys.add = function (keyName, keyCode) {
    keys[keyName] = keys[keyCode] = {
        pressed: false
    };
};
keys.DOWN = function (e) {
    if (keys[e.keyCode] !== undefined)
        keys[e.keyCode].pressed = true;
};
keys.UP = function (e) {
    if (keys[e.keyCode] !== undefined)
        keys[e.keyCode].pressed = false;
};

document.body.addEventListener("keydown", function (e) {
    keys.DOWN(e);
});
document.body.addEventListener("keyup", function (e) {
    keys.UP(e);
});
